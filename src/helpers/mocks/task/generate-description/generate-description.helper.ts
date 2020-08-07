import { getRandomItem } from "~/helpers/array";

const descriptions = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const generateDescription = (): string => {
  const randomItem = getRandomItem(descriptions);

  return randomItem;
};

export { generateDescription };
