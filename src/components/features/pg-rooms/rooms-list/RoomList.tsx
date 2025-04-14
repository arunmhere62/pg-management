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
import MainBedForm from '../../pg-beds/bed-form';
import { fetchRoomsList } from '@/services/utils/api/rooms-api';
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
export interface IRoomListProps {
  id: number;
  roomId: number;
  pgId: number;
  roomNo: string;
  bedCount: string;
  status: string;
  rentPrice: string;
  createdAt: string;
  locationNam?: string;
  totalBeds?: number;
  pgLocations?: {
    locationName: string;
  };
  totalAmount?: number;
  updatedAt: string;
  images: string[];
}

const RoomsList = () => {
  const router = useRouter();
  const [roomsList, setRoomsList] = useState<IRoomListProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [openBedModal, setOpenBedModal] = useState<boolean>(false);
  useSetBreadcrumbs([{ title: 'Rooms', link: '/' }]);
  useEffect(() => {
    const getPgList = async () => {
      setLoading(true);
      try {
        const res = await fetchRoomsList();
        if (res.data) {
          const resModel = res.data.map((data: IRoomListProps) => ({
            id: data.id,
            roomId: data.roomId,
            roomNo: data.roomNo,
            pgId: data.pgId,
            bedCount: data.bedCount,
            status: data.status,
            rentPrice: data.rentPrice,
            locationName: data.pgLocations?.locationName,
            images: data.images,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            totalBeds: data.totalBeds,
            totalAmount: data.totalAmount
          }));
          setRoomsList(resModel);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          'Something went wrong.';

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    getPgList();
  }, []);

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
                      router.push(`/room/${params.row.id}`);
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
                      router.push(`/room/details/${params.row.id}`)
                    }
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                </div>
                <Button
                  variant='outline'
                  onClick={() => {
                    setOpenBedModal(true);
                  }}
                >
                  Add Bed
                </Button>
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
    //           width={20}
    //           height={20}
    //           className='h-[40px] w-[60px] rounded-md object-cover'
    //         />
    //       </div>
    //     ) : (
    //       <span>No Image</span>
    //     );
    //   }
    // },

    {
      field: 'locationName',
      headerName: 'Location Name',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedInfo',
      headerName: 'Total Bed',
      minWidth: 100,
      renderCell: (params: any) => (
        <span className='rounded-lg bg-[#ffcd94] px-2 py-1 font-bold text-[#000000]'>
          {params.row.totalBeds}
        </span>
      )
    },
    {
      field: 'rentPrice',
      headerName: 'Bed Price',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className='activeBadge'>₹{params.value}</span>
      )
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      minWidth: 160,
      flex: 1,
      renderCell: (params: any) => (
        <span className='activeBadge'>₹{params.value}</span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'AVAILABLE' ? 'activeBadge' : 'inactiveBadge'
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
        title='Rooms List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/room/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={roomsList || []}
          loading={loading}
          rowHeight={90}
          showToolbar={true}
          hideFooter={false}
        />
        <Modal
          contentClassName='w-[350px] rounded-lg sm:w-full'
          isOpen={openBedModal}
          title=''
          onClose={() => {
            setOpenBedModal(false);
          }}
          description=''
        >
          <MainBedForm mode='create' />
        </Modal>
      </div>
    </>
  );
};

export default RoomsList;
