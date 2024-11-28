import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma';
import { type Prisma } from '@prisma/client';



console.log('database url',process.env.TURSO_DATABASE_URL);




async function main() {
// Create an admin with the superadmin role
const admin = await prisma.admin.create({
    data: {
        name: 'Ashwin Pillai',
        email: 'ashwinpillai@gmail.com',
        password: await bcrypt.hash('123456789', 10),
        contact: '9834820988',
        role:{
            connect:{
                id:1
            }
        }

    },
});
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
