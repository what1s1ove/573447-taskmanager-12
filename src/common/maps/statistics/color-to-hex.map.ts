import { TaskColor } from '~/common/enums';

const colorToHex = {
  [TaskColor.BLACK]: `#000000`,
  [TaskColor.BLUE]: `#0c5cdd`,
  [TaskColor.GREEN]: `#31b55c`,
  [TaskColor.PINK]: `#ff3cb9`,
  [TaskColor.YELLOW]: `#ffe125`,
};

export { colorToHex };
