import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';
import { setPgLocation } from '@/store/slices/pgLocationSlice';
import { useDispatch } from '@/store';
import { useSelector } from '@/store';
interface IPgListProps {
  id: number;
  locationName: string;
}
const PgSelection = () => {
  const { pgLocationId, pgLocationName } = useSelector(
    (state) => state.pgLocation
  );
  const [selectedPg, setSelectedPg] = useState<string | undefined>();
  const [pgListData, setPgListData] = useState<IPgListProps[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await axiosService.get<IPgListProps[]>('/api/pg');
        setPgListData(res.data);
      } catch (error) {}
    };
    getPgList();
  }, []);

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
    }
  };

  return (
    <Select onValueChange={handlePgChange} value={selectedPg}>
      <SelectTrigger>
        <SelectValue placeholder='Select PG' />
      </SelectTrigger>
      <SelectContent>
        {pgListData?.map((pg) => (
          <SelectItem key={pg.id} value={pg?.id?.toString()}>
            {pg?.locationName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PgSelection;
