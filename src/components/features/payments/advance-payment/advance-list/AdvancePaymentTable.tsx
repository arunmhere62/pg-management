'use client';
import axiosService from '@/services/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { toast } from 'sonner';
import { fetchAdvanceList } from '@/services/utils/api/payment/advance-api';

interface IRentPaymentListProps {
  id: number;
  amountPaid: number;
  paymentDate: number;
  paymentMethod: string;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenantName: string;
  rooms: {
    roomNo: string;
  };
  roomNo?: string;
  bedNo?: string;
  name: string;
  phoneNo: string;
}
export const AdvancePaymentTable = () => {
  const router = useRouter();
  const [rentPaymentList, setRentPaymentList] = useState<
    IRentPaymentListProps[]
  >([]);

  useEffect(() => {
    const getPayments = async () => {
      try {
        const res = await fetchAdvanceList();
        if (res.data) {
          const formattedData = res.data.map((d: any) => {
            return {
              ...d,
              roomNo: d?.rooms?.roomNo ?? '',
              bedNo: d?.beds?.bedNo ?? '',
              name: d?.tenants?.name ?? '',
              paymentDate: formatDateToDDMMYYYY(d.paymentDate) ?? '',
              phoneNo: d?.tenants?.phoneNo ?? ''
            };
          });
          setRentPaymentList(formattedData);
        }
      } catch (error) {
        toast.error('Fetching the payments list failed try again later');
      }
    };
    getPayments();
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', minWidth: 100 },
    { field: 'phoneNo', headerName: 'Phone No', minWidth: 130 },
    {
      field: 'roomNo',
      headerName: 'Room No',
      minWidth: 130,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      minWidth: 100,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'amountPaid',
      headerName: 'Advance Amount',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='rounded-lg bg-[#ebffe2] px-2 py-1 font-bold text-[#328a17]'>
          ₹{params.value}
        </span>
      )
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      minWidth: 150
    },
    {
      field: 'status',
      headerName: 'Payment Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'PAID'
              ? 'bg-[#ebffe2] text-[#328a17]'
              : 'bg-[#fa7171] text-white',
            'rounded-lg px-2 py-1 text-[13px] font-bold'
          )}
        >
          {params.value}
        </span>
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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <div className='ml-3 mt-3 flex gap-3'>
          <EditIcon
            onClick={() => {
              router.push(`/payment/advance/${params.row.id}`);
            }}
            className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
          />
          <Trash2
            onClick={() => {
              alert(JSON.stringify(params.row));
            }}
            className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
          />
          <Eye
            onClick={() => {
              router.push(`/payment/details/${params.row.id}`);
            }}
            className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
          />
        </div>
      )
    }
  ];
  return (
    <>
      <HeaderButton
        title='Advance Amount List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/payment/advance/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={rentPaymentList}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
    </>
  );
};
