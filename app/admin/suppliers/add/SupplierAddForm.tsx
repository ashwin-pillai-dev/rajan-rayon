'use client';
import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { addSupplier, updateSupplier } from '../actions';
import { supplierFormType, supplierSchema } from './supplierSchema';

interface SupplierProps {
  isEdit: boolean;
  supplierId?: number;
  supplierData?: supplierFormType;
}

export default function SupplierForm({ isEdit, supplierId, supplierData }: SupplierProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<supplierFormType>({
    defaultValues: isEdit ? supplierData : {},
    resolver: zodResolver(supplierSchema),
  });

  const router = useRouter();

  async function onSubmit(data: supplierFormType) {
    try {
      if (isEdit && supplierId) {
        const res = await updateSupplier(data, supplierId);
        if (res) {
          succesToastMessage({ message: 'Supplier updated successfully' });
          router.push('/admin/suppliers/list');
        }
      } else {
        const res = await addSupplier(data);
        if (res) {
          succesToastMessage({ message: 'Supplier added successfully' });
          router.push('/admin/suppliers/list');
        }
      }
    } catch (error) {
      failToastMessage({ message: 'Failed to add/update Supplier' });
    }
  }

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          placeholder="Supplier Name"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Contact Info Field */}
      <div>
        <label htmlFor="contactInfo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Contact Info
        </label>
        <input
          {...register('contactInfo')}
          type="text"
          id="contactInfo"
          className={`bg-gray-50 border ${errors.contactInfo ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Contact Info"
        />
        {errors.contactInfo && <p className="mt-2 text-sm text-red-600">{errors.contactInfo.message}</p>}
      </div>

      {/* Address Field */}
      <div>
        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Address
        </label>
        <input
          {...register('address')}
          type="text"
          id="address"
          className={`bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="Supplier Address"
        />
        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
      </div>

      {/* GST Number Field */}
      <div>
        <label htmlFor="gstNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          GST Number
        </label>
        <input
          {...register('gstNumber')}
          type="text"
          id="gstNumber"
          className={`bg-gray-50 border ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
          placeholder="GST Number"
        />
        {errors.gstNumber && <p className="mt-2 text-sm text-red-600">{errors.gstNumber.message}</p>}
      </div>

      {/* Submit Button */}
      <Button size="xs" type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
        <p className="text-white font-medium text-sm">{isEdit ? 'Update Supplier' : 'Add Supplier'}</p>
      </Button>
    </form>
  );
}
