import { DateFormatType } from '~/common/enums';

const getFormattedDate = (type: DateFormatType, date: Date | string) => {
  const localDate = new Date(date);

  const formatter = {
    [DateFormatType.FULLMONTH_DAY]: localDate.toLocaleString(`en-US`, {
      day: `numeric`,
      month: `long`,
    }),
  };

  return formatter[type];
};

export { getFormattedDate };
