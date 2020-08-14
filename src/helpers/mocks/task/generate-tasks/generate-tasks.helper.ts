import { generateTask } from '../generate-task/generate-task.helper';

const generateTasks = (count: number) => {
  const generatedTasks = Array.from(new Array(count), generateTask);

  return generatedTasks;
};

export { generateTasks };
