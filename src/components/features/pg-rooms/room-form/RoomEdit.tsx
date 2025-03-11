'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import MainRoomForm from '.';

interface IRoomEditFormProps {
  roomNo: string;
  bedCount: string;
  rentPrice: string;
  status: string;
  images: string[];
}
const RoomEdit = ({ id }: { id: string }) => {
  const [roomData, setRoomData] = useState<IRoomEditFormProps>();
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get(`/api/room/${id}`);
        const formattedRes = {
          images: res.data.images,
          roomNo: res.data.roomNo,
          bedCount: res.data.bedCount.toString(),
          rentPrice: res.data.rentPrice.toString(),
          status: res.data.status
        };
        if (formattedRes) {
          setRoomData(formattedRes);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);

  return (
    <div>
      {roomData && <MainRoomForm mode='edit' initialData={roomData} id={id} />}
    </div>
  );
};

export default RoomEdit;
