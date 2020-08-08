import { TaskRepeatDay } from '~/common/enums';

const TASK_DEFAULT_REPEATING = {
  [TaskRepeatDay.MO]: false,
  [TaskRepeatDay.TU]: false,
  [TaskRepeatDay.WE]: false,
  [TaskRepeatDay.TH]: false,
  [TaskRepeatDay.FR]: false,
  [TaskRepeatDay.SA]: false,
  [TaskRepeatDay.SU]: false,
};

export { TASK_DEFAULT_REPEATING };
