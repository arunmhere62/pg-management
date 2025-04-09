import { format, isValid, parseISO } from 'date-fns';

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

export const formatDateToDateTime = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}T00:00:00.000Z`; // Ensure it's in ISO format
};

export const formatDateToDDMMYYYY = (dateString: string): string => {
  try {
    // Return original if empty/falsy
    if (!dateString) return dateString;

    // Try parsing as ISO
    const date = parseISO(dateString);

    // Return original if invalid date
    if (!isValid(date)) return dateString;

    // Return formatted date
    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    // Return original string on any error
    return dateString;
  }
};

export const formatDateToMonDDYYYY = (dateString: string): string => {
  try {
    if (!dateString) return dateString;

    const date = parseISO(dateString);

    if (!isValid(date)) return dateString;

    return format(date, 'dd-MMM-yyyy'); // e.g. Mar-10-2025
  } catch {
    return dateString;
  }
};
