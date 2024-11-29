import InwardTransactionForm from "@/app/admin/components/NavSideWrapper/InwardTransactionForm"
import Loading from "@/app/admin/loading"
import { Chemical, Color, Material, Supplier } from "@prisma/client"
import { Suspense } from "react"
import { addStocksToChemical } from "../../../actions"

export default async function Page({
    params,
}: {
    params: Promise<{ chemicalId: string }>
}) {
    const chemicalId = Number((await params).chemicalId)
    const [suppliers, chemical]: [Supplier[], Chemical] = await Promise.all([
        prisma.supplier.findMany(),
        prisma.chemical.findUniqueOrThrow({
            where: {
                id: chemicalId,
            },
        }),
    ]);
    return (
        <Suspense fallback={<Loading />}>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        {`Adding stocks to ${chemical.name} `}
                    </h2>
                    <InwardTransactionForm entityType="CHEMICAL" entityId={chemicalId} suppliers={suppliers} addInwardTransaction={addStocksToChemical}  />
                </div>
            </section>
        </Suspense>

    )
}