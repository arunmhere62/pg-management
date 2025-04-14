'use client';

import { fetchEmployeeById } from '@/services/utils/api/employee-api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Edit,
  EyeIcon,
  EyeOff,
  Mail,
  Phone,
  UserCircle
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import EmployeePassword from '../pg-employee/employee-form/password-form/EmployeePassword';
import { Button } from '@/components/ui/button';
import {
  ICityDataProps,
  IEmployeeProps,
  IRoleProps,
  IStateDataProps
} from '@/services/types/common-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MainUserProfileProps extends IEmployeeProps {
  roles: IRoleProps;
  state: IStateDataProps;
  city: ICityDataProps;
}
const MainUserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const [user, setUser] = useState<MainUserProfileProps>();
  const [openEmployeePasswordModal, setOpenEmployeePasswordModal] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const res = await fetchEmployeeById(userId);
          setUser(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (!user) {
    return (
      <div className='py-10 text-center text-muted-foreground'>
        Loading profile...
      </div>
    );
  }

  return (
    <div className='rounded-xl border p-7'>
      {/* Header Section */}
      <div className='mb-6 flex items-start justify-between border-b pb-4'>
        {/* Left: User Info */}
        <div className='flex items-center gap-4'>
          {user.profileImages && user.profileImages.length > 0 ? (
            <Image
              width={100}
              height={100}
              src={user.profileImages[0]}
              alt='User Profile'
              className='h-20 w-20 rounded-full border object-cover'
            />
          ) : (
            <UserCircle className='h-20 w-20 text-primary' />
          )}

          <div>
            <h1 className='text-2xl font-bold'>{user.name}</h1>

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Mail className='h-4 w-4' />
              <span>{user.email}</span>
            </div>

            <div className='mt-1 text-sm text-muted-foreground'>
              Role:{' '}
              <span className='font-medium'>
                {user.roles.roleName.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Edit Button */}
        <Button
          onClick={() => router.push(`/employee/${user.id}`)}
          variant='default'
          size='sm'
        >
          <Edit className='mr-2 h-4 w-4' /> Edit
        </Button>
      </div>

      {/* Profile Fields */}
      {/* Profile Fields */}
      {/* <div className='mb-6 flex  flex-col gap-4 border-b pb-4'>
      <p className=' font-bold'>Proof Documents</p>
        {user.proofDocuments && user.proofDocuments.length > 0 ? (
          <Image
          width={100}
          height={100}
            src={user.proofDocuments[0]}
            alt='User Profile'
            className='h-20 w-20 rounded-xl  border object-cover'
          />
        ) : (
          <p>No documents uploaded</p>
        )}
      </div> */}
      <div className='grid grid-cols-1 gap-x-11 gap-y-5 text-sm sm:grid-cols-2'>
        <ProfileField label='Status'>
          <span className='flex items-center gap-1 font-medium'>
            {user.status}
            {user.status === 'ACTIVE' && (
              <BadgeCheck className='h-4 w-4 text-green-500' />
            )}
          </span>
        </ProfileField>

        <ProfileField label='Phone'>
          <span className='flex items-center gap-2 font-medium'>
            {user.phone || 'Not provided'}
            <Phone className='h-4 w-4 text-muted-foreground' />
          </span>
        </ProfileField>

        <ProfileField label='Gender'>
          {user.gender || 'Not specified'}
        </ProfileField>

        <ProfileField label='Email'>{user.email}</ProfileField>

        <ProfileField label='Address'>
          {user.address || 'Not provided'}
        </ProfileField>

        <ProfileField label='Pincode'>
          {user.pincode || 'Not provided'}
        </ProfileField>

        <ProfileField label='State'>
          {user.state?.name || 'Not specified'}
        </ProfileField>

        <ProfileField label='City'>
          {user.city?.name || 'Not specified'}
        </ProfileField>

        <ProfileField label='Role'>
          {user.roles?.roleName || user.roleId}
        </ProfileField>

        <ProfileField label='Organization ID'>
          {user.organizationId || 'N/A'}
        </ProfileField>

        <ProfileField label='PG ID'>{user.pgId || 'N/A'}</ProfileField>

        <ProfileField label='Created At'>
          {new Date(user.createdAt).toLocaleDateString()}
        </ProfileField>

        <ProfileField label='Last Updated'>
          {new Date(user.updatedAt).toLocaleDateString()}
        </ProfileField>

        <ProfileField label='Password'>
          <div className='flex w-full items-center justify-between font-mono'>
            <span>
              {user.password && showPassword ? user.password : '********'}
            </span>
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='ml-2'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <EyeIcon className='h-4 w-4' />
              )}
            </button>
          </div>
        </ProfileField>
      </div>

      {/* Change Password Button */}
      <div className='mt-8 text-right'>
        <Button onClick={() => setOpenEmployeePasswordModal(true)}>
          Change Password
        </Button>
      </div>

      {/* Password Change Modal */}
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openEmployeePasswordModal}
        title='Change Employee Password'
        onClose={() => setOpenEmployeePasswordModal(false)}
        description='Are you sure you want to change the password?'
      >
        <EmployeePassword employeeId={userId?.toString()} />
      </Modal>
    </div>
  );
};

export default MainUserProfile;

// ✅ Reusable field block
const ProfileField = ({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex justify-between'>
    <div className='mb-1 text-muted-foreground'>{label}</div>
    <div className='text-lg font-semibold'>{children}</div>
  </div>
);
