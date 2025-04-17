'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, Eye, MessageCircle, Trash2, Trash2Icon } from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import {
  fetchTenantsList,
  removeTenant
} from '@/services/utils/api/tenant-api';
import {
  formatDateToDDMMYYYY,
  formatDateToMonDDYYYY
} from '@/services/utils/formaters';
import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths
} from 'date-fns';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import {
  IBedProps,
  IRoomProps,
  ITenantPaymentProps
} from '@/services/types/common-types';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { monthOptions } from '@/services/data/data';
import CurrentBillForm from '../../payments/current-bill/CurrentBillForm';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

interface ITenantListProps {
  id: number;
  bedId: number;
  tenantId: string;
  pgId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  email: string;
  images: string;
  name: string;
  phoneNo: string;
  proofDocuments: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isRentPaid: boolean;
  isAdvancePaid: boolean;
  rooms: IRoomProps;
  beds: IBedProps;
  tenantPayments: ITenantPaymentProps[];
}
const TenantList = () => {
  const router = useRouter();
  const [tenantList, setTenantList] = useState<ITenantListProps[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('this_month');
  const [filteredTenantData, setFilteredTenantData] = useState<
    ITenantListProps[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [openTenantRemoveConfirmModal, setOpenTenantRemoveConfirmModal] =
    useState<boolean>(false);
  useSetBreadcrumbs([{ title: 'Tenant', link: '/tenant' }]);
  const getTenants = async () => {
    try {
      const res = await fetchTenantsList({ isDeleted: 'false' });
      const formattedRes = res.data.map((d: ITenantListProps) => {
        const lastPayment = d.tenantPayments.at(-1);
        return {
          roomNo: d.rooms.roomNo,
          bedNo: d.beds.bedNo,
          startDate: lastPayment?.startDate
            ? formatDateToMonDDYYYY(lastPayment?.startDate)
            : 'N/A',
          endDate: lastPayment?.endDate
            ? formatDateToMonDDYYYY(lastPayment?.endDate)
            : 'N/A',
          ...d
        };
      });
      if (res.data) {
        setTenantList(formattedRes);
      }
    } catch (error) {
      throw new Error('Fetching the tenant list failed');
    }
  };
  useEffect(() => {
    getTenants();
  }, []);

  useEffect(() => {
    if (selectedMonth && tenantList.length) {
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

      const filtered = tenantList.filter((tenant) => {
        const checkIn = parseISO(tenant.checkInDate);
        return isWithinInterval(checkIn, { start: startDate, end: endDate });
      });

      setFilteredTenantData(filtered);
    } else {
      setFilteredTenantData(tenantList);
    }
  }, [selectedMonth, tenantList]);

  // Filter tenants based on selected room
  useEffect(() => {
    if (selectedRoom) {
      const filtered = tenantList.filter(
        (tenant) => String(tenant.rooms.id) === selectedRoom
      );
      setFilteredTenantData(filtered);
    } else {
      setFilteredTenantData(tenantList);
    }
  }, [selectedRoom, tenantList]);

  const handleRemoveTenant = async () => {
    try {
      if (selectedTenantId) {
        const res = await removeTenant(String(selectedTenantId));
        if (res.status === 200) {
          toast.success('Bed is deleted successfully!');
          getTenants();
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
        const sendWhatsAppMessage = () => {
          const phone = params.row.phoneNo;
          const message = encodeURIComponent(
            `Hello ${params.row.name}, your rent is due.`
          );
          if (phone) {
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
          } else {
            alert('Phone number is missing');
          }
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
                      router.push(`/tenant/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedTenantId(params.row.id);
                      setOpenTenantRemoveConfirmModal(true);
                    }}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() =>
                      router.push(`/tenant/details/${params.row.id}`)
                    }
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                </div>

                <Button
                  variant='outline'
                  onClick={() => {
                    router.push(`/payment/rent/new/${params.row.id}`);
                  }}
                >
                  Add Rent
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    router.push(`/payment/advance/new/${params.row.id}`);
                  }}
                >
                  Add Advance
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    router.push(`/payment/refund/new/${params.row.id}`);
                  }}
                >
                  Add Refund
                </Button>
                <Button variant='outline' onClick={sendWhatsAppMessage}>
                  <MessageCircle className='mr-2 w-4' /> Whats App
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
    // {
    //   field: 'images',
    //   headerName: 'Profile',
    //   width: 100,
    //   renderCell: (params: any) => {
    //     const image = params?.value?.[0] || [];
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
    { field: 'name', headerName: 'Name', minWidth: 150, flex: 1 },
    // { field: 'email', headerName: 'Email', minWidth: 140, flex: 1 },
    {
      field: 'roomNo',
      headerName: 'Room No',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },

    { field: 'phoneNo', headerName: 'Phone No', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'ACTIVE' ? 'activeBadge' : 'inactiveBadge'
          )}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'isRentPaid',
      headerName: 'Rent Status',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className={cn(params.value ? 'activeBadge' : 'inactiveBadge')}>
          {params.value ? 'Paid' : 'Pending'}
        </span>
      )
    },
    {
      field: 'isAdvancePaid',
      headerName: 'Advance Status',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className={cn(params.value ? 'activeBadge' : 'inactiveBadge')}>
          {params.value ? 'Paid' : 'Pending'}
        </span>
      )
    },
    {
      field: 'startDate',
      headerName: 'Rent Start ',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'endDate',
      headerName: 'Rent End',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'checkInDate',
      headerName: 'Check In ',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className=''>
          {params.value ? formatDateToMonDDYYYY(params.value) : 'N/A'}
        </span>
      )
    },
    {
      field: 'checkOutDate',
      headerName: 'Check Out ',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span>
          {params.value ? formatDateToMonDDYYYY(params.value) : 'N/A'}
        </span>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 150,
      flex: 1,

      renderCell: (params: any) => (
        <span>
          {params?.value ? formatDateToDDMMYYYY(params?.value) : 'N/A'}
        </span>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span>
          {params?.value ? formatDateToDDMMYYYY(params?.value) : 'N/A'}
        </span>
      )
    }
  ];
  const uniqueRooms = [
    ...new Map(
      tenantList.map((tenant) => [
        `${tenant.rooms.roomNo}-${tenant.rooms.id}`, // Use roomNo and id as a unique key
        { roomNo: tenant.rooms.roomNo, id: tenant.rooms.id }
      ])
    ).values()
  ];

  return (
    <>
      <HeaderButton
        title='Tenants List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/tenant/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-2 grid grid-cols-2 gap-2 md:grid-cols-6'>
        <SelectComboBox
          options={monthOptions}
          value={selectedMonth}
          onChange={(e: string | null) => setSelectedMonth(e || 'this_month')}
        />
        <Button variant='outline' onClick={() => setSelectedMonth('')}>
          Clear Month
        </Button>
        <SelectComboBox
          options={uniqueRooms.map((room) => ({
            label: room.roomNo,
            value: room.id.toString()
          }))}
          value={selectedRoom}
          onChange={(e: string | null) => setSelectedRoom(e || '')}
          placeholder='Select Room'
        />
        <Button variant='outline' onClick={() => setSelectedRoom('')}>
          Clear Room
        </Button>
      </div>

      <div className='mt-6'>
        <GridTable
          tableHeight='550px'
          columns={columns}
          rows={filteredTenantData ?? tenantList}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
      <Modal
        contentClassName='w-fit rounded-lg sm:w-full'
        isOpen={openTenantRemoveConfirmModal}
        title=''
        onClose={() => {
          setOpenTenantRemoveConfirmModal(false);
        }}
        description='Are you sure you want to remove this tenant?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveTenant();
              setOpenTenantRemoveConfirmModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setOpenTenantRemoveConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TenantList;
