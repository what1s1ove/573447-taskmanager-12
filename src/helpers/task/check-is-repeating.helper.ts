import { ITaskRepeating } from '~/common/interfaces';

const checkIsRepeating = (repeating: ITaskRepeating) => {
  const isRepeating = Object.values(repeating).some(Boolean);

  return isRepeating;
};

export { checkIsRepeating };
