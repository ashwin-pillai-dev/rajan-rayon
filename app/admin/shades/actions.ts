'use server'

import { Prisma, Shade } from "@prisma/client";
import { ColorCompositionSchema, shadeFormType, ChemicalCompositionSchema } from "./add/shadeSchema";
import { date, z } from "zod";

export async function addShade(input: shadeFormType): Promise<Shade> {

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

    console.log('color compisitions : ', colorCompositions);
    console.log('chemical compisitions : ', chemicalCompositions);


    const data: Prisma.ShadeCreateInput = {
        name: name,
        colorComposition: {
            createMany: {
                data: colorCompositions
            }
        },
        chemicalComposition: {
            createMany: {
                data: chemicalCompositions ? chemicalCompositions : []
            }
        },
    }

    console.log('shade create input data : ', data);

    let shade: Shade;
    try {

        shade = await prisma.shade.create({
            data
        });

        console.log('shade response : ', shade);

        return shade;

    } catch (error) {
        console.error('Error adding shade:', error);
        throw error;
    }
}


export async function editShade(input: shadeFormType, toBeDeleted: { colorsToDelete: z.infer<typeof ColorCompositionSchema>[], chemicalsToDelete: z.infer<typeof ChemicalCompositionSchema>[] }) {

    const { id, name, colorComposition, chemicalComposition } = input;
    const { colorsToDelete, chemicalsToDelete } = toBeDeleted;
    const colorsToDeleteIds = colorsToDelete.map((colorComp) => {
        return { id: colorComp.id }
    })

    console.log('colorComposition', colorComposition);
    console.log('chemicalComposition', chemicalComposition);


    console.log('colorsToDeleteIds: ', colorsToDeleteIds);
    console.log('colorsToDelete: ', colorsToDelete);


    console.log('chemicalsToDelete: ', chemicalsToDelete);
    const chemicalsToDeleteIds = chemicalsToDelete.map((chemicalComp) => {
        return { id: chemicalComp.id }
    })
    console.log('chemicalsToDeleteIds: ', chemicalsToDeleteIds);


    const colorCreateInput = colorComposition
        .filter((colorComp) => !colorComp?.id) // Keep only items without `id`
        .map((colorComp) => ({
            quantity: colorComp.quantity,
            colorId: colorComp.colorId
        }) as Prisma.ColorCompositionCreateManyShadeInput);
    console.log('colorCreateInput: ', colorCreateInput);

    let chemicalCreateInput: Prisma.ChemicalCompositionCreateManyShadeInput[] = []

    if (chemicalComposition) {
        const temp = chemicalComposition
            .filter(chemicalComp => !chemicalComp?.id)
            .map(chemicalComp => {
                if (!chemicalComp?.id) {
                    const newChemicalComp: Prisma.ChemicalCompositionCreateManyShadeInput = {
                        quantity: chemicalComp.quantity,
                        chemicalId: chemicalComp.chemicalId,
                    };
                    return newChemicalComp;
                }
                return undefined; // Ensure the return is explicit
            })
            .filter(Boolean) as Prisma.ChemicalCompositionCreateManyShadeInput[]; // Filter out undefined

        if (temp.length > 0) {
            chemicalCreateInput = temp;
        }
    }



    console.log('chemicalCreateInput: ', chemicalCreateInput);


    const updateArgs:Prisma.ShadeUpdateArgs = {

        data:{
            name:name,
            colorComposition:{
                createMany:{data:colorCreateInput},
                deleteMany:colorsToDeleteIds,
            },
            chemicalComposition:{
                createMany:{data:chemicalCreateInput},
                deleteMany:chemicalsToDeleteIds
            },
        },
        where:{
            id:id
        },
        include:{
            colorComposition:{
                include:{
                    color:true
                }
            },
            chemicalComposition:{
                include:{
                    chemical:true
                }
            }
        }

    }

    console.log('update args: ',updateArgs);
    
    try {

        const res = await prisma.shade.update(updateArgs)

        console.log('Updated shade : ',res);
        

        return res;
    } catch (error) {
        console.error('Error adding shade:', error);
        throw error;
    }
}






