'use client';
import axiosService from '@/services/utils/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { width } from '@mui/system';
import { cn } from '@/lib/utils';

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
  rooms: {
    id: number;
    roomId: string;
    roomNo: string;
  };
  beds: {
    id: string;
    bedNo: string;
  };
}
const TenantList = () => {
  const router = useRouter();
  const [tenantList, setTenantList] = useState<ITenantListProps[]>([]);
  useEffect(() => {
    const getTenants = async () => {
      try {
        const res = await axiosService.get('api/tenant');
        const formattedRes = res.data.data.map((d: ITenantListProps) => ({
          roomNo: d.rooms.roomNo,
          bedNo: d.beds.bedNo,
          ...d
        }));
        if (res.data) {
          setTenantList(formattedRes);
        }
      } catch (error) {
        throw new Error('Fetching the tenant list failed');
      }
    };
    getTenants();
  }, []);

  const columns = [
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
      field: 'checkInDate',
      headerName: 'Check In Date',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'checkOutDate',
      headerName: 'Check Out Date',
      minWidth: 120,
      flex: 1
    },
    { field: 'createdAt', headerName: 'Created At', minWidth: 130, flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', minWidth: 130, flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <div className='ml-3 mt-3 flex gap-3'>
          <EditIcon
            onClick={() => {
              router.push(`/tenant/${params.row.id}`);
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
              router.push(`/tenant/details/${params.row.id}`);
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
    </>
  );
};

export default TenantList;
