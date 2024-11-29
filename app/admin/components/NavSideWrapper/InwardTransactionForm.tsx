'use client';

import { failToastMessage, succesToastMessage } from '@/app/utils/toastMeassages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { inwardTransactionSchema, inwardTransactionFormType } from '../zodSchemas/inwardTransacrionSchema'; // Replace with your actual schema import
import { Supplier } from '@prisma/client';
import SearchAbleSelect from '../SearchAbleSelect/SearchAbleSelect';

interface InwardTransactionFormProps {
    entityType: 'MATERIAL' | 'COLOR' | 'CHEMICAL';
    entityId: number;
    suppliers?: Supplier[];
    addInwardTransaction: (data: inwardTransactionFormType) => Promise<any>; // Entity type should be passed as a prop
}

export default function InwardTransactionForm({ entityType, entityId, suppliers, addInwardTransaction }: InwardTransactionFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<inwardTransactionFormType>({
        defaultValues: { entityType, entityId, transactionType: 'INWARD' }, // Sets entityType as a default value
        resolver: zodResolver(inwardTransactionSchema), // Validates the form using Zod schema
    });

    const router = useRouter();

    async function onSubmit(data: inwardTransactionFormType) {
        try {
            // const res = {} // Replace with your actual action function for adding inward transaction
            console.log('inward transaction data: ', data);

            const res = await addInwardTransaction(data); // Replace with your actual action function for adding inward transaction
            if (res) {
                succesToastMessage({ message: 'Inward Transaction added successfully' });
                if (entityType == 'MATERIAL') {
                    router.push(`/admin/material/stock-updates/${entityId}`)
                }
                if (entityType == 'COLOR') {
                    router.push(`/admin/colors/stock-updates/${entityId}`)
                }
                if (entityType == 'CHEMICAL') {
                    router.push(`/admin/chemicals/stock-updates/${entityId}`)
                }
            }
        } catch (error) {
            failToastMessage({ message: 'Failed to add Inward Transaction' });
        }
    }

    return (
        <form className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Receiving Date Field */}
            <div>
                <label htmlFor="receivingDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Receiving Date <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('receivingDate', { setValueAs: (v) => v === "" ? undefined : new Date(v), })}
                    type="date"
                    id="receivingDate"
                    className={`bg-gray-50 border ${errors.receivingDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
                {errors.receivingDate && <p className="mt-2 text-sm text-red-600">{errors.receivingDate.message}</p>}
            </div>

            {/* Bill Date Field */}
            <div>
                <label htmlFor="billDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Bill Date <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('billDate', { setValueAs: (v) => v === "" ? undefined : new Date(v), })}
                    type="date"
                    id="billDate"
                    className={`bg-gray-50 border ${errors.billDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
                {errors.billDate && <p className="mt-2 text-sm text-red-600">{errors.billDate.message}</p>}
            </div>

            {/* Supplier ID Field */}
            <div className="max-w-lg">
                <label htmlFor="supplierId">Select Supplier <span className="text-red-500"> *</span></label>
                <SearchAbleSelect
                    id='supplierId'
                    name='supplierId'
                    options={suppliers ? suppliers : []}
                    getLabel={(option: any) => `${option.name}`}
                    getValue={(option: any) => `${option.id}`}
                    onChange={(selectedOption: any) => {
                        setValue('supplierId', selectedOption.id, { shouldValidate: true })
                    }}
                >
                </SearchAbleSelect>
                {errors.supplierId && <span className="text-red-500">{errors.supplierId.message}</span>}
            </div>

            {/* Invoice Field */}
            <div>
                <label htmlFor="invoice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Invoice <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('invoice')}
                    type="text"
                    id="invoice"
                    className={`bg-gray-50 border ${errors.invoice ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    placeholder="Invoice Number"
                />
                {errors.invoice && <p className="mt-2 text-sm text-red-600">{errors.invoice.message}</p>}
            </div>

            {/* Quantity Field */}
            <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Quantity <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('quantity', { setValueAs: (v) => v === "" ? undefined : Number(v), })}
                    type="number"
                    id="quantity"
                    className={`bg-gray-50 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    placeholder="Quantity"
                />
                {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>

            {/* Total Amount Field */}
            <div>
                <label htmlFor="totalAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Total Amount <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('totalAmount', { setValueAs: (v) => v === "" ? undefined : Number(v), })}
                    type="number"
                    id="totalAmount"
                    className={`bg-gray-50 border ${errors.totalAmount ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    placeholder="Total Amount"
                />
                {errors.totalAmount && <p className="mt-2 text-sm text-red-600">{errors.totalAmount.message}</p>}
            </div>

            {/* Transportation Cost Field */}
            <div>
                <label htmlFor="transportationCost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Transportation Cost
                </label>
                <input
                    {...register('transportationCost', { setValueAs: (v) => v === "" ? undefined : Number(v), })}
                    type="number"
                    id="transportationCost"
                    className={`bg-gray-50 border ${errors.transportationCost ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                    placeholder="Transportation Cost"
                />
                {errors.transportationCost && <p className="mt-2 text-sm text-red-600">{errors.transportationCost.message}</p>}
            </div>

            {/* Submit Button */}
            <Button size="xs"
                // onClick={onSubmit}
                type="submit"
                disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5">
                <p className="text-white font-medium text-sm">Add Inward Transaction</p>
            </Button>
        </form>
    );
}
