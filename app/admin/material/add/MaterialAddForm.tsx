'use client';
import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addMaterial, updateMaterial } from '../actions';
import { materialFormType, materialSchema } from './materialSchema';

interface materialProps {
  isEdit: boolean;
  materialId?: number;
  materialData?: materialFormType;
}

export default function MaterialAddForm({ isEdit, materialId, materialData }: materialProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<materialFormType>({
    defaultValues: isEdit ? materialData : {},
    resolver: zodResolver(materialSchema),
  });


  const router = useRouter();

  async function onsubmit(data: materialFormType) {
    try {
      console.log('Material data: ', data);

      if (isEdit) {
        if (materialId) {
          const res = await updateMaterial(data, materialId);
          if (res) {
            succesToastMessage({ message: 'Material updated successfully' });
            router.push('/admin/material/list');
          }
        }

      } else {
        const res = await addMaterial(data);
        if (res) {
          succesToastMessage({ message: 'Material added successfully' });
          router.push('/admin/material/list');
        }
      }
    } catch (error) {
      failToastMessage({ message: 'Failed adding Material' });
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
          placeholder="Material Name"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="unitSize" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Total Quantity<span className="text-red-500">*</span>
        </label>
        <input
          {...register('quantity', { valueAsNumber: true })}
          type="number"
          id="quantity"
          className={`bg-gray-50 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Total Quantity"
        />
        {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      {/* Unit Price Field */}
      <div>
        <label htmlFor="avgPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Total Amount <span className="text-red-500">*</span>
        </label>
        <input
          {...register('avgPrice', { valueAsNumber: true })}
          type="number"
          id="avgPrice"
          className={`bg-gray-50 border ${errors.avgPrice ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Total Amount"
        />
        {errors.avgPrice && <p className="mt-2 text-sm text-red-600">{errors.avgPrice.message}</p>}
      </div>

      {/* Submit Button */}
      <Button size="xs" type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
        <p className="text-white font-medium text-sm">{isEdit ? 'Edit Material' : 'Add Material'}</p>
      </Button>
    </form>
  );
}
