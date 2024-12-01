import { z } from 'zod';
import { colorSchema } from '../../colors/add/colorSchema';
import { materialSchema } from '../../material/add/materialSchema';
import { chemicalSchema } from '../../chemicals/add/chemicalSchema';
import { shadeSchema } from '../../shades/add/shadeSchema';
export const supplierSchema = z.object({
  name: z.string().min(1,{message:'Name is required'}),
  contactInfo: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  gstNumber: z.string().nullable().optional(),
});

export type supplierFormType = z.infer<typeof supplierSchema  >

// Schema for ProductionMaterial
export const productionMaterialSchema = z.object({
  id: z.number().optional(),
  productionLogId: z.number().optional(),
  materialId: z.number().nullable().optional(),
  colorId: z.number().nullable().optional(),
  chemicalId: z.number().nullable().optional(),
  entityType: z.enum(['MATERIAL', 'COLOR', 'CHEMICAL']),
  quantity: z.number().min(0, { message: 'Quantity must be non-negative' }),
  costing: z.number().min(0, { message: 'Costing must be non-negative' }),
  color:colorSchema.optional(),
  material:materialSchema.optional(),
  chemical:chemicalSchema.optional(),

});

// Schema for ProductionLog
export const productionLogSchema = z.object({
  id: z.number().optional(),
  productionDate:z.date({message:'Date is required'}),
  batchNumber: z.string().min(1, { message: 'Batch number is required' }),
  shadeId: z.number(),
  materialsUsed: z.array(productionMaterialSchema),
  quantityProduced: z.number({required_error:'Quantity is required'}).min(0, { message: 'Quantity produced must be non-negative' }),
  totalCosting: z.number().min(0, { message: 'Total costing must be non-negative' }),
  shade:shadeSchema.optional()
});

// Exporting types
export type ProductionMaterialType = z.infer<typeof productionMaterialSchema>;
export type ProductionLogType = z.infer<typeof productionLogSchema>;

