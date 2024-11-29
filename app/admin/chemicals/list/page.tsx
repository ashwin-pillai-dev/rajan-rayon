import PaginationComp from "@/app/components/PaginationComp"
import SeachBox from "@/app/components/SeachBox";
import { requestParams } from "@/app/utils/queryHelper/queryHelper.types";
import { failToastMessage } from "@/app/utils/toastMeassages";
import prisma from "@/lib/prisma";
import { Chemical, type Prisma } from "@prisma/client"



export default async function page({ searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {

    const { page = '1', limit = '10', sort = 'asc', name = '' } = await searchParams;
    let args: Prisma.ChemicalFindManyArgs = {}
    if (name) {
        args.where = {
            name: {
                contains: name
            }
        }
    }
    let chemicals: Chemical[] = [];
    try {
        chemicals = await prisma.chemical.findMany(args)

    } catch (error) {
        failToastMessage({ message: 'Error fetching materials' })

    }




    return (
        <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                {/* <!-- Start coding here --> */}
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <SeachBox name="name" placeholder='Name' />
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <a href="/admin/chemicals/add" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                Add New Chemical
                            </a>


                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">chemicals Name</th>
                                    <th scope="col" className="px-4 py-3">Total Stock</th>
                                    <th scope="col" className="px-4 py-3">AVG Price</th>
                                    <th scope="col" className="px-4 py-3">Total Price</th>
                                    <th scope="col" className="px-4 py-3">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chemicals.map((chemical) => {
                                        return (
                                            <tr className="border-b dark:border-gray-700" key={chemical.id}>


                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                <Image fill={true} style={{objectFit:'contain'}} src={s3bucketurl + category.image } alt="" className="rounded-full" />
                                                </div> */}
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                    <a href={`/admin/chemicals/stock-updates/${chemical.id}`} className="text-blue-400 cursor-pointer text-underline">
                                                        {chemical.name}
                                                        </a>
                                                    </span>

                                                </td>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                <Image fill={true} style={{objectFit:'contain'}} src={s3bucketurl + category.image } alt="" className="rounded-full" />
                                                </div> */}
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                       {chemical.quantity} KGs
                                                    </span>

                                                </td>
                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                <Image fill={true} style={{objectFit:'contain'}} src={s3bucketurl + category.image } alt="" className="rounded-full" />
                                                </div> */}
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {chemical.avgPrice}
                                                    </span>

                                                </td>

                                                <td scope="col" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <span className="font-medium text-gray-700 whitespace-nowrap dark:text-white">
                                                        {(chemical.totalAmount).toFixed(2)} 
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <a href={`/admin/chemicals/edit/${chemical.id}`} className="text-blue-400 cursor-pointer text-underline">
                                                        Edit
                                                    </a>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>

                        {/* <PaginationComp  total={categories.total}  /> */}
                    </div>

                </div>
            </div>
        </section>
    )

}