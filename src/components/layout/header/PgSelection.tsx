import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { setPgLocation } from '@/store/slices/pgLocationSlice';
import { useDispatch, useSelector } from '@/store';
import { fetchPgLocationsList } from '@/services/utils/api/pg-location-api';
import Cookies from 'js-cookie'; // For cookie handling
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface IPgListProps {
  id: number;
  locationName: string;
}

const PgSelection = () => {
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const [selectedPg, setSelectedPg] = useState<string | undefined>();
  const [pgListData, setPgListData] = useState<IPgListProps[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await fetchPgLocationsList();
        setPgListData(res.data);

        // Check if pgLocationId exists in cookies, if yes, use it
        const cookiePgLocationId = Cookies.get('pgLocationId');

        // If no PG location is selected in the state or cookies, select the first PG in the list
        if (cookiePgLocationId) {
          const pgFromCookie = res.data.find(
            (pg: any) => pg.id.toString() === cookiePgLocationId
          );
          if (pgFromCookie) {
            dispatch(
              setPgLocation({
                id: pgFromCookie.id,
                name: pgFromCookie.locationName
              })
            );
            setSelectedPg(pgFromCookie.id.toString());
          }
        } else if (res.data.length > 0 && !pgLocationId) {
          // If no PG is selected and cookie is not present, default to the first PG
          const firstPg = res.data[0];
          dispatch(
            setPgLocation({ id: firstPg.id, name: firstPg.locationName })
          );
          setSelectedPg(firstPg.id.toString());
          Cookies.set('pgLocationId', firstPg.id.toString(), { expires: 30 }); // Set cookie for 30 days
        }
      } catch (error) {
        console.error('Error fetching PG locations', error);
        toast.error('Error fetching PG locations');
      }
    };
    getPgList();
  }, [dispatch, pgLocationId]);

  useEffect(() => {
    if (pgLocationId) {
      setSelectedPg(pgLocationId.toString());
    }
  }, [pgLocationId]);

  const handlePgChange = (value: string) => {
    setSelectedPg(value);
    const selectedPgData = pgListData.find((pg) => pg.id.toString() === value);
    if (selectedPgData) {
      dispatch(
        setPgLocation({
          id: selectedPgData.id,
          name: selectedPgData.locationName
        })
      );
      location.reload();
    }
  };

  return (
    <Select onValueChange={handlePgChange} value={selectedPg}>
      <SelectTrigger>
        <SelectValue placeholder='Select PG' />
      </SelectTrigger>
      <SelectContent>
        {pgListData.map((pg) => (
          <SelectItem key={pg.id} value={pg.id.toString()}>
            {pg.locationName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PgSelection;
