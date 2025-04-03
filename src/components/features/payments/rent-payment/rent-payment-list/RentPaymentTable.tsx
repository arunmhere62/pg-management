'use client';
import axiosService from '@/services/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  DownloadIcon,
  EditIcon,
  Eye,
  FileText,
  MailIcon,
  MessageCircle,
  SheetIcon,
  Trash2
} from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { toast } from 'sonner';
import { fetchRentsList } from '@/services/utils/api/payment/rent-api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Modal } from '@/components/ui/modal';
import InvoiceReceipt from '../receipt/RentRecepit';
import {
  IBedProps,
  IPgLocationProps,
  IRoomProps,
  ITenantProps
} from '@/services/types/common-types';
import ReceiptForm from '../receipt/ReceiptForm';

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

export interface IPaymentProps {
  id: number;
  tenantId: number;
  pgId: number;
  roomId: number;
  bedId: number;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  beds: IBedProps;
  pgLocations: IPgLocationProps;
  rooms: IRoomProps;
  tenants: ITenantProps;
}

const RentPaymentList = () => {
  const router = useRouter();
  const [rentPaymentList, setRentPaymentList] = useState<
    IRentPaymentListProps[]
  >([]);
  const [openReceiptDownloadModal, setOpenReceiptDownloadModal] =
    useState<boolean>(false);
  const [openReceiptUploadModal, setOpenReceiptUploadModal] =
    useState<boolean>(false);
  const [tenantPaymentDetails, setTenantPaymentDetails] =
    useState<IPaymentProps>();
  useEffect(() => {
    const getPayments = async () => {
      try {
        const res = await fetchRentsList();
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
      headerName: 'Amount Paid',
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
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>
          {params?.value ? formatDateToDDMMYYYY(params?.value) : 'N/A'}
        </span>
      )
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{formatDateToDDMMYYYY(params?.value)}</span>
      )
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
      width: 100,
      renderCell: (params: any) => {
        const handleReceipt = () => {
          setTenantPaymentDetails(params.row);
          setOpenReceiptDownloadModal(true);
        };
        const handleMailReceipt = () => {
          setOpenReceiptUploadModal(true);
        };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className='h-fit w-fit'>
              <DotsVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/payment/rent/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => alert(JSON.stringify(params.row))}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/payment/rent-details/${params.row.id}`)
                    }
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                </div>

                <Button variant='outline' onClick={handleReceipt}>
                  <DownloadIcon className='mr-2 w-4' /> Download Receipt
                </Button>
                <Button variant='outline' onClick={handleMailReceipt}>
                  <MailIcon className='mr-2 w-4' /> Mail Receipt
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
  return (
    <>
      <HeaderButton
        title='Rent Amount List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/payment/rent/new');
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
      <Modal
        contentClassName='max-w-[800px] rounded-lg sm:w-full'
        isOpen={openReceiptDownloadModal}
        title=''
        onClose={() => {
          setOpenReceiptDownloadModal(false);
        }}
        description=''
      >
        <InvoiceReceipt tenantPaymentDetails={tenantPaymentDetails} />
      </Modal>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openReceiptUploadModal}
        title=''
        onClose={() => {
          setOpenReceiptUploadModal(false);
        }}
        description=''
      >
        <ReceiptForm />
      </Modal>
    </>
  );
};

export default RentPaymentList;
