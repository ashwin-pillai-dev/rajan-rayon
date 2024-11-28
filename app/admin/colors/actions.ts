'use server'
import { Color, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { colorsFormType } from './add/colorSchema';






export async function addColor(input: colorsFormType):Promise<Color> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ColorCreateInput = {
        name: name,
        avgPrice,
        quantity,

    }
    let color:Color;
    try {

        color = await prisma.color.create({
            data

        });

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