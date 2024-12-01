import ShadeAddForm from '../../add/ShadeAddForm';
import { shadeFormType } from '../../add/shadeSchema';
export default async function page({ params }: { params: Promise<{ shadeId: string }> }) {

    const { shadeId } = await params;
    const [colors, chemicals,shade] = await Promise.all([
        prisma.color.findMany(),
        prisma.chemical.findMany(),
        prisma.shade.findFirstOrThrow(
            {
                where: {
                    id: {
                        equals: Number(shadeId)
                    },
                },
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
            }
        )

    ])

    const shadeEditData: shadeFormType = {
        id: shade.id,
        name: shade.name,
        colorComposition: shade.colorComposition,
        chemicalComposition: shade.chemicalComposition

    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                   { `Editing ${shadeEditData.name} shade`}
                </h2>
                <ShadeAddForm isEdit={true} shadeId={Number(shadeId)} shadeData={shadeEditData} colors={colors} chemicals={chemicals} />
            </div >
        </section >
    )
}