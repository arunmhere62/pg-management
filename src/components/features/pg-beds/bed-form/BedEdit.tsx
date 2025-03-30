'use client';
import React, { useEffect, useState } from 'react';
import MainRoomForm from '.';
import { toast } from 'sonner';
import { fetchBedById } from '@/services/utils/api/bed-api';

interface IBedEditFormProps {
  bedNo: string;
  roomNo: string;
  images: string[];
  status: string;
}
const BedEdit = ({ id }: { id: string }) => {
  const [bedData, setBedData] = useState<IBedEditFormProps>();
  useEffect(() => {
    const getBed = async () => {
      try {
        const res = await fetchBedById(id);
        const formattedRes = {
          bedNo: res.data.bedNo.replace(/^BED/, ''),
          roomNo: String(res.data.roomId),
          images: res.data.images,
          status: res.data.status
        };
        setBedData(formattedRes);
      } catch (error) {
        toast.error('Error fetching bed data');
      }
    };
    if (id) {
      getBed();
    }
  }, [id]);
  return (
    <div>
      {bedData && <MainRoomForm mode='edit' initialData={bedData} id={id} />}
    </div>
  );
};

export default BedEdit;
