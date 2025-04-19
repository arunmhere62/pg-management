'use client';
import { Button } from '@/components/ui/button';
import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import {
  deleteEmployeeSalary,
  fetchEmployeeSalaryList
} from '@/services/utils/api/employee-salary-api';
import {
  IEmployeeSalaryProps,
  IUserProps
} from '@/services/types/common-types';
interface IEmployeeSalaryTableProps extends IEmployeeSalaryProps {
  users: IUserProps;
}
const EmployeeSalaryTable = () => {
  const router = useRouter();
  const [employeeSalaryList, setEmployeeSalaryList] = useState<
    IEmployeeSalaryTableProps[]
  >([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [openSalaryModal, setOpenSalaryModal] = useState<boolean>(false);
  useSetBreadcrumbs([{ title: 'Employee Salary', link: '/' }]);

  useEffect(() => {
    const getEmployeeSalaryList = async () => {
      setTableLoading(true);
      try {
        const res = await fetchEmployeeSalaryList();
        if (res.data) {
          const resModel = res.data.map((data: IEmployeeSalaryTableProps) => ({
            id: data.id,
            userId: data.userId,
            salaryAmount: data.salaryAmount,
            month: data.month,
            year: data.year,
            paidDate: data.paidDate,
            paymentMethod: data.paymentMethod,
            remarks: data.remarks,
            isDeleted: data.isDeleted,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            userName: data.users.name
          }));
          setEmployeeSalaryList(resModel);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          'Something went wrong.';
        toast.error(errorMessage);
      } finally {
        setTableLoading(false);
      }
    };
    getEmployeeSalaryList();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteEmployeeSalary(id.toString());
      if (res.status === 200) {
        toast.success('Employee Salary deleted successfully');
        setEmployeeSalaryList((prev) => prev.filter((item) => item.id !== id));
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
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className='h-fit w-fit'>
              <DotsVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/employee-salary/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => handleDelete(params.row.id)}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/employee-salary/${params.row.id}`)
                    }
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
    {
      field: 'userName',
      headerName: 'Employee Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => <span>{params.value}</span>
    },
    {
      field: 'salaryAmount',
      headerName: 'Salary Amount',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='activeBadge'>₹{params.value}</span>
      )
    },
    {
      field: 'month',
      headerName: 'Month',
      minWidth: 100,
      renderCell: (params: any) => <span>{params.value}</span>
    },
    {
      field: 'year',
      headerName: 'Year',
      minWidth: 100,
      renderCell: (params: any) => <span>{params.value}</span>
    },
    {
      field: 'paidDate',
      headerName: 'Paid Date',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='paymentBadge'>{params.value || 'N/A'}</span>
      )
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      minWidth: 150,
      renderCell: (params: any) => <span>{params.value || 'N/A'}</span>
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    }
  ];

  return (
    <>
      <HeaderButton
        title='Employee Salary List'
        buttons={[
          {
            label: 'Create New Salary',
            onClick: () => {
              router.push('/employee-salary/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={employeeSalaryList || []}
          loading={tableLoading}
          rowHeight={90}
          showToolbar={true}
          hideFooter={false}
        />
        <Modal
          contentClassName='w-[95%] rounded-lg sm:w-full'
          isOpen={openSalaryModal}
          title='Create Employee Salary'
          onClose={() => {
            setOpenSalaryModal(false);
          }}
          description='Fill in the details for the employee salary.'
        >
          {/* <EmployeeSalaryForm mode='create' /> */}
        </Modal>
      </div>
    </>
  );
};

export default EmployeeSalaryTable;
