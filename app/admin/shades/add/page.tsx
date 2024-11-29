import ShadeAddForm from './ShadeAddForm'
export default async function page() {
 const [colors,chemicals]=await  Promise.all([prisma.color.findMany(), prisma.chemical.findMany()] )  
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add New Shade
                </h2>
                <ShadeAddForm isEdit={false} colors={colors} chemicals={chemicals} />
            </div >
        </section >
    )
}