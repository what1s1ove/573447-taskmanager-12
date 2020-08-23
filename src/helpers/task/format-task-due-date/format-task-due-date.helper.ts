import moment from 'moment';

const formatTaskDueDate = (dueDate: Date) => {
  const formattedDate = moment(dueDate).format(`D MMMM`);

  return formattedDate;
};

export { formatTaskDueDate };
