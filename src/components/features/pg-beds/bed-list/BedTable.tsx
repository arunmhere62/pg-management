import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { fetchBedsList } from '@/services/utils/api/bed-api';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IBedsProps {
  id: number;
  bedNo: string;
  roomId: number;
  pgId: number;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  roomNo: string;
  name: string;
}

const BedsList = () => {
  const router = useRouter();
  const [bedsData, setBedsData] = useState<IBedsProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBeds = async () => {
      setLoading(true);

      try {
        const res = await fetchBedsList();
        if (res.data) {
          const formattedRes = res.data.map((data: any) => ({
            id: data.id,
            bedNo: data.bedNo,
            roomId: data.roomId,
            pgId: data.pgId,
            status: data.status,
            images: data.images,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            roomNo: data.rooms.roomNo,
            name: data?.tenants[0]?.name ?? 'N/A'
          }));
          setBedsData(formattedRes);
        }
      } catch (error) {
        toast.error('fetching failed');
      } finally {
        setLoading(false);
      }
    };
    getBeds();
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
    // { field: 'tenantName', headerName: 'Name', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },

    {
      field: 'roomNo',
      headerName: 'Room No',
      flex: 1,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      flex: 1,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },

    {
      field: 'status',
      headerName: 'Payment Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'VACANT'
              ? 'bg-[#ebffe2] text-[#328a17]'
              : 'bg-[#fa7171] text-white',
            'rounded-lg px-2 py-1 text-[13px] font-bold'
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
      width: 150,
      renderCell: (params: any) => (
        <div className='ml-3 mt-3 flex gap-3'>
          <EditIcon
            onClick={() => {
              router.push(`/bed/${params.row.id}`);
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
              router.push(`/bed/details/${params.row.id}`);
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
        title='Beds List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/bed/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={bedsData}
          loading={loading}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
    </>
  );
};

export default BedsList;
