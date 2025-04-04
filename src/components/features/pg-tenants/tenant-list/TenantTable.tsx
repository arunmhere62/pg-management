'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, Eye, MessageCircle, Trash2Icon } from 'lucide-react';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import {
  fetchTenantsList,
  removeTenant
} from '@/services/utils/api/tenant-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';

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
  isPending: boolean;
  rooms: IRoomProps;
  beds: IBedProps;
  tenantPayments: ITenantPaymentProps[];
}
const TenantList = () => {
  const router = useRouter();
  const [tenantList, setTenantList] = useState<ITenantListProps[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  const [openTenantRemoveConfirmModal, setOpenTenantRemoveConfirmModal] =
    useState<boolean>(false);
  const getTenants = async () => {
    try {
      const res = await fetchTenantsList();
      const formattedRes = res.data.map((d: ITenantListProps) => {
        const lastPayment = d.tenantPayments.at(-1);
        return {
          roomNo: d.rooms.roomNo,
          bedNo: d.beds.bedNo,
          startDate: lastPayment?.startDate
            ? formatDateToDDMMYYYY(lastPayment?.startDate)
            : 'N/A',
          endDate: lastPayment?.endDate
            ? formatDateToDDMMYYYY(lastPayment?.endDate)
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

  const handleRemoveTenant = async () => {
    try {
      if (selectedTenantId) {
        const res = await removeTenant(String(selectedTenantId));
        if (res.status === 200) {
          toast.success('Tenant removed bed is free now!');
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
                    onClick={() => alert(JSON.stringify(params.row))}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
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
                    console.log('hello');
                    router.push(`/payment/rent/new/${params.row.id}`);
                  }}
                >
                  Add Rent
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    console.log('hello');
                    router.push(`/payment/advance/new/${params.row.id}`);
                  }}
                >
                  Add Advance
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    console.log('hello');
                    router.push(`/payment/refund/new/${params.row.id}`);
                  }}
                >
                  Add Refund
                </Button>
                <Button variant='outline' onClick={sendWhatsAppMessage}>
                  <MessageCircle className='mr-2 w-4' /> Whats App
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => {
                    setSelectedTenantId(params.row.id);
                    setOpenTenantRemoveConfirmModal(true);
                  }}
                >
                  <Trash2Icon className='mr-2 w-4' /> Remove
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
    { field: 'name', headerName: 'Name', minWidth: 140, flex: 1 },
    // { field: 'email', headerName: 'Email', minWidth: 140, flex: 1 },
    {
      field: 'roomNo',
      headerName: 'Room No',
      minWidth: 130,
      flex: 1,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      minWidth: 130,
      flex: 1,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },

    { field: 'phoneNo', headerName: 'Phone No', minWidth: 130, flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
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
      field: 'isPending',
      headerName: 'Payment Status',
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => (
        <span className={cn(!params.value ? 'activeBadge' : 'inactiveBadge')}>
          {!params.value ? 'Paid' : 'Pending'}
        </span>
      )
    },
    {
      field: 'startDate',
      headerName: 'Start Date ',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'checkInDate',
      headerName: 'Check In ',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'checkOutDate',
      headerName: 'Check Out ',
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => (
        <span>{params.value ? formatDateToDDMMYYYY(params.value) : 'N/A'}</span>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 130,
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
      minWidth: 130,
      flex: 1,
      renderCell: (params: any) => (
        <span>
          {params?.value ? formatDateToDDMMYYYY(params?.value) : 'N/A'}
        </span>
      )
    }
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
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={tenantList}
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
