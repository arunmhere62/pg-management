'use client';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
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
import { IExpensesProps } from '@/services/types/common-types';
import { fetchExpenseList } from '@/services/utils/api/expense-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

const ExpensesList = () => {
  const router = useRouter();
  const [expenseData, setExpenseData] = useState<IExpensesProps[]>([]);
  const [loading, setLoading] = useState(false);

  useSetBreadcrumbs([{ title: 'Expense', link: '/expense' }]);
  useEffect(() => {
    const getBeds = async () => {
      setLoading(true);

      try {
        const res = await fetchExpenseList();
        if (res.data) {
          setExpenseData(res.data);
        }
      } catch (error) {
        toast.error('fetching failed');
      } finally {
        setLoading(false);
      }
    };
    getBeds();
  }, []);

  const columns = [
    {
      pinnable: true,
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
                      router.push(`/expense/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => alert(JSON.stringify(params.row))}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  {/* <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/expense/details/${params.row.id}`)
                    }
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button> */}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
    // { field: 'id', headerName: 'S No', width: 50 },
    // {
    //   field: 'images',
    //   headerName: 'Profile',
    //   width: 100,
    //   renderCell: (params: any) => {
    //     const image = params?.value?.[0];

    //     return image ? (
    //       <div className='mt-2.5'>
    //         <Image
    //           src={image}
    //           alt='Profile'
    //           width={50}
    //           height={50}
    //           className='h-[40px] w-[60px] rounded-md object-cover'
    //         />
    //       </div>
    //     ) : (
    //       <span>No Image</span>
    //     );
    //   }
    // },
    // { field: 'tenantName', headerName: 'Name', flex: 1 },
    { field: 'expenseType', headerName: 'Expense', flex: 1, minWidth: 150 },
    { field: 'remarks', headerName: 'Remarks', flex: 1, minWidth: 150 },
    {
      field: 'amount',
      headerName: 'amount',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='rounded-lg bg-[#ebffe2] px-2 py-1 font-bold text-[#328a17]'>
          ₹{params.value}
        </span>
      )
    },
    {
      field: 'paidDate',
      headerName: 'Payment Date',
      flex: 1,
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
        <span className='rounded-lg bg-[#fff1bb] px-2 py-1 font-bold text-[#000000]'>
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
        title='Expense List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/expense/new');
            },
            variant: 'default'
          }
        ]}
      />

      <div className='mt-2'>
        <GridTable
          columns={columns}
          rows={expenseData}
          loading={loading}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
    </>
  );
};

export default ExpensesList;
