import ChemicalAddForm from '../../add/ChemicalAddForm';
export default async function page({ params }: { params: Promise<{ chemicalId: string }> }) {

    const {chemicalId} = await params;
    

    const color = await prisma.chemical.findFirstOrThrow(
        {
            where: {
                id: {
                    equals: Number(chemicalId)
                }
            }
        }
    )

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Edit Chemical
                </h2>
                <ChemicalAddForm isEdit={true} chemicalId={Number(chemicalId)} chemicalData={{ name: color.name, avgPrice: color.avgPrice, quantity: color.quantity }} />
            </div >
        </section >
    )
}