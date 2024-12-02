import { Prisma } from '@prisma/client'
import ProductionAddForm from './ProductionAddForm'
export default async function page() {

    
     const[materials,shades]= await Promise.all([
        prisma.material.findMany(),
        prisma.shade.findMany({
          include: {
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
        }),
      ])
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add New Production Log
                </h2>
                <ProductionAddForm isEdit={false} shades={shades} materials={materials}/>
            </div >
        </section >
    )
}