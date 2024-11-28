'use client';


import { useForm } from "react-hook-form";
import { loginFormType, loginSchema } from "./loginZodSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from "./actions";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { failToastMessage, succesToastMessage } from "../utils/toastMeassages";

export default function LoginForm() {
    const router = useRouter()
    const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<loginFormType>({
        resolver: zodResolver(loginSchema)
    });

    async function onSubmit(payLoad: loginFormType) {
        try {
            const res: any = await login(payLoad)
            if (res) {
                const resUrl = new URL(res)
                console.log('client URL: ', resUrl);
                succesToastMessage({ message: 'Successfully logged in !!' })
                router.push(resUrl.pathname)
            }
            else{
                failToastMessage({ message: 'Unable to log in !!' })
            }
        } catch (error) {
            failToastMessage({ message: 'Unable to log in !!' })
            console.error(error)

        }

    }

    return (
        <form className="md:space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("email")}
                    id="email"
                    className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'}`}
                    placeholder="name@company.com"
                />
                {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    {...register("password")}
                    id="password"
                    placeholder="••••••••"
                    className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'}`}
                />
                {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <Button size="md"
                isProcessing={isSubmitting}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
                Sign in
            </Button>
        </form>
    );
}
