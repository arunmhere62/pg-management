'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import MainRoomForm from '.';

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
        const res = await axiosService.get(`/api/bed/${id}`);
        const formattedRes = {
          bedNo: res.data.bedNo,
          roomNo: String(res.data.roomId),
          images: res.data.images,
          status: res.data.status
        };
        setBedData(formattedRes);
      } catch (error) {
        console.error('Error fetching bed data:', error);
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
