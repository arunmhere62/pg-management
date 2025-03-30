'use client';
import axiosService from '@/services/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';

interface IVisitorsListProps {
  id: number;
  pgLocationId: number;
  visitedRoomId: number;
  visitedBedId: number;
  visitorName: string;
  phoneNo: string;
  purpose: string;
  visitedDate: string;
  checkInTime: string;
  checkOutTime: string;
  createdAt: string;
  updatedAt: string;
  rooms: {
    roomNo: string;
  };
  beds: {
    bedNo: string;
  };
  roomNo?: string;
  bedNo?: string;
}
const VisitorsList = () => {
  const router = useRouter();
  const [visitorsList, setVisitorsList] = useState<IVisitorsListProps[]>([]);

  useEffect(() => {
    const getTenants = async () => {
      try {
        const res = await axiosService.get('api/visitors');

        if (res.data.data) {
          const formattedData = res.data.data.map((d: IVisitorsListProps) => {
            return {
              roomNo: d.rooms.roomNo,
              bedNo: d.beds.bedNo,
              ...d
            };
          });
          setVisitorsList(formattedData);
        }
      } catch (error) {
        throw new Error('Fetching the tenant list failed');
      }
    };
    getTenants();
  }, []);

  const columns = [
    { field: 'visitorName', headerName: 'Name', minWidth: 100, flex: 1 },
    { field: 'phoneNo', headerName: 'Phone No', minWidth: 100, flex: 1 },
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
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },
    // { field: 'purpose', headerName: 'Purpose', minWidth: 100, flex: 1 },
    { field: 'visitedDate', headerName: 'Visit Date', minWidth: 100, flex: 1 },
    {
      field: 'checkInTime',
      headerName: 'Check In Time',
      minWidth: 100,
      flex: 1
    },
    // { field: 'checkOutTime', headerName: 'Check Out Time', minWidth: 100, flex: 1 },
    { field: 'createdAt', headerName: 'Created At', minWidth: 100, flex: 1 },
    // { field: 'updatedAt', headerName: 'Updated At', minWidth: 100, flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <div className='ml-3 mt-3 flex gap-3'>
          <EditIcon
            onClick={() => {
              router.push(`/visitor/${params.row.id}`);
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
              router.push(`/visitor/details/${params.row.id}`);
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
        title='Tenants List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/visitor/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={visitorsList}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
    </>
  );
};

export default VisitorsList;
