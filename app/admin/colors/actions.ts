'use server'
import { Color, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { colorsFormType } from './add/colorSchema';
import { inwardTransactionFormType } from '../components/zodSchemas/inwardTransacrionSchema';


export async function addColor(input: colorsFormType):Promise<Color> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ColorCreateInput = {
        name: name,
        avgPrice : avgPrice/quantity,
        quantity,
        openingStock:quantity,
        totalAmount:avgPrice,

    }
    let color:Color;
    try {

        color = await prisma.color.create({
            data

        });

        await prisma.transactionLog.create({
            data:{
                entityType:'COLOR',
                transactionType:'INWARD',
                quantity:data.quantity,
                totalAmount:avgPrice,
                units:quantity,
                description:`${data.quantity}kgs color added as opening stock`,
                colorId:color.id
            }
        })

    return color;        

    } catch (error) {
        console.error('Error adding color:', error);
        throw error;
    }
}

export async function updateColor(input: colorsFormType,id:number):Promise<Color> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ColorUpdateInput= {
        name,
        avgPrice,
        quantity

    }
    let color:Color;
    try {

        color = await prisma.color.update({
            data,
            where:{id:id}

        });

    return color;        

    } catch (error) {
        console.error('Error adding color:', error);
        throw error;
    }
}

export type transactionWithColor = Prisma.TransactionLogGetPayload<
    {
        include: {
            color: true,
            supplier: true,
        }
    }
>

export async function addStocksToColors(params: inwardTransactionFormType) {
    // create data model for transaction
    const data: Prisma.TransactionLogCreateInput = {
        quantity: params.quantity,
        transactionType: params.transactionType,
        entityType: params.entityType,
        billDate: params.billDate,
        invoice: params.invoice,
        totalAmount: params.totalAmount,
        receivingDate: params.receivingDate,
        transportationCost: params.transportationCost,
        units: params.totalAmount,
        color: {
            connect: {
                id: params.entityId
            },
        },
        supplier:{
            connect:{
                id:params.supplierId
            }
        }

    }
    console.log('addStocksToColorData: ', data);

    // add call for transaction
    const res: transactionWithColor = await prisma.transactionLog.create({
        data,
        include: {
            color: true,
            supplier: true,
        }
    }
    ) 
    // GET total amount and quantity according to type and id
    // const sumOfRemainingStock = await prisma.transactionLog.aggregate({
    //     _sum:{
    //         totalAmount:true,
    //         quantity:true,
    //     } ,
    //     where:{
    //         quantity:{
    //             not:0,
    //         },
    //         colorId:params.entityId,
    //         entityType:{
    //             equals:'COlOR'
    //         }
    //     }
    // })

    // if(sumOfRemainingStock._sum.totalAmount && sumOfRemainingStock._sum.quantity ){
    //     const updatedAvgPrice = await prisma.color.update({
    //         data:{
    //             avgPrice:Number((sumOfRemainingStock._sum.totalAmount/sumOfRemainingStock._sum.quantity).toFixed(2)),
    //             quantity:sumOfRemainingStock._sum.quantity
    //         },
    //         where:{
    //             id:params.entityId
    //         }
    //     })
    //     console.log('updatedAvgPrice: ',updatedAvgPrice);
        

    // }

    const currentColorObj = await prisma.color.findUnique({
        where:{
            id:params.entityId
        }
    })

    console.log('currentColorObj : ',currentColorObj);

    

    if(currentColorObj ){

        const newTotalAmount = currentColorObj.totalAmount + (data.totalAmount?data.totalAmount:0);
        const newTotalQty = currentColorObj.quantity + (data.quantity?data.quantity:0);
        const newAvg = newTotalAmount/newTotalQty ;

        const updatedAvgPrice = await prisma.color.update({
            data:{
                avgPrice:Number((newAvg).toFixed(2)),
                quantity:Number(newTotalQty.toFixed()),
                totalAmount:Number(newTotalAmount.toFixed())
            },
            where:{
                id:params.entityId
            }
        })
        console.log('updatedAvgPrice: ',updatedAvgPrice);
    }

    console.log('addStocksToColorResponse: ', res);

    return res;
}