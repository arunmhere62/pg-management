'use client';
import { Button } from '@/components/ui/button';
import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MainBedForm from '../../pg-beds/bed-form';

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
  updatedAt: string;
  images: string[];
}

const RoomsList = () => {
  const router = useRouter();
  const [roomsList, setRoomsList] = useState<IRoomListProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [openBedModal, setOpenBedModal] = useState<boolean>(false);

  useEffect(() => {
    const getPgList = async () => {
      setLoading(true);
      try {
        const res = await axiosService.get<IRoomListProps[]>('/api/room');
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
            totalBeds: data.totalBeds
          }));
          setRoomsList(resModel);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPgList();
  }, []);

  const columns = [
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

    { field: 'locationName', headerName: 'Location Name', flex: 1 },
    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 1,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedInfo',
      headerName: 'Created Bed / Total Bed',
      minWidth: 200,
      renderCell: (params: any) => (
        <span className='rounded-lg bg-[#ffcd94] px-2 py-1 font-bold text-[#000000]'>
          {params.row.totalBeds}/ {params.row.bedCount}
        </span>
      )
    },
    {
      field: 'rentPrice',
      headerName: 'Price',
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => (
        <span className='rounded-lg bg-[#ebffe2] px-2 py-1 font-bold text-[#328a17]'>
          ₹{params.value}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => (
        <span
          className={cn(
            'rounded-lg bg-[#ebffe2] px-2 py-1 font-bold text-[#328a17]',
            params.value === 'AVAILABLE'
              ? 'bg-[#ebffe2] text-[#328a17]'
              : 'bg-[#ffdede] text-[#c22121]'
          )}
        >
          {params.value}
        </span>
      )
    },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: any) => (
        <div className='ml-3 mt-3 flex gap-3'>
          <EditIcon
            onClick={() => {
              router.push(`/room/${params.row.id}`);
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
              router.push(`/room/details/${params.row.id}`);
            }}
            className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]'
          />
          <Button
            onClick={() => {
              setOpenBedModal(true);
            }}
            variant='outline'
            className=''
            // disabled={isPending}
          >
            Add Bed
          </Button>
        </div>
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
