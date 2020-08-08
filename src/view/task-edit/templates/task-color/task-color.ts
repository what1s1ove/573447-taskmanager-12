import { TaskColor } from '~/common/enums';

const createTaskEditColorsTemplate = (currentColor: TaskColor) => {
  const colors = Object.values(TaskColor);

  return colors
    .map(
      (color) => `
        <input
          type="radio"
          id="color-${color}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}"
          class="card__color card__color--${color}"
        >
        ${color}
        </label>`
    )
    .join(``);
};

export { createTaskEditColorsTemplate };
