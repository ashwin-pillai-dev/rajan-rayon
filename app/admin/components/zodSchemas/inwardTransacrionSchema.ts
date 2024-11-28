import { z } from 'zod';

export const inwardTransactionSchema = z.object({
  receivingDate: z.date({invalid_type_error:'Date is required',required_error:'Date is required'}),
  billDate: z.date({invalid_type_error:'Date is required',required_error:'Date is required'}),
  transactionType:z.string().min(1),
  supplierId: z.number({invalid_type_error:'Supplier is required',required_error:'Supplier is required'}).min(1, 'Supplier is required'),
  entityId: z.number().min(1, 'Enitiy is required'),
  invoice: z.string({invalid_type_error:'Invoice is required',required_error:'Invoice is required'}).min(1, 'Invoice is required'),
  entityType: z.string(),
  quantity: z.number({invalid_type_error:'Quantity is required',required_error:'Quantity is required'}).min(1, 'Quantity must be greater than zero'),
  totalAmount: z.number({invalid_type_error:'Total amount is required',required_error:'Total amount is required'}).min(1, 'Total Amount must be greater than zero'),
  transportationCost: z.number().optional(),
});

export type inwardTransactionFormType = z.infer<typeof inwardTransactionSchema>;
