import { ITaskRepeating } from '~/common/interfaces';
import { getRandomNumber } from '~/helpers/number';
import { TaskRepeatDay } from '~/common/enums';

const generateRepeating = (): ITaskRepeating => {
  const repeating = Object.values(TaskRepeatDay).reduce(
    (acc, key) => ({
      ...acc,
      [key]: Boolean(getRandomNumber(0, 1)),
    }),
    {} as ITaskRepeating
  );

  return repeating;
};

export { generateRepeating };
