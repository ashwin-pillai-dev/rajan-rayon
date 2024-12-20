import SeachBox from "@/app/components/SeachBox"

export default async function Page({
    params,
}: {
    params: Promise<{ materialId: string }>
}) {
    const materialId = (await params).materialId

    const stocks = await prisma.transactionLog.findMany({
        where: {
            materialId: Number(materialId),
            entityType: {
                equals: 'MATERIAL'

            }
        },
        include: {
            material: true,
            supplier: true
        }
    })

    const SumtotalAmount:number = stocks.reduce((sum, item) => {
        console.log('sum: ',sum);
        console.log('item: ',item);
        const totalAmount = item?.totalAmount ?? 0; 
        return item.transactionType == "INWARD"
            ? sum + totalAmount?totalAmount:0
            : sum - totalAmount?totalAmount:0;
    }, 0);

    console.log('totalAmount: ',SumtotalAmount);


    const totalQuantity = stocks.reduce((sum, item) => {
        // Convert grams to kilograms

        

        return item.transactionType === "INWARD"
            ? sum + item.quantity
            : sum - item.quantity;
    }, 0);

    


    return (
        <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
            <div className=" px-4 mx-auto max-w-screen-xl px-4 lg:px-12">

                <div className="bg-white px-4 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <SeachBox name="name" placeholder='Name' />
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <a href={`/admin/material/stock-updates/add/${materialId}`} className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
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
                                                        {stock.quantity} KGs
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
                                    </td>
                                    <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="font-medium text-center text-gray-700 whitespace-nowrap dark:text-white">
                                        {totalQuantity}Kgs
                                        </span>
                                    </td>
                                    <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="font-medium text-center text-gray-700 whitespace-nowrap dark:text-white">
                                            {SumtotalAmount}
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