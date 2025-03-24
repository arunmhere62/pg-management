import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';
import MainVisitorsForm from '.';

interface IVisitorsEditFormProps {
  visitorName: string;
  phoneNo: string;
  purpose: string;
  visitedDate: string;
  checkInTime: string;
  checkOutTime?: string;
  roomId: string;
  bedId: string;
  status?: string;
  images?: string[];
}
const VisitorsEdit = ({ id }: { id: string }) => {
  const [visitorsData, setVisitorsData] = useState<IVisitorsEditFormProps>();
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get(`/api/visitors/${id}`);
        console.log('res data', res);
        if (res.data.data) {
          const formattedRes = {
            visitorName: res.data.data.visitorName,
            phoneNo: res.data.data.phoneNo,
            purpose: res.data.data.purpose,
            visitedDate: res.data.data.visitedDate,
            checkInTime: res.data.data.checkInTime ?? '',
            checkOutTime: res.data.data.checkOutTime ?? '',
            roomId: String(res.data.data.visitedRoomId),
            bedId: String(res.data.data.visitedBedId)
          };
          setVisitorsData(formattedRes);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);
  console.log('visitorsData', visitorsData);

  return <MainVisitorsForm id={id} mode='edit' initialData={visitorsData} />;
};

export default VisitorsEdit;
