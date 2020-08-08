import { getRandomNumber } from '~/helpers/number';
import { getCurrentDate } from '~/helpers/date';

const generateDate = (): Date | null => {
  const isDate = Boolean(getRandomNumber(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomNumber(-maxDaysGap, maxDaysGap);
  const currentDate = getCurrentDate();

  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

export { generateDate };
