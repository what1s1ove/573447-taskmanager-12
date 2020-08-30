import moment from 'moment';

const parseChartDate = (date: Date) => moment(date).format(`D MMM`);

export { parseChartDate };
