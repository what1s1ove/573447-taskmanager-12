import { TaskColor } from '~/common/enums';

const createTaskEditColorsTemplate = (currentColor: TaskColor) => {
  const colors = Object.values(TaskColor);

  return colors
    .reduce(
      (acc, it) => (acc.concat(`
        <input
          type="radio"
          id="color-${it}"
          class="card__color-input card__color-input--${it} visually-hidden"
          name="color"
          value="${it}"
          ${currentColor === it ? `checked` : ``}
        />
        <label
          for="color-${it}"
          class="card__color card__color--${it}"
        >
          ${it}
        </label>`)), ``
    );
};

export { createTaskEditColorsTemplate };
