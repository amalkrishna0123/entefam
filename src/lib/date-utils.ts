import { format, isToday, isYesterday, startOfMonth, endOfMonth } from 'date-fns';

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy');
};

export const getRelativeDate = (date: Date | string) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM dd');
};

export const getMonthRange = (date: Date) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};
