'use client';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
  pgLocations?: {
    locationName: string;
  };
  updatedAt: string;
  images: string[];
}

const RoomsList = () => {
  const router = useRouter();
  const [roomsList, setRoomsList] = useState<IRoomListProps[]>([]);
  useEffect(() => {
    const getPgList = async () => {
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
            updatedAt: data.updatedAt
          }));
          setRoomsList(resModel);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPgList();
  }, []);

  const columns = [
    // { field: 'id', headerName: 'S No', width: 50 },
    {
      field: 'images',
      headerName: 'Profile',
      width: 100,
      renderCell: (params: any) => {
        const image = params?.value?.[0] || [];
        return image ? (
          <div className='mt-2.5'>
            <Image
              src={image}
              alt='Profile'
              width={50}
              height={50}
              className='h-[40px] w-[60px] rounded-md object-cover'
            />
          </div>
        ) : (
          <span>No Image</span>
        );
      }
    },
    { field: 'locationName', headerName: 'Location Name', flex: 1 },
    { field: 'roomNo', headerName: 'Room No', flex: 1 },
    { field: 'bedCount', headerName: 'No of Beds', flex: 1 },
    { field: 'rentPrice', headerName: 'Price', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
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
          rows={roomsList}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
      <div className='sm:p[p-0] p-10'></div>
    </>
  );
};

export default RoomsList;
