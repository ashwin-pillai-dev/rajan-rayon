import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma';
import { type Prisma } from '@prisma/client';



console.log('database url',process.env.TURSO_DATABASE_URL);




async function main() {
// Create an admin with the superadmin role


// const superadmin =  await prisma.adminRole.create({data:{roleName:'superadmin'}})

// const admin = await prisma.admin.create({
//     data: {
//         name: 'Ashwin Pillai',
//         email: 'ashwinpillai@gmail.com',
//         password: await bcrypt.hash('123456789', 10),
//         contact: '9834820988',
//         role:{
//             connect:{
//                 id:superadmin.id
//             }
//         }

//     },
// });


const data: Prisma.TransactionLogCreateInput = {
    quantity: 34,
    transactionType: 'INWARD',
    entityType: 'MATERIAL',
    billDate: new Date('2024-11-20'),
    invoice: 'INV12345',
    totalAmount: 5000,
    receivingDate: new Date('2024-11-28'),
    transportationCost: undefined,
    units: 5000,
    material: { connect: { id: 1 } },
    supplier: { connect: { id: 1 } }

}
console.log('addStocksToMaterialData: ', data);


const res = await prisma.transactionLog.create({
    data,
    include: {
        material: true,
        supplier: true,
    }
}
) 
console.log('material-log add response: ',res);


}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
