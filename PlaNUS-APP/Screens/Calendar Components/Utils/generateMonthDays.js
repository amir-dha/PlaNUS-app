
import { addDays, startOfMonth, endOfMonth } from 'date-fns';

export const generateMonthDays = (month, year) => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));
  const days = [];
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    days.push(date);
  }
  return days;
};
