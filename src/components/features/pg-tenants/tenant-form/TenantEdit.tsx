import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';
import MainTenantForm from '.';

interface ITenantEditFormProps {
  status: string;
  images: string[];
}
const TenantEdit = ({ id }: { id: string }) => {
  const [tenantData, setTenantData] = useState<ITenantEditFormProps>();
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get(`/api/tenant/${id}`);
        const formattedRes = {
          tenantName: res.data.name,
          phoneNo: res.data.phoneNo,
          email: res.data.email,
          roomId: String(res.data.roomId),
          bedId: String(res.data.bedId),
          checkInDate: res.data.checkInDate,
          checkOutDate: res.data.checkOutDate,
          status: res.data.status,
          images: res.data.images,
          proofDocuments: res.data.proofDocuments
        };
        if (formattedRes) {
          setTenantData(formattedRes);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);
  return <MainTenantForm id={id} mode='edit' initialData={tenantData} />;
};

export default TenantEdit;
