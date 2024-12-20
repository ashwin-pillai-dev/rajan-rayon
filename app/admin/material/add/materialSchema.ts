import {z} from 'zod'


export const materialSchema = z.object({

    name:z.string().min(1,{message:'Name is required'}),
    avgPrice:z.number({required_error:'Price is required',invalid_type_error:'Price is required'}),
    quantity:z.number({required_error:'Quantity is required',invalid_type_error:'Quantity is required'}),
    totalAmount:z.number().optional(),


})

export type materialFormType = z.infer<typeof materialSchema  >
