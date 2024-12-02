'use server';
import SearchBox from "@/app/components/SeachBox"
import { failToastMessage } from "@/app/utils/toastMeassages";
import prisma from "@/lib/prisma";
import { Supplier, Prisma, Shade } from "@prisma/client";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  type ShadeWithRelations = Prisma.ShadeGetPayload<{
    include: {
      chemicalComposition: {
        include: {
          chemical: true
        }
      },
      colorComposition: {
        include: {
          color: true
        }
      },
    }
  }>
  const { page = '1', limit = '10', sort = 'asc', name = '' } = await searchParams;
  let args: Prisma.ShadeFindManyArgs = {};
  args.include = {
    colorComposition: {
      include: {
        color: true
      }
    },
    chemicalComposition: {
      include: {
        chemical: true
      }
    }
  }

  if (name) {
    args.where = {
      name: {
        contains: name,
      },
    };
  }

  let shades: ShadeWithRelations[] = [];

  try {
    const res: any = await prisma.shade.findMany(args);
    shades = res;
    console.log('Shades: ', shades);
  } catch (error) {
    failToastMessage({ message: 'Error fetching shades' });
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <SearchBox name="name" placeholder="Shade Name" />
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <a
                href="/admin/shades/add"
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
                Add New Shade
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Shade Name</th>
                  <th className="px-4 py-3">Color Compsition</th>
                  <th className="px-4 py-3">Chemical Composition</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shades.map((shade) => (
                  <tr className="border-b dark:border-gray-700" key={shade.id}>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                      {shade.name}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      <ul>
                        {
                          shade.colorComposition.map((item, index) => {
                            return (
                              <li key={index} >{item.color.name} : {item.quantity} grams</li>
                            )
                          })
                        }

                      </ul>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      <ul>
                        {

                          shade.chemicalComposition.map((item, index) => {
                            return (
                              <li key={index} >{item.chemical.name} : {item.quantity} grams</li>
                            )
                          })
                        }
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/admin/shades/edit/${shade.id}`} className="text-blue-400 cursor-pointer text-underline">
                        Edit
                      </a>
                    </td>
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
