import HeaderButton from '@/components/ui/large/HeaderButton';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import axiosService from '@/services/utils/axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IPgListProps {
  id: number;
  userId: number;
  address: string;
  cityName: string;
  createdAt: string;
  locationName: string;
  pincode: number;
  stateName: string;
  status: string;
  updatedAt: string;
  images: string[];
}

const columns = [
  { field: 'id', headerName: 'S No', width: 50 },
  {
    field: 'images',
    headerName: 'Profile',
    flex: 1,
    renderCell: (params: any) => {
      const firstImage = params.value?.length > 0 ? params.value[0] : null;
      return firstImage ? (
        <div className='mt-2.5'>
          <Image
            src={firstImage}
            alt='Profile'
            width={50}
            height={50}
            className='w-[60px] rounded-md object-cover'
          />
        </div>
      ) : (
        <span>No Image</span>
      );
    }
  },
  { field: 'address', headerName: 'Address', flex: 1 },
  { field: 'cityName', headerName: 'City', flex: 1 },
  { field: 'stateName', headerName: 'State', flex: 1 },
  { field: 'locationName', headerName: 'Location Name', flex: 1 },
  { field: 'pincode', headerName: 'Pincode', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'updatedAt', headerName: 'Updated At', flex: 1 }
];
const PgList = () => {
  const router = useRouter();
  const [pgListData, setPgListData] = useState<IPgListProps[]>([]);
  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await axiosService.get<IPgListProps[]>('/api/pg');
        setPgListData(res.data);
      } catch (error) {
        throw error;
      }
    };
    getPgList();
  }, []);

  console.log('pgListData', pgListData);
  return (
    <>
      <HeaderButton
        title='PG List'
        buttons={[
          {
            label: 'Create New',
            onClick: () => {
              router.push('/pg-location/new');
            },
            variant: 'default'
          }
        ]}
      />
      <div className='mt-6'>
        <GridTable
          columns={columns}
          rows={pgListData}
          loading={false}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
    </>
  );
};

export default PgList;
