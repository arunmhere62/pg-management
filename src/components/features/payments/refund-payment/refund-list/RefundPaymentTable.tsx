'use client';
import axiosService from '@/services/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DownloadIcon, EditIcon, Eye, MailIcon, Trash2 } from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { toast } from 'sonner';
import {
  deleteRefund,
  fetchRefundList
} from '@/services/utils/api/payment/refund-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import {
  IBedProps,
  IPgLocationProps,
  IRoomProps,
  ITenantProps
} from '@/services/types/common-types';
import { Modal } from '@/components/ui/modal';
import { IAdvancePaymentProps } from '../../advance-payment/advance-list/AdvancePaymentTable';
import { Button } from '@/components/ui/button';
import RefundReceipt from '../refund-receipt/RefundRecepit';
import RefundReceiptForm from '../refund-receipt/RefundReceiptForm';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

interface IRefundPaymentListProps {
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
export const RefundPaymentTable = () => {
  const router = useRouter();
  const [refundPaymentList, setRefundPaymentList] = useState<
    IRefundPaymentListProps[]
  >([]);
  const [openReceiptDownloadModal, setOpenReceiptDownloadModal] =
    useState<boolean>(false);
  const [openReceiptUploadModal, setOpenReceiptUploadModal] =
    useState<boolean>(false);
  const [tenantPaymentDetails, setTenantPaymentDetails] =
    useState<IAdvancePaymentProps>();
  const [openRefundRemoveConfirmModal, setOpenRefundRemoveConfirmModal] =
    useState<boolean>(false);
  const [selectedRefundId, setSelectedRefundId] = useState<number | null>(null);

  useSetBreadcrumbs([{ title: 'Refund', link: '/payment/refund' }]);
  const getRefunds = async () => {
    try {
      const res = await fetchRefundList();
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
        setRefundPaymentList(formattedData);
      }
    } catch (error) {
      toast.error('Fetching the Refunds list failed try again later');
    }
  };
  useEffect(() => {
    getRefunds();
  }, []);

  const handleRemoveRefund = async () => {
    try {
      if (selectedRefundId) {
        const res = await deleteRefund(String(selectedRefundId));
        if (res.status === 200) {
          toast.success('Refund removed bed is free now!');
          getRefunds();
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
            <DropdownMenuContent align='start'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/payment/refund/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedRefundId(params.row.id);
                      setOpenRefundRemoveConfirmModal(true);
                    }}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/payment/refund-details/${params.row.id}`)
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
    },
    { field: 'name', headerName: 'Name', minWidth: 150 },
    { field: 'phoneNo', headerName: 'Phone No', minWidth: 150 },
    {
      field: 'roomNo',
      headerName: 'Room No',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'amountPaid',
      headerName: 'Amount Paid',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='activeBadge'>₹{params.value}</span>
      )
    },
    {
      field: 'paymentDate',
      headerName: 'Refund Date',
      minWidth: 150
    },
    {
      field: 'status',
      headerName: 'Payment Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'PAID' ? 'activeBadge' : 'inactiveBadge',
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
    }

    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 150,
    //   renderCell: (params: any) => (
    //     <div className='ml-3 mt-3 flex gap-3'>
    //       <EditIcon
    //         onClick={() => {
    //           router.push(`/payment/refund/${params.row.id}`);
    //         }}
    //         className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
    //       />
    //       <Trash2
    //         onClick={() => {
    //           alert(JSON.stringify(params.row));
    //         }}
    //         className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
    //       />
    //       <Eye
    //         onClick={() => {
    //           router.push(`/payment/details/${params.row.id}`);
    //         }}
    //         className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
    //       />
    //     </div>
    //   )
    // }
  ];
  return (
    <>
      <div className='mb-3 mt-3'>
        <HeaderButton
          title='Refund Amount List'
          buttons={[
            {
              label: 'Create New',
              onClick: () => {
                router.push('/payment/refund/new');
              },
              variant: 'default'
            }
          ]}
        />
      </div>

      <div className='mt-2'>
        <GridTable
          tableHeight='550px'
          columns={columns}
          rows={refundPaymentList}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openReceiptDownloadModal}
        title=''
        onClose={() => {
          setOpenReceiptDownloadModal(false);
        }}
        description=''
      >
        <RefundReceipt tenantPaymentDetails={tenantPaymentDetails} />
      </Modal>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openReceiptUploadModal}
        title='Refund Payment Receipt'
        onClose={() => {
          setOpenReceiptUploadModal(false);
        }}
        description=''
      >
        <RefundReceiptForm />
      </Modal>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openRefundRemoveConfirmModal}
        title=''
        onClose={() => {
          setOpenRefundRemoveConfirmModal(false);
        }}
        description='Are you sure you want to delete this refund?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveRefund();
              setOpenRefundRemoveConfirmModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setOpenRefundRemoveConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};
