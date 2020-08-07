import { ITask } from "~/common/interfaces";
import { TaskRepeatDay } from "~/common/enums";
import { getRandomNumber } from "../../../number";
import { generateDate } from "../generate-date/generate-date.helper";
import { generateRepeating } from "../generate-repeating/generate-repeating.helper";
import { getRandomColor } from "../get-random-color/get-random-color.helper";
import { generateDescription } from "../generate-description/generate-description.helper";

const DEFAULT_REPEATING = {
  [TaskRepeatDay.MO]: false,
  [TaskRepeatDay.TU]: false,
  [TaskRepeatDay.WE]: false,
  [TaskRepeatDay.TH]: false,
  [TaskRepeatDay.FR]: false,
  [TaskRepeatDay.SA]: false,
  [TaskRepeatDay.SU]: false,
};

const generateTask = (): ITask => {
  const dueDate = generateDate();
  const repeating = dueDate ? generateRepeating() : DEFAULT_REPEATING;

  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
  };
};

export { generateTask };
