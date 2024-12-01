'use client';
import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chemical, ChemicalComposition, Color, ColorComposition, Prisma } from '@prisma/client';
import { Button, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import { chemicalFormType } from '../../chemicals/add/chemicalSchema';
import SearchAbleSelect from '../../components/SearchAbleSelect/SearchAbleSelect';
import { addShade, editShade } from '../actions';
import { ChemicalCompositionSchema, ColorCompositionSchema, shadeFormType, shadeSchema } from './shadeSchema';
import { z } from 'zod';
import React from 'react';

interface shadeProps {
  isEdit: boolean;
  shadeId?: number;
  shadeData?: shadeFormType;
  colors: Color[]
  chemicals: Color[]
}

export default function ShadeAddForm({ isEdit, shadeId, shadeData, colors, chemicals }: shadeProps) {
  console.log('edit data : ', shadeData);






  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<shadeFormType>({
    defaultValues: isEdit ? shadeData : {
      colorComposition: [
        {
          quantity: 0, colorId: undefined
        }
      ],
      chemicalComposition: [
        {
          quantity: 0, chemicalId: undefined
        }

      ]
    },
    resolver: zodResolver(shadeSchema),
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colorComposition'
  })

  // Manage Chemical Composition
  const {
    fields: chemicalFields,
    append: appendChemical,
    remove: removeChemical,
  } = useFieldArray({
    control,
    name: 'chemicalComposition',
  });


  const router = useRouter();

async function onsubmit(data: shadeFormType) {
    try {

      if (isEdit) {
        if (shadeData) {
          console.log('shadeEditData : ', shadeData);
          console.log('shadeFormData : ', data);
          const colorsToDelete = findDeletedColors(shadeData.colorComposition, data.colorComposition)
          console.log('colors to delete : ', colorsToDelete);

          const chemicalsToDelete = findDeletedChemicals(shadeData.chemicalComposition?shadeData.chemicalComposition:[], data.chemicalComposition?data.chemicalComposition:[])
          console.log('chemicals to delete : ', chemicalsToDelete);



          const res = await editShade(data, { colorsToDelete: colorsToDelete, chemicalsToDelete: chemicalsToDelete });
          if (res) {
            succesToastMessage({ message: 'Material updated successfully' });
            router.push('/admin/shades/list');
          }
        }

      } else {
        const res = await addShade(data)
        if (res) {
          succesToastMessage({ message: 'Shade added successfully' });
          router.push('/admin/shade/list');
        }
      }
    } catch (error) {
      failToastMessage({ message: 'Failed adding Shade' });
    }
  }



  // Handle product selection and populate price and product ID
  async function handleColorChange(index: number, selectedOption: Color) {
    console.log('index', index);
    console.log('selectedOption', selectedOption);
    if (selectedOption) {
      setValue(`colorComposition.${index}.color`, selectedOption, { shouldValidate: true });
      setValue(`colorComposition.${index}.colorId`, selectedOption.id, { shouldValidate: true });
    }
    else {
      setValue(`colorComposition.${index}.color`, undefined, { shouldValidate: true });
      setValue(`colorComposition.${index}.colorId`, 0, { shouldValidate: true });
    }

  }
  // Handle product selection and populate price and product ID
  async function handleChemicalChange(index: number, selectedOption: Color) {
    console.log('index', index);
    console.log('selectedOption', selectedOption);
    if (selectedOption) {
      setValue(`chemicalComposition.${index}.chemical`, selectedOption, { shouldValidate: true });
      setValue(`chemicalComposition.${index}.chemicalId`, selectedOption.id, { shouldValidate: true });
    }
    else {
      setValue(`chemicalComposition.${index}.chemical`, undefined, { shouldValidate: true });
      setValue(`chemicalComposition.${index}.chemicalId`, 0, { shouldValidate: true });
    }

  }

  function checkChemicalIdExistence(index: number): boolean {
    const values = getValues(); // Assuming getValues is from React Hook Form
    const chemicalComposition = values?.chemicalComposition ?? []; // Fallback to empty array if undefined

    return chemicalComposition[index]?.id ? true : false;
  }


  function findDeletedColors(originalArray: z.infer<typeof ColorCompositionSchema>[], compareArray: z.infer<typeof ColorCompositionSchema>[]): z.infer<typeof ColorCompositionSchema>[] {
    // Extract IDs from the compareArray for quick lookup
    const compareIds = new Set(compareArray.map(item => item.id));

    // Filter out items from originalArray that are not in compareArray
    return originalArray.filter(item => !compareIds.has(item.id));
  }

  function findDeletedChemicals(originalArray: z.infer<typeof ChemicalCompositionSchema>[], compareArray: z.infer<typeof ChemicalCompositionSchema>[]): z.infer<typeof ChemicalCompositionSchema>[] {
    // Extract IDs from the compareArray for quick lookup
    const compareIds = new Set(compareArray.map(item => item.id));

    // Filter out items from originalArray that are not in compareArray
    return originalArray.filter(item => !compareIds.has(item.id));
  }

  return (
    <form className="space-y-4 md:space-y-6"
      onSubmit={handleSubmit(onsubmit)}
    >
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Shade Name"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      {/* Colors composition array input */}
      <div>
        <button
          type="button"
          onClick={() => {
            append({ quantity: 0, colorId: 0, });
          }}
          className="w-1/2 md:w-1/4 bg-primary-600 hover:bg-primary-700 self-end focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg h-10  px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <p className='text-white font-medium  text-sm'>
            Add Colors
          </p>
        </button>
        {<span className="mt-4">      {/* Display error when no items are added */}
          {errors.colorComposition && !Array.isArray(errors.colorComposition) && (
            <span className='text-red-500'>{errors.colorComposition?.root?.message}</span> // Displays "Minimum one product required to add a sale"
          )}</span>
        }

        {
          fields.map((field, index) => {
            const currentColor = getValues(`colorComposition.${index}.color`);

            return (
              <div key={field.id} className="border-2 border-gray-300 p-2 mt-4 grid grid-cols-1 md:grid-cols-[3fr_3fr_auto] gap-y-2 md:gap-x-2 max-w-xl items-end">
                <div className='max-w-md' >
                  <label
                    htmlFor={`colorComposition.${index}.color`}
                  >Select Color <span className="text-red-500"> *</span></label>
                  <SearchAbleSelect
                    name='product'
                    id={Number(`colorComposition.${index}`)}
                    options={colors}
                    isDisabled={getValues().colorComposition[index].id ? true : false}
                    value={currentColor}
                    getLabel={(option: Color) => `${option.name}`}
                    getValue={(option: Color) => `${option}`}
                    onChange={(selectedOption: Color) => { handleColorChange(index, selectedOption) }}
                  />
                  {errors.colorComposition?.[index]?.colorId && (
                    <span className="text-red-500">{errors.colorComposition[index].colorId?.message}</span>
                  )}
                </div>


                <div className='max-w-md' >
                  <div className='pr-4'>
                    <label htmlFor="quantity">Quantity <span className="text-red-500"> *</span></label>

                    <TextInput
                      id="quantity"
                      type='number'
                      disabled={getValues().colorComposition[index].id ? true : false}
                      {...register(`colorComposition.${index}.quantity`, { valueAsNumber: true })} // Dynamically register
                      className="bg-gray-50  max-w-md border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:focus:border-blue-500"
                      placeholder="Quantity"
                    />
                    <span className="text-red-500">{errors.colorComposition?.[index]?.quantity && errors.colorComposition?.[index]?.quantity.message}</span>
                  </div>
                </div>
                <div >
                  <MdDelete size={30} className='max-w-md self-center text-red-800 cursor-pointer' onClick={() => {remove(index)}} />
                </div>

              </div>
            )
          }
          )
        }
      </div>

      {/* Chemical composition array input */}
      <div>
        <button
          type="button"
          onClick={() => {
            appendChemical({ quantity: 0, chemicalId: 0, });
          }}
          className="w-1/2 md:w-1/4 bg-primary-600 hover:bg-primary-700 self-end focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg h-10  px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <p className='text-white font-medium  text-sm'>
            Add Chemical
          </p>
        </button>

        {
          chemicalFields.map((field, index) => {
            const currentChemical = getValues(`chemicalComposition.${index}.chemical`);

            return (
              <div key={field.id} className="border-2 border-gray-300 p-2 mt-4 grid grid-cols-1 md:grid-cols-[3fr_3fr_auto] gap-y-2 md:gap-x-2 max-w-xl items-end">
                <div className="max-w-md">
                  <label htmlFor={`chemicalComposition.${index}.chemical`}>
                    Select Chemical <span className="text-red-500"> *</span>
                  </label>
                  <SearchAbleSelect
                    name="chemical"
                    id={Number(`chemicalComposition.${index}`)}
                    options={chemicals}
                    isDisabled={checkChemicalIdExistence(index)}
                    value={currentChemical}
                    getLabel={(option: Chemical) => `${option.name}`}
                    getValue={(option: Chemical) => `${option}`}
                    onChange={(selectedOption: Chemical) => {
                      handleChemicalChange(index, selectedOption);
                    }}
                  />
                  {errors.chemicalComposition?.[index]?.chemicalId && (
                    <span className="text-red-500">
                      {errors.chemicalComposition[index].chemicalId?.message}
                    </span>
                  )}
                </div>

                <div className="max-w-md">
                  <label htmlFor="quantity">
                    Quantity <span className="text-red-500"> *</span>
                  </label>
                  <TextInput
                    id="quantity"
                    type="number"
                    disabled={checkChemicalIdExistence(index)}
                    {...register(`chemicalComposition.${index}.quantity`, { valueAsNumber: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none"
                    placeholder="Quantity"
                  />

                  <span className="text-red-500">
                    {errors.chemicalComposition?.[index]?.quantity && errors.chemicalComposition[index]?.quantity.message}
                  </span>
                </div>

                <div >
                  <MdDelete
                    size={30}
                    className="text-red-800 cursor-pointer"
                    onClick={() => { removeChemical(index) }}
                  />
                </div>
              </div>
            )
          }
          )
        }

      </div>
      {/* Submit Button */}
      <Button size="xs"
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
        <p className="text-white font-medium text-sm">{isEdit ? 'Edit Material' : 'Add Material'}</p>
      </Button>
    </form>
  );
}
