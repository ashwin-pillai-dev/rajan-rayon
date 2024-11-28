import MaterialAddForm from './MaterialAddForm'
export default function page() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add New Material
                </h2>
                <MaterialAddForm isEdit={false} />
            </div >
        </section >
    )
}