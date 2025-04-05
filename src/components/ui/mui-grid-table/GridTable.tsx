'use client';
import * as React from 'react';
import Cookies from 'js-cookie';
import {
  DataGrid,
  useGridApiRef,
  GridColDef,
  GridSortDirection,
  GridToolbar
} from '@mui/x-data-grid';
import Skeleton from '@mui/material/Skeleton';

interface GridTableProps {
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  rowHeight?: number;
  hideFooter?: boolean;
  showToolbar?: boolean;
  tableHeight?: string;
}

const GridTable: React.FC<GridTableProps> = ({
  showToolbar,
  hideFooter,
  loading,
  columns,
  rows,
  rowHeight,
  tableHeight
}) => {
  const apiRef = useGridApiRef();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = React.useState<number>(380); // Default width
  const [theme, setTheme] = React.useState<string>('light'); // Store theme state

  // ✅ Read theme from localStorage on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const handleResize = () => {
      if (containerRef.current) {
        setTableWidth(containerRef.current.clientWidth); // ✅ Capture div's width
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize); // Listen for window resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // ✅ Listen for theme changes in localStorage & detect user interaction
  React.useEffect(() => {
    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem('theme') || 'light';
      setTheme(updatedTheme);
    };

    const handleUserInteraction = () => {
      handleThemeChange(); // ✅ Fetch latest theme on any interaction
    };

    // ✅ Listen to multiple user interactions
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Create skeleton rows when loading
  const skeletonRows = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    ...columns.reduce((acc, col) => {
      acc[col.field] = (
        <>
          <Skeleton variant='text' width='100%' />
        </>
      );
      return acc;
    }, {} as any)
  }));

  return (
    <div ref={containerRef} className='flex w-full justify-center'>
      <div
        style={{
          padding: '',
          width: `${tableWidth}px`,
          maxWidth: '100%',
          height: `${tableHeight ?? '600px'}`
        }}
      >
        <DataGrid
          onCellKeyDown={(params, events) => {
            if (events.key === ' ') {
              events.stopPropagation();
            } else {
              events.stopPropagation();
            }
          }}
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton'
            },
            toolbar: {
              showQuickFilter: true
            }
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          hideFooter={hideFooter}
          pageSizeOptions={[10, 25, 50]}
          editMode='cell'
          sortingOrder={['asc', 'desc', null] as GridSortDirection[]}
          loading={loading}
          rowHeight={rowHeight}
          apiRef={apiRef}
          density='compact'
          rows={loading ? skeletonRows : rows}
          columns={columns.map((column) => ({
            ...column
          }))}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 }
            }
          }}
          slots={{
            toolbar: showToolbar ? GridToolbar : GridToolbar
          }}
          style={{
            borderRadius: '10px',
            padding: '10px',
            border: theme === 'dark' ? '1px solid #1f2937' : ''
          }}
          sx={{
            //  overflowX: 'scroll',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme === 'dark' ? '#1E293B' : '#f5f5f5',
              color: theme === 'dark' ? '#E5E7EB' : '#000',
              fontWeight: 'bold'
            },
            '--DataGrid-rowBorderColor':
              theme === 'dark' ? '#1f2937' : '#e5e7eb', // ✅ Change row border color
            '& .MuiDataGrid-cell': {
              color: theme === 'dark' ? '#E5E7EB' : '#000'
            },
            '& .MuiDataGrid-withBorderColor': {
              // ✅ Targets the specific class for border color
              borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' // ✅ Change border color
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme === 'dark' ? '#1E293B' : '#f5f5f5'
            },

            '& .MuiDataGrid-container--top [role=row], & .MuiDataGrid-container--bottom [role=row]':
              {
                backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
                color: theme === 'dark' ? '#a1a1aa' : '#000',
                fontSize: '14px',
                fontWeight: 'bold'
              },
            '& .MuiToolbar-root': {
              // ✅ Instead of .css-1gak8h1-MuiToolbar-root-MuiTablePagination-toolbar
              backgroundColor: theme === 'dark' ? '#000' : '#f5f5f5',
              color: theme === 'dark' ? '#a1a1aa' : '#000'
            },
            '& .MuiSelect-select': {
              backgroundColor: theme === 'dark' ? '#fff' : '#f5f5f5',
              color: theme === 'dark' ? '#000' : '#000',
              borderRadius: '5px'
            },
            '& .MuiSvgIcon-root': {
              color: theme === 'dark' ? '#a1a1aa' : '#000'
            },
            '& .MuiDataGrid-toolbarQuickFilter': {
              marginBottom: '20px',
              backgroundColor: theme === 'dark' ? '#06040b' : '#f5f5f5',
              borderRadius: '8px',
              border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #000',
              padding: '0px 5px'
            },
            '& .MuiDataGrid-toolbarQuickFilter .MuiInputBase-input': {
              color: theme === 'dark' ? '#fff' : '#000',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '14px'
            },
            '& .MuiInput-input': {
              color: theme === 'dark' ? '#fff' : '#000'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme === 'dark' ? '#fff' : '#000'
            },
            '& .MuiTablePagination-root .MuiSelect-select': {
              backgroundColor: theme === 'dark' ? '#06040b' : '#f5f5f5',
              color: theme === 'dark' ? '#fff' : '#000',
              borderRadius: '8px',
              fontSize: '14px'
            },
            '& .MuiTablePagination-root .MuiInputBase-input': {
              color: theme === 'dark' ? '#fff' : '#000'
            }
          }}
        />
      </div>
    </div>
  );
};

export default GridTable;
