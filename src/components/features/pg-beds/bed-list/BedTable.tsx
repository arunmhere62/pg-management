import HeaderButton from '@/components/ui/large/HeaderButton';
import { Modal } from '@/components/ui/modal';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import { cn } from '@/lib/utils';
import { deleteBed, fetchBedsList } from '@/services/utils/api/bed-api';
import axiosService from '@/services/utils/axios';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { IBedProps, IOptionTypeProps } from '@/services/types/common-types';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
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
  const [filteredBedsData, setFilteredBedsData] = useState<IBedsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomSelectionList, setRoomSelectionList] = useState<
    IOptionTypeProps[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [openBedRemoveConfirmModal, setOpenBedRemoveConfirmModal] =
    useState<boolean>(false);
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null);

  useSetBreadcrumbs([{ title: 'Bed', link: '/bed' }]);
  useEffect(() => {
    if (selectedRoom) {
      const filteredBedsList = bedsData.filter(
        (bed: IBedProps) => Number(bed.roomId) === Number(selectedRoom)
      );
      setFilteredBedsData(filteredBedsList);
    }
  }, [selectedRoom, bedsData]);
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
        const roomSelectionList = Array.from(
          new Map<string, IOptionTypeProps>(
            res.data.map((data: any) => [
              data.roomId,
              { value: String(data.roomId), label: data.rooms.roomNo }
            ])
          ).values()
        );
        setRoomSelectionList(roomSelectionList);
        setBedsData(formattedRes);
      }
    } catch (error) {
      toast.error('fetching failed');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBeds();
  }, []);

  const handleRemoveBed = async () => {
    try {
      if (selectedBedId) {
        const res = await deleteBed(String(selectedBedId));
        if (res.status === 200) {
          toast.success('Bed removed successfully !');
          getBeds();
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
      pinnable: true,
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
                      router.push(`/bed/${params.row.id}`);
                    }}
                  >
                    <EditIcon className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedBedId(params.row.id);
                      setOpenBedRemoveConfirmModal(true);
                    }}
                  >
                    <Trash2 className='w-4 cursor-pointer text-[red] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => router.push(`/bed/details/${params.row.id}`)}
                  >
                    <Eye className='w-4 cursor-pointer text-[#656565] hover:text-[#000] dark:hover:text-[#fff]' />
                  </Button>
                </div>
                {params.row.status !== 'OCCUPIED' && (
                  <Button
                    variant='outline'
                    onClick={() => {
                      router.push(
                        `tenant/new/${params.row.roomId ?? ''}/${params.row.id ?? ''}`
                      );
                    }}
                  >
                    Create Tenant
                  </Button>
                )}
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
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },

    {
      field: 'roomNo',
      headerName: 'Room No',
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <span className='roomTableBadge'>{params.value}</span>
      )
    },
    {
      field: 'bedNo',
      headerName: 'Bed No',
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <span className='bedTableBadge'>{params.value}</span>
      )
    },

    {
      field: 'status',
      headerName: 'Bed Status',
      minWidth: 150,
      renderCell: (params: any) => (
        <span
          className={cn(
            params.value === 'VACANT' ? 'activeBadge' : 'inactiveBadge',
            'rounded-lg px-2 py-1 text-[13px] font-bold'
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
      <div className='mt-3 flex gap-3'>
        <div className='w-[200px]'>
          <SelectComboBox
            options={roomSelectionList}
            placeholder='Select a Room'
            value={selectedRoom || ''}
            onChange={(e: string | null) => {
              setSelectedRoom(e);
            }}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => {
            setFilteredBedsData([]);
            setSelectedRoom(null);
          }}
        >
          clear
        </Button>
      </div>
      <div className='mt-2'>
        <GridTable
          tableHeight='550px'
          columns={columns}
          rows={filteredBedsData.length > 0 ? filteredBedsData : bedsData}
          loading={loading}
          rowHeight={80}
          showToolbar={true}
          hideFooter={false}
        />
      </div>
      <Modal
        contentClassName='w-[95%] rounded-lg sm:w-full'
        isOpen={openBedRemoveConfirmModal}
        title=''
        onClose={() => {
          setOpenBedRemoveConfirmModal(false);
        }}
        description='Are you sure you want to remove this Bed?'
      >
        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            variant='destructive'
            onClick={() => {
              handleRemoveBed();
              setOpenBedRemoveConfirmModal(false);
            }}
          >
            Remove
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setOpenBedRemoveConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BedsList;
