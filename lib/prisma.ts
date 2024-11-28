import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV === 'production') {
  const libsql = createClient({
    url: `${process.env.TURSO_DATABASE_URL}`,
    authToken: `${process.env.TURSO_AUTH_TOKEN}`,
  })

  const adapter = new PrismaLibSQL(libsql)
  prisma = new PrismaClient({ adapter }) //comment for running seed file
} else {
  if (!global.prisma) {
    
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}
// prisma = new PrismaClient() uncomment for running seed file

export default prisma