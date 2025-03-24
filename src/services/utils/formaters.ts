import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

export const formatDateToDateTime = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}T00:00:00.000Z`; // Ensure it's in ISO format
};

export const formatDateToDDMMYYYY = (isoDate: string): string => {
  return format(parseISO(isoDate), 'dd-MM-yyyy');
};
