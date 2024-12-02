import {z} from 'zod'


export const colorSchema = z.object({

    name:z.string().min(1,{message:'Name is required'}),
    avgPrice:z.number({required_error:'Price is required',invalid_type_error:'Price is required'}),
    quantity:z.number({required_error:'Quantity is required',invalid_type_error:'Quantity is required'}),
    totalQuantity:z.number().optional(),
    totalAmount:z.number().optional(),

})

export type colorsFormType = z.infer<typeof colorSchema  >
