import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import axiosService from '@/services/utils/axios';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PgDetails from '../pg-details/PgDetails';
import { fetchPgLocationsList } from '@/services/utils/api/pg-location-api';
import { TableDynamicDropdown } from '@/components/ui/large/TableDynamicDropdown';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

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
  useSetBreadcrumbs([{ title: 'Pg Location', link: '/pg-location' }]);
  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await fetchPgLocationsList();
        const formattedRes = res.data.map((data: IPgListProps) => ({
          id: data.id,
          userId: data.userId,
          address: data.address,
          cityName: data.cityName,
          stateName: data.stateName,
          locationName: data.locationName,
          pincode: data.pincode,
          images: data?.images,
          updatedAt: formatDateToDDMMYYYY(data.updatedAt ?? ''),
          createdAt: formatDateToDDMMYYYY(data.createdAt ?? ''),
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
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: any) => (
        <TableDynamicDropdown
          actions={[
            {
              label: 'Edit',
              icon: (
                <EditIcon className='w-4 text-[#656565] hover:text-black dark:hover:text-white' />
              ),
              onClick: () => router.push(`/pg-location/${params.row.id}`)
            },
            {
              label: 'View',
              icon: (
                <Eye className='w-4 text-[#656565] hover:text-black dark:hover:text-white' />
              ),
              onClick: () => {
                const pgDetailsData = pgListData.find(
                  (pg) => pg.id === params.row.id
                );
                if (pgDetailsData) {
                  setOpenPgDetails(true);
                  setPgDetails(pgDetailsData);
                }
              }
            }
          ]}
        />

        // </div>
      )
    },
    {
      field: 'images',
      headerName: 'Profile',
      minWidth: 150,
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
    {
      field: 'locationName',
      headerName: 'Location Name',
      flex: 1,
      minWidth: 150
    },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 150 },
    { field: 'cityName', headerName: 'City', flex: 1, minWidth: 150 },
    { field: 'stateName', headerName: 'State', flex: 1, minWidth: 150 },
    { field: 'pincode', headerName: 'Pincode', flex: 1, minWidth: 150 },
    { field: 'createdAt', headerName: 'Created At', flex: 1, minWidth: 150 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1, minWidth: 150 }
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
          tableHeight='560px'
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
          contentClassName='w-[95%] rounded-lg sm:w-full'
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
