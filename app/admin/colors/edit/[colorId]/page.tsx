import ColorAddForm from '../../add/ColorAddForm';
import MaterialAddForm from '../../add/ColorAddForm';
export default async function page({ params }: { params: Promise<{ colorId: string }> }) {

    const {colorId} = await params;
    

    const color = await prisma.color.findFirstOrThrow(
        {
            where: {
                id: {
                    equals: Number(colorId)
                }
            }
        }
    )

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Edit Color
                </h2>
                <ColorAddForm isEdit={true} colorId={Number(colorId)} colorData={{ name: color.name, avgPrice: color.avgPrice, quantity: color.quantity }} />
            </div >
        </section >
    )
}