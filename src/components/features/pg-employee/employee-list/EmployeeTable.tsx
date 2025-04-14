'use client';
import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import {
  deleteEmployee,
  fetchEmployeesList
} from '@/services/utils/api/employee-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { IEmployeeProps, IRoleProps } from '@/services/types/common-types';
import EmployeePassword from '../employee-form/password-form/EmployeePassword';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

export interface IEmployeeTableProps extends IEmployeeProps {
  roles: IRoleProps;
}

const EmployeesList = () => {
  const router = useRouter();
  const [employeesData, setEmployeesData] = useState<IEmployeeTableProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEmployeeRemoveModal, setOpenEmployeeRemoveModal] =
    useState<boolean>(false);
  const [openEmployeePasswordModal, setOpenEmployeePasswordModal] =
    useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  useSetBreadcrumbs([{ title: 'Employees', link: '/employee' }]);
  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployeesList();
      if (res.data) {
        const formattedRes = res.data.map((data: IEmployeeTableProps) => ({
          ...data,
          roleName: data.roles.roleName
        }));
        setEmployeesData(formattedRes);
      }
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleRemoveEmployee = async () => {
    try {
      if (selectedEmployeeId) {
        const res = await deleteEmployee(String(selectedEmployeeId));
        if (res.status === 200) {
          toast.success('Employee removed successfully!');
          getEmployees();
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong.';
      toast.error(errorMessage);
    }
  };

  const columns = [
    {
      pinnable: true,
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger className='h-fit w-fit'>
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/employee/${params.row.id}`);
                }}
              >
                <EditIcon className='w-4 text-muted-foreground hover:text-black dark:hover:text-white' />
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setSelectedEmployeeId(params.row.id);
                  setOpenEmployeeRemoveModal(true);
                }}
              >
                <Trash2 className='w-4 text-red-500 hover:text-black dark:hover:text-white' />
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  router.push(`/employee/details/${params.row.id}`);
                }}
              >
                <Eye className='w-4 text-muted-foreground hover:text-black dark:hover:text-white' />
              </Button>
            </div>
            <Button
              className='mt-2 w-full'
              variant='outline'
              onClick={() => {
                setSelectedEmployeeId(params.row.id);
                setOpenEmployeePasswordModal(true);
              }}
            >
              Change Password
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
    { field: 'roleName', headerName: 'Role', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'ACTIVE' ? 'activeBadge' : 'inactiveBadge',
            'rounded-lg px-2 py-1 text-[13px] font-bold'
          )}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    }
  ];

  return (
    <>
      <HeaderButton
        title='Employees List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/employee/new');
            },
            variant: 'default'
          }
        ]}
      />

      <div className='mt-2'>
        <GridTable
          tableHeight='550px'
          columns={columns}
          rows={employeesData}
          loading={loading}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>

      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openEmployeeRemoveModal}
        title=''
        onClose={() => setOpenEmployeeRemoveModal(false)}
        description='Are you sure you want to remove this employee?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveEmployee();
              setOpenEmployeeRemoveModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => setOpenEmployeeRemoveModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openEmployeePasswordModal}
        title='Change Employee Password'
        onClose={() => setOpenEmployeePasswordModal(false)}
        description='Are you sure you want to Change Password?'
      >
        <EmployeePassword employeeId={selectedEmployeeId?.toString()} />
      </Modal>
    </>
  );
};

export default EmployeesList;
