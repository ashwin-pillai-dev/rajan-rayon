import MaterialAddForm from '../../add/MaterialAddForm';
export default async function page({ params }: { params: Promise<{ materialId: string }> }) {

    const {materialId} = await params;
    

    const material = await prisma.material.findFirstOrThrow(
        {
            where: {
                id: {
                    equals: Number(materialId)
                }
            }
        }
    )

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Edit Material
                </h2>
                <MaterialAddForm isEdit={true} materialId={Number(materialId)} materialData={{ name: material.name, avgPrice: material.avgPrice, quantity: material.quantity }} />
            </div >
        </section >
    )
}