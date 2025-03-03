'use client';
import GridTable from '@/components/ui/mui-grid-table/GridTable';
import React from 'react';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 }
];

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' },
  { id: 3, name: 'Sam Johnson', email: 'sam@example.com', role: 'Receptionist' }
];

const Beds = () => {
  return (
    <>
      <GridTable
        columns={columns}
        rows={rows}
        loading={false}
        rowHeight={70}
        showToolbar={true}
        hideFooter={false}
      />
    </>
  );
};

export default Beds;
