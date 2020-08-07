import { getRandomNumber } from "~/helpers/number";

const getRandomItem = <T>(arr: T[]) => {
  const randomIdx = getRandomNumber(0, arr.length);

  const randomItem = arr[randomIdx];

  return randomItem;
};

export { getRandomItem };
