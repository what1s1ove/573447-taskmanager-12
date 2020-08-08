import { ITask } from '~/common/interfaces';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { getRandomNumber } from '../../../number';
import { generateDate } from '../generate-date/generate-date.helper';
import { generateRepeating } from '../generate-repeating/generate-repeating.helper';
import { getRandomColor } from '../get-random-color/get-random-color.helper';
import { generateDescription } from '../generate-description/generate-description.helper';

const generateTask = (): ITask => {
  const dueDate = generateDate();
  const repeating = dueDate ? TASK_DEFAULT_REPEATING : generateRepeating();

  return {
    dueDate,
    repeating,
    description: generateDescription(),
    color: getRandomColor(),
    isArchive: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
  };
};

export { generateTask };
