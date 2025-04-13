'use client';
import { Modal } from '@/components/ui/modal';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IEmployeeProps } from '@/services/types/common-types';
import { fetchBedById } from '@/services/utils/api/bed-api';
import { fetchEmployeeById } from '@/services/utils/api/employee-api';
import axiosService from '@/services/utils/axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EmployeePassword from '../employee-form/password-form/EmployeePassword';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOff } from 'lucide-react';
const EmployeeDetails = ({ id }: { id: string }) => {
  const [employeeDetails, setEmployeeDetails] = useState<IEmployeeProps>();
  const [openEmployeePasswordModal, setOpenEmployeePasswordModal] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await fetchEmployeeById(String(id));
        if (res.data) {
          setEmployeeDetails(res.data);
        }
      } catch (error) {
        toast.error('Error fetching Employee data');
      }
    };
    if (id) {
      getEmployee();
    }
  }, [id]);
  return (
    <div className='grid grid-cols-12 gap-x-8 rounded-xl border p-5'>
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Employee Details</h1>
        <p className='mb-5 mt-2'>
          Explore the complete details of this Employee, including its
          availability.{' '}
        </p>
        <Separator className='mb-6' />
      </div>

      <div className='col-span-5 rounded-xl border p-3'>
        <h1 className='text-[20px] font-bold'>Profile Details</h1>
        <Separator className='my-3' />

        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Name</p>
          <p className=''>{employeeDetails?.name}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Email</p>
          <p className=''>{employeeDetails?.email}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Phone</p>
          <p className=''>{employeeDetails?.phone}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Password</p>
          <div className='flex justify-between'>
            <p className=''>
              {employeeDetails?.password && showPassword
                ? employeeDetails?.password
                : '**********'}
            </p>
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='ml-3'
            >
              {showPassword ? (
                <EyeOff className='w-4' />
              ) : (
                <EyeIcon className='w-4' />
              )}
            </button>
          </div>
        </div>
        <div className='flex justify-between'>
          <p className={`w-[100px] font-semibold`}>Status</p>
          <p
            className={`${employeeDetails?.status === 'ACTIVE' ? 'activeBadge' : 'inactiveBadge'}`}
          >
            {employeeDetails?.status}
          </p>
        </div>
        <div className='mt-4 text-right'>
          <Button
            onClick={() => setOpenEmployeePasswordModal(true)}
            className=''
          >
            Change Password
          </Button>
        </div>
        {/* Created At */}
      </div>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openEmployeePasswordModal}
        title='Change Employee Password'
        onClose={() => setOpenEmployeePasswordModal(false)}
        description='Are you sure you want to Change Password?'
      >
        <EmployeePassword employeeId={employeeDetails?.id.toString()} />
      </Modal>
    </div>
  );
};

export default EmployeeDetails;
