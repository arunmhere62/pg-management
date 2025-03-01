import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';

const pgData = [
  { id: '1', name: 'Yube2' },
  { id: '2', name: 'Alpha League' }
];
const PgSelection = () => {
  const [selectedPg, setSelectedPg] = useState<string | undefined>();

  useEffect(() => {
    const getPgList = async () => {
      try {
        const res = await axiosService.get('/api/pg');
        console.log(res);
      } catch (error) {}
    };
    getPgList();
  });
  return (
    <Select onValueChange={(value) => setSelectedPg(value)} value={selectedPg}>
      <SelectTrigger>
        <SelectValue placeholder='Select PG' />
      </SelectTrigger>
      <SelectContent>
        {/* @ts-ignore  */}
        {pgData.map((pg) => (
          <SelectItem key={pg.id} value={pg.id}>
            {pg.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PgSelection;
