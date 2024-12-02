import DropDownFilter from "@/app/components/DropDownFilter";
import SeachBox from "@/app/components/SeachBox"
import { Prisma } from "@prisma/client";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ chemicalId: string }>,
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const chemicalId = (await params).chemicalId
    const transactionTypes = [
        { transactionType: 'INWARD', name: 'INWARD' },
        { transactionType: 'OUTWARD', name: 'OUTWARD' }
    ]

    const { page = '1', limit = '10', sort = 'asc', transactionType = '' } = await searchParams;
    const argsWhers: Prisma.TransactionLogWhereInput = {
        chemicalId: Number(chemicalId),
        entityType: {
            equals: 'CHEMICAL'
        }
    }
    if (transactionType) {
        argsWhers.transactionType = transactionType
    }
    const stocks = await prisma.transactionLog.findMany({
        where: argsWhers,
        include: {
            chemical: true,
            supplier: true
        }
    })

    const totalQuantityInKg = stocks.reduce((sum, item) => {
        const quantityInKg = item.transactionType === "INWARD"
            ? item.quantity // Already in kilograms
            : item.quantity / 1000; // Convert grams to kilograms

        return item.transactionType === "INWARD"
            ? sum + quantityInKg
            : sum - quantityInKg;
    }, 0);
    return (
        <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
            <div className=" px-4 mx-auto max-w-screen-xl px-4 lg:px-12">

                <div className="bg-white px-4 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-between md:space-x-4 flex-shrink-0">
                        <DropDownFilter options={transactionTypes} field="transactionType" placeholder="Transaction Type" />
                        <SeachBox name="name" placeholder="Name" />
                        <a href={`/admin/chemicals/stock-updates/add/${chemicalId}`} className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Add New stock
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Date</th>
                                    <th scope="col" className="px-4 py-3">Inward/Outward</th>
                                    <th scope="col" className="px-4 py-3">Quantity</th>
                                    <th scope="col" className="px-4 py-3">Total Amount</th>
                                    <th scope="col" className="px-4 py-3">Notes</th>
                                    <th scope="col" className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stocks.map((stock) => {
                                        return (
                                            <tr className="border-b dark:border-gray-700" key={stock.id}>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {stock.receivingDate ? stock.receivingDate?.toDateString() : 'NA'}
                                                    </span>
                                                </td>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className={`font-medium ${stock.transactionType == 'INWARD' ? 'text-green-700' : 'text-red-800'} whitespace-nowrap dark:text-white`}>
                                                        {stock.transactionType}
                                                    </span>
                                                </td>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {stock.quantity} {stock.transactionType == 'INWARD' ? 'KG' : 'Grams'}
                                                    </span>

                                                </td>
                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {stock.totalAmount}
                                                    </span>

                                                </td>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {stock?.description}
                                                    </span>

                                                </td>

                                            </tr>
                                        )
                                    })
                                }

                                <tr>
                                    <td className="px-4 py-3 font-semibold">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        N/A
                                    </td>
                                    <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="font-medium text-center text-gray-700 whitespace-nowrap dark:text-white">
                                            {totalQuantityInKg.toFixed(2)} Kgs
                                        </span>
                                    </td>
                                    <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="font-medium text-center text-gray-700 whitespace-nowrap dark:text-white">
                                            {stocks.reduce((sum, item) => sum + (item.totalAmount ? item.totalAmount : 0), 0)}
                                        </span>
                                    </td>

                                </tr>

                            </tbody>
                        </table>

                        {/* <PaginationComp  total={categories.total}  /> */}
                    </div>
                </div>




            </div>
        </section>
    )
}