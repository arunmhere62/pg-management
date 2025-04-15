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
import { toast } from 'sonner';

interface IPgListProps {
  id: number;
  locationName: string;
}

const PgSelection = () => {
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const [selectedPg, setSelectedPg] = useState<string | undefined>();
  const [pgListData, setPgListData] = useState<IPgListProps[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await fetchPgLocationsList();
        setPgListData(res.data);
        // Automatically select the first PG if no PG is selected
        if (res.data.length > 0 && !pgLocationId) {
          const firstPg = res.data[0];
          dispatch(
            setPgLocation({ id: firstPg.id, name: firstPg.locationName })
          );

          setSelectedPg(firstPg.id.toString());
          window.location.reload();
        }
      } catch (error) {
        console.error('Error fetching PG locations', error);
        // toast.error('Error fetching PG locations');
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
      window.location.reload();
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
