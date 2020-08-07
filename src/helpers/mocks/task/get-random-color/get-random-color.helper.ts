import { getRandomItem } from "~/helpers/array";
import { TaskColor } from "~/common/enums";

const colors = Object.values(TaskColor);

const getRandomColor = (): TaskColor => {
  const randomColor = getRandomItem(colors);

  return randomColor;
};

export { getRandomColor };
