import LoginForm from "./LoginForm";


export default function page(props: {
    searchParams: { callbackUrl: string | undefined }
  }) {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 my-0 py-0 ">
            <div className="flex flex-col items-center justify-between   h-screen  mx-auto  lg:py-0">

                <div className="flex flex-col items-center justify-center w-full  h-full">
                    <div className="w-full bg-white rounded-lg shadow dark:border  sm:max-w-md xl:py-0 dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="px-6 space-x-4 md:space-x-6 ">
                            {/* <a href="#" className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <Image height={500} width={130} className="h-32 max-w-full rounded-lg" src="/ayur-arogyam-logo.png" alt="image description" />
                    </a> */}
                            <h1 className="text-xl font-bold leading-tight mb-4 tracking-tight place-self-center text-primary-700 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <LoginForm />
                            
                        </div>
                    </div>
                </div>
                {/* <DefaultFooter /> */}
            </div>
        </section>
    )
}
