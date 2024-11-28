'use server'

import { signIn } from "@/auth"
import { loginFormType } from "./loginZodSchema";



export async function login(payload:loginFormType):Promise<string | null>{
try {
        const {email,password}= payload
        const creds = new FormData();
        creds.set('email',email)
        creds.set('password',password)
       const res= await signIn("credentials",{
        email: email,
        password: password,
        redirect: false
    }
       );
       const resUrl = new URL(res, )
       const resString =resUrl.searchParams.get('callbackUrl')
       return resString
       
} catch (error) {
    console.error('login error: ',error);
    
    throw (error)
}

}