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
import {
  formatDateToDDMMYYYY,
  formatDateToMonDDYYYY
} from '@/services/utils/formaters';
import { toast } from 'sonner';
import {
  deleteRent,
  fetchRentsList
} from '@/services/utils/api/payment/rent-api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO
} from 'date-fns';
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
import { SelectComboBox } from '@/components/ui/selectComboBox';
import CurrentBillForm from '@/components/features/payments/current-bill/CurrentBillForm';
import { updateCurrentBill } from '@/services/utils/api/payment/current-bill-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

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
  const [openRentRemoveConfirmModal, setOpenRentRemoveConfirmModal] =
    useState<boolean>(false);
  const [selectedRentId, setSelectedRentId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    'this_month'
  );
  const [filteredPaymentData, setFilteredPaymentData] = useState<
    IRentPaymentListProps[]
  >([]);
  const [openCurrentBillModal, setOpenCurrentBillModal] =
    useState<boolean>(false);
  useSetBreadcrumbs([{ title: 'Rent', link: '/payment/rent' }]);
  useEffect(() => {
    if (selectedMonth && rentPaymentList.length) {
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

      const filtered = rentPaymentList.filter((payment) => {
        const createdAt = parseISO(payment.createdAt);
        return isWithinInterval(createdAt, { start: startDate, end: endDate });
      });

      setFilteredPaymentData(filtered);
    } else {
      setFilteredPaymentData(rentPaymentList);
    }
  }, [selectedMonth, rentPaymentList]);

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

  useEffect(() => {
    getPayments();
  }, []);

  const handleRemoveRent = async () => {
    try {
      if (selectedRentId) {
        const res = await deleteRent(String(selectedRentId));
        if (res.status === 200) {
          toast.success('Rent removed bed is free now!');
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
  const rentOptions = [
    {
      label: 'This Month',
      value: 'this_month'
    },
    {
      label: 'Last Month',
      value: 'last_month'
    },
    {
      label: 'Last 3 Months',
      value: 'last_3_months'
    },
    {
      label: 'Last 6 Months',
      value: 'last_6_months'
    },
    {
      label: 'Last 1 Year',
      value: 'last_1_year'
    }
  ];

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
                      router.push(`/payment/rent/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedRentId(params.row.id);
                      setOpenRentRemoveConfirmModal(true);
                    }}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
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
                <Button
                  variant='outline'
                  onClick={() => {
                    setSelectedRentId(params.row.id);
                    setOpenCurrentBillModal(true);
                  }}
                >
                  Current Bill
                </Button>
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
    // {
    //   field: 'paymentDate',
    //   headerName: 'Payment Date',
    //   minWidth: 150
    // },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>
          {params?.value ? formatDateToMonDDYYYY(params?.value) : 'N/A'}
        </span>
      )
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 150,
      renderCell: (params: any) => (
        <span>{formatDateToMonDDYYYY(params?.value)}</span>
      )
    },
    {
      field: 'status',
      headerName: 'Payment Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'PAID' ? 'activeBadge' : 'bg-[#fa7171] text-white',
            'rounded-lg px-2 py-1 text-[13px] font-bold'
          )}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'currentBill',
      headerName: 'Current Bill',
      minWidth: 150,
      renderCell: (params: any) => (
        <span className={cn(params.value ? 'activeBadge' : '')}>
          {params.value ? '₹' + params.value : 'N/A'}
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
      <div className='mb-3 mt-3'>
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
      </div>

      <div className='mt-1 flex gap-3'>
        <div className='w-[200px]'>
          <SelectComboBox
            options={rentOptions}
            placeholder='Select a Month'
            value={selectedMonth || ''}
            onChange={(e: string | null) => {
              setSelectedMonth(e);
            }}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => {
            // setFilteredBedsData([])
            setSelectedMonth(null);
          }}
        >
          clear
        </Button>
      </div>
      <div className='mt-2'>
        <GridTable
          tableHeight='530px'
          columns={columns}
          rows={filteredPaymentData ?? rentPaymentList}
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
        <InvoiceReceipt tenantPaymentDetails={tenantPaymentDetails} />
      </Modal>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openReceiptUploadModal}
        title='Rent Payment Receipt'
        onClose={() => {
          setOpenReceiptUploadModal(false);
        }}
        description=''
      >
        <ReceiptForm />
      </Modal>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openRentRemoveConfirmModal}
        title=''
        onClose={() => {
          setOpenRentRemoveConfirmModal(false);
        }}
        description='Are you sure you want to delete the Advance Payment?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveRent();
              setOpenRentRemoveConfirmModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setOpenRentRemoveConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openCurrentBillModal}
        title='Current Bill'
        onClose={() => {
          setOpenCurrentBillModal(false);
        }}
        description='Add tenant current bill in the below form'
      >
        <CurrentBillForm
          tenantPaymentId={selectedRentId}
          onSubmit={async (payload) => {
            if (selectedRentId) {
              const res = await updateCurrentBill(
                payload,
                selectedRentId.toString()
              );
              if (res.status === 200) {
                toast.success('Current Bill Added successfully!');
                setOpenCurrentBillModal(false);
                getPayments();
              } else {
                toast.error(res.message || 'Failed to Add Current Bill');
              }
            }
          }}
        />
      </Modal>
    </>
  );
};

export default RentPaymentList;
