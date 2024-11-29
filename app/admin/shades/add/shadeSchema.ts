import {z} from 'zod'
import { chemicalSchema } from '../../chemicals/add/chemicalSchema';
import { colorSchema } from '../../colors/add/colorSchema';





// Zod schema for ColorComposition
const ColorCompositionSchema = z.object({
  id: z.number().int().positive().optional(),
  shadeId: z.number().int().positive().optional(),
  colorId: z.number().min(1, 'Color is required'),
  color:colorSchema.optional(),
  quantity: z.number({invalid_type_error:'Invalid Quantity type',required_error:'Quantity is required'}).positive({message:'Quantity should be atleast 1'}), // Quantity must be positive
});

// Zod schema for ChemicalComposition
const ChemicalCompositionSchema = z.object({
  id: z.number().int().positive().optional(),
  shadeId: z.number().int().positive().optional(),
  chemicalId:  z.number().min(1,'Chemical is required'),
  chemical:chemicalSchema.optional(),
  quantity: z.number({invalid_type_error:'Invalid Quantity type',required_error:'Quantity is required'}).positive({message:'Quantity should be atleast 1'}), // Quantity must be positive
});

// Zod schema for Shade
const shadeSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1,'Name is required'),
  description: z.string().optional().nullable(),
  colorComposition: z.array(ColorCompositionSchema).min(1,{message:'Minimum one color required to add a shade'}),
  chemicalComposition: z.array(ChemicalCompositionSchema).optional(),
});

export type shadeFormType = z.infer<typeof shadeSchema >
// Export schemas for further usage
export {
  ColorCompositionSchema,
  ChemicalCompositionSchema,
  shadeSchema,
};


