import InwardTransactionForm from "@/app/admin/components/NavSideWrapper/InwardTransactionForm"
import Loading from "@/app/admin/loading"
import { Material, Supplier } from "@prisma/client"
import { Suspense } from "react"
import { addStocksToMaterial } from "../../../actions"

export default async function Page({
    params,
}: {
    params: Promise<{ materialId: string }>
}) {
    const materialId = Number((await params).materialId)
    const [suppliers, material]: [Supplier[], Material] = await Promise.all([
        prisma.supplier.findMany(),
        prisma.material.findUniqueOrThrow({
            where: {
                id: materialId,
            },
        }),
    ]);
    return (
        <Suspense fallback={<Loading />}>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        {`Adding stocks to ${material.name} `}
                    </h2>
                    <InwardTransactionForm entityType="MATERIAL" entityId={materialId} suppliers={suppliers} addInwardTransaction={addStocksToMaterial}  />
                </div>
            </section>
        </Suspense>

    )
}