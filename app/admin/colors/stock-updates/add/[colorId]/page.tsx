import InwardTransactionForm from "@/app/admin/components/NavSideWrapper/InwardTransactionForm"
import Loading from "@/app/admin/loading"
import { Color, Material, Supplier } from "@prisma/client"
import { Suspense } from "react"
import { addStocksToColors } from "../../../actions"

export default async function Page({
    params,
}: {
    params: Promise<{ colorId: string }>
}) {
    const colorId = Number((await params).colorId)
    const [suppliers, color]: [Supplier[], Color] = await Promise.all([
        prisma.supplier.findMany(),
        prisma.color.findUniqueOrThrow({
            where: {
                id: colorId,
            },
        }),
    ]);
    return (
        <Suspense fallback={<Loading />}>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        {`Adding stocks to ${color.name} `}
                    </h2>
                    <InwardTransactionForm entityType="COLOR" entityId={colorId} suppliers={suppliers} addInwardTransaction={addStocksToColors}  />
                </div>
            </section>
        </Suspense>

    )
}