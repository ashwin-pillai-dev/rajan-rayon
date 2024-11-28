'use server';
import { Supplier, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { supplierFormType } from './add/supplierSchema';

export async function addSupplier(input: supplierFormType): Promise<Supplier> {
  const data: Prisma.SupplierCreateInput = input;
  let supplier: Supplier;
  try {
    supplier = await prisma.supplier.create({
      data,
    });
    return supplier;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
}

export async function updateSupplier(input: supplierFormType, id: number): Promise<Supplier> {
  const { name, contactInfo, address, gstNumber } = input;

  const data: Prisma.SupplierUpdateInput = {
    name,
    contactInfo,
    address,
    gstNumber,
  };

  let supplier: Supplier;
  try {
    supplier = await prisma.supplier.update({
      data,
      where: { id: id },
    });
    return supplier;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}
