'use client';
import MainPgForm from '@/components/features/pg-location/pg-form';
import axiosService from '@/services/utils/axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IpgLocationDataProps {
  images: string[];
  locationName: string;
  cityId: string;
  stateId: string;
  pincode: string;
  address: string;
}
const Page = () => {
  const [pgLocationData, setPgLocationData] = useState({});
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const getPgLocation = async () => {
      try {
        const res = await axiosService.get(`/api/pg/${params.id}`);
        if (res.status === 200) {
          const data: IpgLocationDataProps = res.data;
          const pgLocation = {
            images: data.images,
            locationName: data.locationName,
            city: data.cityId.toString(),
            state: data.stateId.toString(),
            pincode: data.pincode,
            address: data.address
          };
          setPgLocationData(pgLocation);
        }
      } catch (error) {
        console.error('Failed to fetch PG location data:', error);
      }
    };
    getPgLocation();
  }, [params.id]);

  if (!pgLocationData) return <div>Loading...</div>;

  return <MainPgForm id={params.id} mode='edit' initialData={pgLocationData} />;
};

export default Page;
