import moment from 'moment';

const checkIsDatesEqual = (dateA: Date, dateB: Date) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export { checkIsDatesEqual };
