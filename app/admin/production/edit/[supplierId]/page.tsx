import SupplierAddForm from '../../add/ProductionAddForm';
export default async function page({ params }: { params: Promise<{ supplierId: string }> }) {

    const {supplierId} = await params;
    

    const supplier = await prisma.supplier.findFirstOrThrow(
        {
            where: {
                id: {
                    equals: Number(supplierId)
                }
            }
        }
    )

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Edit Supplier
                </h2>
                <SupplierAddForm isEdit={true} supplierId={Number(supplierId)} supplierData={supplier?supplier:undefined } />
            </div >
        </section >
    )
}