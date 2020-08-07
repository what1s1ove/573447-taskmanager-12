import { TaskColor } from "~/common/enums";
import { ITaskRepeating } from "./task-repeating.interface";

interface ITask {
  description: string;
  dueDate: Date | string | null;
  repeating: ITaskRepeating;
  color: TaskColor;
  isArchive: boolean;
  isFavorite: boolean;
}

export { ITask };
