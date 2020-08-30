import { ITask } from '~/common/interfaces';
import { TaskColor } from '~/common/enums';

const countTasksByColor = (tasks: ITask[], color: TaskColor) => {
  const tasksByColor = tasks.filter((task) => task.color === color);

  return tasksByColor.length;
};

export { countTasksByColor };
