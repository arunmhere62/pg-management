import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PgDetails from '../pg-details/PgDetails';

export interface IPgListProps {
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

const PgList = () => {
  const router = useRouter();
  const [pgListData, setPgListData] = useState<IPgListProps[]>([]);
  const [pgDetails, setPgDetails] = useState<IPgListProps>();
  const [openPgDetails, setOpenPgDetails] = useState<boolean>(false);
  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await axiosService.get<IPgListProps[]>('/api/pg');
        const formattedRes = res.data.map((data: IPgListProps) => ({
          id: data.id,
          userId: data.userId,
          address: data.address,
          cityName: data.cityName,
          stateName: data.stateName,
          locationName: data.locationName,
          pincode: data.pincode,
          images: data?.images,
          updatedAt: new Date(data.updatedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }),
          createdAt: new Date(data.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }),
          status: data.status
        }));
        setPgListData(formattedRes);
      } catch (error) {
        throw error;
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
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'cityName', headerName: 'City', flex: 1 },
    { field: 'stateName', headerName: 'State', flex: 1 },
    { field: 'pincode', headerName: 'Pincode', flex: 1 },
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
              router.push(`/pg-location/${params.row.id}`);
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
              const pgDetailsData = pgListData.find(
                (pg) => pg.id === params.row.id
              );
              if (pgDetailsData) {
                setOpenPgDetails(true);
                setPgDetails(pgDetailsData);
              }
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
      <div className='sm:p[p-0] p-10'>
        <Modal
          contentClassName='w-[350px] rounded-lg sm:w-full'
          isOpen={openPgDetails}
          title='PG Details'
          onClose={() => {
            setOpenPgDetails(false);
          }}
          description=''
        >
          {pgDetails ? <PgDetails pgDetails={pgDetails || {}} /> : 'Not found'}
        </Modal>
      </div>
    </>
  );
};

export default PgList;
