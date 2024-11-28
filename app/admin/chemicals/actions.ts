'use server'
import { Chemical, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { chemicalFormType } from './add/chemicalSchema';






export async function addChemical(input: chemicalFormType):Promise<Chemical> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ChemicalCreateInput = {
        name: name,
        avgPrice,
        quantity,

    }
    let chemical:Chemical;
    try {

        chemical = await prisma.chemical.create({
            data

        });

    return chemical;        

    } catch (error) {
        console.error('Error adding chemical:', error);
        throw error;
    }
}

export async function updateChemical(input: chemicalFormType,id:number):Promise<Chemical> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ChemicalUpdateInput= {
        name,
        avgPrice,
        quantity

    }
    let chemical:Chemical;
    try {

        chemical = await prisma.chemical.update({
            data,
            where:{id:id}

        });

    return chemical;        

    } catch (error) {
        console.error('Error adding chemical:', error);
        throw error;
    }
}