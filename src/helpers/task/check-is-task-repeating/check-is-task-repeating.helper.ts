import { ITaskRepeating } from '~/common/interfaces';

const checkIsTaskRepeating = (repeating: ITaskRepeating) => {
  const isRepeating = Object.values(repeating).some(Boolean);

  return isRepeating;
};

export { checkIsTaskRepeating };
