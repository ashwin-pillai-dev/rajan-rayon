import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import prisma from './lib/prisma';
import type { Provider } from "next-auth/providers"

const providers:Provider[] =[
  Credentials({
    name: 'credentials',

    authorize: async (credentials) => {
      console.log('credentials: ', credentials);

      const admin = await prisma.admin.findUnique({
        where: {
          email: credentials.email?.toString()
        },

      })
      console.log('admin: ', admin);

      if (!admin) {
        throw new Error('Admin not found')
      }

      const password:string = credentials.password?.toString()?credentials.password?.toString():''

      const isPasswordValid = await bcrypt.compare(
        password,
        admin.password?admin.password:''
      )

      if (!isPasswordValid) {
        throw new Error('Invalid Password')
      }

      console.log('admin found:');
      console.log({
        id: admin.id.toString(),
        email: admin.email,
        name: admin.name,
      });


      return {
        id: admin.id.toString(),
        email: admin.email,
        name: admin.name,
        callbackUrl:credentials.callbackUrl
      }

    }
  })

]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {

    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
        },
        accessToken: token
      }
    },
    jwt: ({ token, user }) => {
      return token
    },
    authorized: async ({ auth }) => {      
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  }

  
})

