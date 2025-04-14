'use client';
import { Modal } from '@/components/ui/modal';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  ICityDataProps,
  IEmployeeProps,
  IRoleProps,
  IStateDataProps
} from '@/services/types/common-types';
import { fetchEmployeeById } from '@/services/utils/api/employee-api';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EmployeePassword from '../employee-form/password-form/EmployeePassword';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOff } from 'lucide-react';

interface EmployeeDetailsProps extends IEmployeeProps {
  roles: IRoleProps;
  state: IStateDataProps;
  city: ICityDataProps;
}

const EmployeeDetails = ({ id }: { id: string }) => {
  const [employeeDetails, setEmployeeDetails] =
    useState<EmployeeDetailsProps>();
  const [openEmployeePasswordModal, setOpenEmployeePasswordModal] =
    useState(false);
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
    if (id) getEmployee();
  }, [id]);

  return (
    <div className='grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-12 md:gap-6 md:p-6'>
      <div className='col-span-12'>
        <h1 className='text-lg font-bold md:text-xl'>Employee Details</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Explore the complete details of this Employee, including availability.
        </p>
        <Separator className='my-4' />
      </div>

      <div className='col-span-12 rounded-xl border p-3 md:col-span-3'>
        <div className='hide-scrollbar max-h-[300px] w-full overflow-y-scroll md:max-h-[500px]'>
          {(employeeDetails?.profileImages ?? []).map((img, index) => (
            <div key={index} className='mb-3'>
              <Image
                alt='Profile Image'
                src={img}
                width={1000}
                height={1000}
                className='h-[200px] w-full rounded-lg object-contain md:h-[300px]'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='col-span-12 rounded-xl border p-3 md:col-span-3'>
        <div className='hide-scrollbar max-h-[300px] w-full overflow-y-scroll md:max-h-[500px]'>
          {(employeeDetails?.proofDocuments ?? []).map((img, index) => (
            <div key={index} className='mb-3'>
              <Image
                alt='Proof Document'
                src={img}
                width={1000}
                height={1000}
                className='h-[200px] w-full rounded-lg object-contain md:h-[300px]'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='col-span-12 rounded-xl border p-4 md:col-span-6'>
        <h2 className='text-base font-semibold md:text-lg'>Profile Details</h2>
        <Separator className='my-3' />

        <div className='space-y-4 text-sm'>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>Name</p>
            <p>{employeeDetails?.name}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>Email</p>
            <p>{employeeDetails?.email}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>Phone</p>
            <p>{employeeDetails?.phone}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>Role</p>
            <p>{employeeDetails?.roles?.roleName}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>State</p>
            <p>{employeeDetails?.state?.name}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>City</p>
            <p>{employeeDetails?.city?.name}</p>
          </div>
          <div className='flex justify-between'>
            <p className='w-[100px] font-semibold'>Password</p>
            <div className='flex items-center'>
              <p>
                {employeeDetails?.password && showPassword
                  ? employeeDetails.password
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
            <p className='w-[100px] font-semibold'>Status</p>
            <p
              className={cn(
                employeeDetails?.status === 'ACTIVE'
                  ? 'activeBadge'
                  : 'inactiveBadge'
              )}
            >
              {employeeDetails?.status}
            </p>
          </div>
        </div>

        <div className='mt-4 text-right'>
          <Button onClick={() => setOpenEmployeePasswordModal(true)}>
            Change Password
          </Button>
        </div>
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
