'use client';
import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Prisma } from '@prisma/client';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import SearchAbleSelect from '../../components/SearchAbleSelect/SearchAbleSelect';
import { addProduction } from '../actions';
import { productionLogSchema, ProductionLogType } from './productionSchema';

interface ProductionProps {
  isEdit: boolean;
  productionId?: number;
  productionData?: ProductionLogType;
  shades: Prisma.ShadeGetPayload<{
    include: {
      colorComposition: {
        include: {
          color: true
        }
      },
      chemicalComposition: {
        include: {
          chemical: true
        }
      }
    }
  }>[]
}

type shadeWithColorAndChemicalCompostion = Prisma.ShadeGetPayload<{
  include: {
    colorComposition: {
      include: {
        color: true
      }
    },
    chemicalComposition: {
      include: {
        chemical: true
      }
    }
  }
}>

export default function ProductionAddForm({ shades, isEdit, productionId, productionData }: ProductionProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductionLogType>({
    defaultValues: isEdit ? productionData : {
      totalCosting:0
    },
    resolver: zodResolver(productionLogSchema),

  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materialsUsed'
  })


  const router = useRouter();

  async function onSubmit(data: ProductionLogType) {
    try {
      if (isEdit && productionId) {
        // const res = await updateProduction(data, productionData);
        // if (res) {
        //   succesToastMessage({ message: 'Pr updated successfully' });
        //   router.push('/admin/suppliers/list');
        // }
      } else {
        const res = await addProduction(data);
        if (res) {
          succesToastMessage({ message: 'Production log added successfully' });
          router.push('/admin/production/list');
        }
      }
    } catch (error) {
      failToastMessage({ message: 'Failed to add production log' });
    }
  }

  function getMaterialName(index: number): string {
    const formData = getValues()
    const materialsUsed = formData.materialsUsed;
    console.log('material used : ', materialsUsed);

    const currentMaterial = materialsUsed[index]
    switch (currentMaterial.entityType) {
      case 'MATERIAL':
        return currentMaterial.material?.name ? currentMaterial.material?.name : '';
      case 'COLOR':
        return currentMaterial.color?.name ? currentMaterial.color?.name : '';
      case 'CHEMICAL':
        return currentMaterial.chemical?.name ? currentMaterial.chemical?.name : '';

      default:
        return '';
    }
  }


  function onShadeChange(shade: shadeWithColorAndChemicalCompostion) {
    console.log('selected shade : ', shade);

    shade.colorComposition.forEach((colorComp) => {
      append({
        entityType: 'COLOR',
        quantity: colorComp.quantity,
        colorId: colorComp.colorId,
        color: colorComp.color,
        costing: 0,
      }
      )
    })

    shade.chemicalComposition.forEach((chemicalComp) => {
      append({
        entityType: 'CHEMICAL',
        quantity: chemicalComp.quantity,
        chemicalId: chemicalComp.chemicalId,
        chemical: chemicalComp.chemical,
        costing: 0,
      }
      )
    })

  }

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Production date <span className="text-red-500">*</span>
        </label>
        <input
          {...register('productionDate', { setValueAs: (v) => v === "" ? undefined : new Date(v) })}
          type="date"
          id="name"
          className={`bg-gray-50 border ${errors.productionDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Supplier Name"
        />
        {errors.productionDate && <p className="mt-2 text-sm text-red-600">{errors.productionDate.message}</p>}

      </div>

      {/* Contact Info Field */}
      <div>
        <label htmlFor="batchNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Batch Number <span className="text-red-500">*</span>
        </label>
        <input
          {...register('batchNumber')}
          type="text"
          id="batchNumber"
          className={`bg-gray-50 border ${errors.batchNumber ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Batch Number"
        />
        {errors.batchNumber && <p className="mt-2 text-sm text-red-600">{errors.batchNumber.message}</p>}
      </div>

            {/* Total quantity Field */}
            <div>
        <label htmlFor="quantityProduced" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Quantity produced <span className="text-red-500">*</span>
        </label>
        <input
          {...register('quantityProduced',{ setValueAs: (v) => v === "" ? undefined : Number(v),})}
          type="number"
          step="0.01"
          id="quantityProduced"
          className={`bg-gray-50 border ${errors.quantityProduced ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Quantity produced"
        />
        {errors.quantityProduced && <p className="mt-2 text-sm text-red-600">{errors.quantityProduced.message}</p>}
      </div>

      {/* Shade ID Field */}
      <div className="max-w-lg">
        <label htmlFor="supplierId">Select Shade <span className="text-red-500"> *</span></label>
        <SearchAbleSelect
          id={1}
          name='shadeId'
          options={shades ? shades : []}
          getLabel={(option: any) => `${option.name}`}
          getValue={(option: any) => `${option.id}`}
          onChange={(selectedOption: shadeWithColorAndChemicalCompostion) => {
            if (selectedOption) {
              console.log('selected shade: ',selectedOption);
              
              setValue('shadeId', selectedOption.id, { shouldValidate: true })
              setValue('shade', selectedOption,)
              onShadeChange(selectedOption)
            }
            else {
              setValue('shadeId', -1, { shouldValidate: true })
              setValue('shade', undefined)

              remove()
            }
          }}
        >
        </SearchAbleSelect>
        {errors.shadeId && <span className="text-red-500">{errors.shadeId.message}</span>}
      </div>

      {
        fields.map((field, index) => {
          return (
            <div key={field.id} className="border-2 border-gray-300 p-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-2 max-w-xl items-end">
              <div className='max-w-md' >
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {getValues().materialsUsed[index].entityType == 'COLOR' ? 'Color' : 'Chemical'}<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  readOnly={true}
                  value={getMaterialName(index)}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
              </div>

              <div className='max-w-md' >
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Quantity<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  defaultValue={getValues().materialsUsed[index].quantity}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
              </div>

            </div>
          )
        }
        )
      }



      {/* Submit Button */}
      <Button size="xs" type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
        <p className="text-white font-medium text-sm">{isEdit ? 'Update Supplier' : 'Add Production'}</p>
      </Button>
    </form>
  );
}
