'use server';
import SearchBox from "@/app/components/SeachBox"
import { failToastMessage } from "@/app/utils/toastMeassages";
import prisma from "@/lib/prisma";
import { Supplier, Prisma } from "@prisma/client";

type productionLogsNestedType = Prisma.ProductionLogGetPayload<{
  include: {
    shade:true,
    materialsUsed: {
      include: {
        material: true,
        chemical: true,
        color: true
      }
    }
  }
}>

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page = '1', limit = '10', sort = 'asc', shade = '' } = await searchParams;
  let args: Prisma.ProductionLogFindManyArgs = {};

  if (shade) {
    args.where = {
      shade:{
        name:{
          contains:shade
        }
      }
    };
  }


  let productionLogs: productionLogsNestedType[] = [];

  try {
    productionLogs = await prisma.productionLog.findMany({
      include: {
        shade:true,
        materialsUsed: {
          include: {
            material: true,
            chemical: true,
            color: true,
            
          }
        }
      },
      where: args.where
    });
    console.log('Production logs: ', productionLogs);
  } catch (error) {
    failToastMessage({ message: 'Error fetching production logs' });
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <SearchBox name="shade" placeholder="Shade Name" />
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <a
                href="/admin/production/add"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add Production
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Production Date</th>
                  <th className="px-4 py-3">Shade</th>
                  <th className="px-4 py-3">Quantity Produced</th>
                  {/* <th className="px-4 py-3">GST Number</th>
                  <th className="px-4 py-3">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {productionLogs.map((log) => (
                  <tr className="border-b dark:border-gray-700" key={log.id}>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        {log.productionDate.toDateString()}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{log.shade.name}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{log.quantityProduced}</td>
                    {/* <td className="px-4 py-3">
                      <a
                        href={`/admin/suppliers/edit/${supplier.id}`}
                        className="text-blue-400 cursor-pointer text-underline"
                      >
                        Edit
                      </a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
