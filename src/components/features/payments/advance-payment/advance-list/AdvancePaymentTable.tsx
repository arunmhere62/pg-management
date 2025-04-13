'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DownloadIcon, EditIcon, Eye, MailIcon, Trash2 } from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { toast } from 'sonner';
import {
  deleteAdvance,
  fetchAdvanceList
} from '@/services/utils/api/payment/advance-api';
import { Button } from '@/components/ui/button';
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
import AdvanceReceipt from '../advance-receipt/AdvanceRecepit';
import AdvanceReceiptForm from '../advance-receipt/AdvanceReceiptForm';
import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths
} from 'date-fns';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { monthOptions } from '@/services/data/data';

interface IAdvancePaymentListProps {
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
export interface IAdvancePaymentProps {
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

export const AdvancePaymentTable = () => {
  const router = useRouter();
  const [advancePaymentList, setAdvancePaymentList] = useState<
    IAdvancePaymentListProps[]
  >([]);
  const [openReceiptDownloadModal, setOpenReceiptDownloadModal] =
    useState<boolean>(false);
  const [openReceiptUploadModal, setOpenReceiptUploadModal] =
    useState<boolean>(false);
  const [tenantPaymentDetails, setTenantPaymentDetails] =
    useState<IAdvancePaymentProps>();
  const [openAdvanceRemoveConfirmModal, setOpenAdvanceRemoveConfirmModal] =
    useState<boolean>(false);
  const [selectedAdvanceId, setSelectedAdvanceId] = useState<number | null>(
    null
  );
  const [filteredPaymentData, setFilteredPaymentData] = useState<
    IAdvancePaymentListProps[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('this_month');

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
        setAdvancePaymentList(formattedData);
      }
    } catch (error) {
      toast.error('Fetching the payments list failed try again later');
    }
  };
  useEffect(() => {
    getPayments();
  }, []);

  // Filtering by month
  useEffect(() => {
    if (selectedMonth && advancePaymentList.length) {
      const now = new Date();
      let startDate: Date;
      let endDate = now;

      switch (selectedMonth) {
        case 'this_month':
          startDate = startOfMonth(now);
          break;
        case 'last_month':
          startDate = startOfMonth(subMonths(now, 1));
          endDate = endOfMonth(subMonths(now, 1));
          break;
        case 'last_3_months':
          startDate = startOfMonth(subMonths(now, 3));
          break;
        case 'last_6_months':
          startDate = startOfMonth(subMonths(now, 6));
          break;
        case 'last_1_year':
          startDate = startOfMonth(subMonths(now, 12));
          break;
        default:
          return;
      }

      const filtered = advancePaymentList.filter((payment) => {
        const createdAt = parseISO(payment.createdAt);
        return isWithinInterval(createdAt, { start: startDate, end: endDate });
      });

      setFilteredPaymentData(filtered);
    } else {
      setFilteredPaymentData(advancePaymentList);
    }
  }, [selectedMonth, advancePaymentList]);

  const handleRemoveAdvance = async () => {
    try {
      if (selectedAdvanceId) {
        const res = await deleteAdvance(String(selectedAdvanceId));
        if (res.status === 200) {
          toast.success('Advance removed bed is free now!');
          getPayments();
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
                      router.push(`/payment/advance/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedAdvanceId(params.row.id);
                      setOpenAdvanceRemoveConfirmModal(true);
                    }}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/payment/advance-details/${params.row.id}`)
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
        <span className='activeBadge'>₹{params.value}</span>
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
      <div className='mt-1 flex gap-3'>
        <div className='w-[200px]'>
          <SelectComboBox
            options={monthOptions}
            value={selectedMonth}
            onChange={(e: string | null) => setSelectedMonth(e || 'this_month')}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => {
            // setFilteredBedsData([])
            setSelectedMonth('');
          }}
        >
          clear
        </Button>
      </div>

      <div className='mt-2'>
        <GridTable
          tableHeight='520px'
          columns={columns}
          rows={advancePaymentList}
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
        <AdvanceReceipt tenantPaymentDetails={tenantPaymentDetails} />
      </Modal>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openReceiptUploadModal}
        title='Advance Payment Receipt'
        onClose={() => {
          setOpenReceiptUploadModal(false);
        }}
        description=''
      >
        <AdvanceReceiptForm />
      </Modal>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openAdvanceRemoveConfirmModal}
        title=''
        onClose={() => {
          setOpenAdvanceRemoveConfirmModal(false);
        }}
        description='Are you sure you want to remove this tenant?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveAdvance();
              setOpenAdvanceRemoveConfirmModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setOpenAdvanceRemoveConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};
