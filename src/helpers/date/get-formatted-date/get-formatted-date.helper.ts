import { DateFormatType } from '~/common/enums';

const getFormattedDate = (type: DateFormatType, date: Date | string) => {
  const localDate = new Date(date);
  let formattedDate = null;

  switch (type) {
    case DateFormatType.FULLMONTH_DAY:
      formattedDate = localDate.toLocaleString(`en-US`, {
        day: `numeric`,
        month: `long`,
      });
  }

  return formattedDate;
};

export { getFormattedDate };
