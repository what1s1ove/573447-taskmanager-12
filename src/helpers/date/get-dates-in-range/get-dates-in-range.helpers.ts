import moment from 'moment';

const getDatesInRange = (dateFrom: Date, dateTo: Date) => {
  const dates = [];
  const stepDate = new Date(dateFrom);

  while (moment(stepDate).isSameOrBefore(dateTo)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};

export { getDatesInRange };
