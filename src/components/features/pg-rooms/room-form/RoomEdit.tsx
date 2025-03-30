'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import MainRoomForm from '.';
import { getRoomById } from '@/services/utils/api/rooms-api';
import { toast } from 'sonner';

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
        const res = await getRoomById(String(id));
        const formattedRes = {
          images: res.data.images,
          roomNo: res.data.roomNo?.replace(/^RM/, ''),
          bedCount: res.data.bedCount.toString(),
          rentPrice: res.data.rentPrice.toString(),
          status: res.data.status
        };
        if (formattedRes) {
          setRoomData(formattedRes);
        }
      } catch (error) {
        toast.error('Error fetching room data:');
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
