'use client';
import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addChemical, updateChemical } from '../actions';
import { chemicalSchema, chemicalFormType } from './chemicalSchema';

interface chemicalProps {
  isEdit: boolean;
  chemicalId?: number;
  chemicalData?: chemicalFormType;
}

export default function ChemicalAddForm({ isEdit, chemicalId, chemicalData }: chemicalProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<chemicalFormType>({
    defaultValues: isEdit ? chemicalData : {},
    resolver: zodResolver(chemicalSchema),
  });


  const router = useRouter();

  async function onsubmit(data: chemicalFormType) {
    try {
      console.log('chemical data: ', data);

      if (isEdit) {
        if (chemicalId) {
          const res = await updateChemical(data, chemicalId);
          if (res) {
            succesToastMessage({ message: 'chemical updated successfully' });
            router.push('/admin/chemicals/list');
          }
        }

      } else {
        const res = await addChemical(data);
        if (res) {
          succesToastMessage({ message: 'chemical added successfully' });
          router.push('/admin/chemicals/list');
        }
      }
    } catch (error) {
      failToastMessage({ message: 'Failed adding chemical' });
    }
  }


  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onsubmit)}>
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
          placeholder="Name"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Unit Price Field */}
      <div>
        <label htmlFor="avgPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          {...register('avgPrice', { valueAsNumber: true })}
          type="number"
          id="avgPrice"
          className={`bg-gray-50 border ${errors.avgPrice ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Price"
        />
        {errors.avgPrice && <p className="mt-2 text-sm text-red-600">{errors.avgPrice.message}</p>}
      </div>

      <div>
        <label htmlFor="unitSize" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Quantity<span className="text-red-500">*</span>
        </label>
        <input
          {...register('quantity', { valueAsNumber: true })}
          type="number"
          id="quantity"
          className={`bg-gray-50 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Quantity"
        />
        {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>



      {/* Submit Button */}
      <Button size="xs" type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
        <p className="text-white font-medium text-sm">{isEdit ? 'Edit Chemical' : 'Add Chemical'}</p>
      </Button>
    </form>
  );
}
