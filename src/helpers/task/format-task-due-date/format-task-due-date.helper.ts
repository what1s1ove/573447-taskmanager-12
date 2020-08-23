import moment from 'moment';

const formatTaskDueDate = (dueDate: Date) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }

  const formattedDate = moment(dueDate).format(`D MMMM`);

  return formattedDate;
};

export { formatTaskDueDate };
