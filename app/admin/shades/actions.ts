'use server'

import { Prisma, Shade } from "@prisma/client";
import { shadeFormType } from "./add/shadeSchema";

export async function addShade(input: shadeFormType):Promise<Shade>{

    const { name, colorComposition, chemicalComposition } = input

    const colorCompositions: Prisma.ColorCompositionCreateManyShadeInput[] = colorComposition.map(
        (color) => ({
            colorId: color.colorId,
            quantity: color.quantity
        })
    );

    const chemicalCompositions: Prisma.ChemicalCompositionCreateManyShadeInput[] | undefined = chemicalComposition?.map(
        (chemical) => ({
            chemicalId: chemical.chemicalId,
            quantity: chemical.quantity
        })
    );

    console.log('color compisitions : ',colorCompositions);
    console.log('chemical compisitions : ',chemicalCompositions);
    

    const data: Prisma.ShadeCreateInput = {
        name: name,
        colorComposition: {
            createMany: {
                data: colorCompositions
            }
        },
        chemicalComposition:{
            createMany: {
                data: chemicalCompositions?chemicalCompositions:[]
            }
        },
    }

    console.log('shade create input data : ',data);

    let shade: Shade;
    try {

        shade = await prisma.shade.create({
            data
        });

        console.log('shade response : ',shade);

        return shade;

    } catch (error) {
        console.error('Error adding shade:', error);
        throw error;
    }
}






