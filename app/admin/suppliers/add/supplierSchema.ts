import { z } from 'zod';
export const supplierSchema = z.object({
  name: z.string().min(1,{message:'Name is required'}),
  contactInfo: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  gstNumber: z.string().nullable().optional(),
});

export type supplierFormType = z.infer<typeof supplierSchema  >

