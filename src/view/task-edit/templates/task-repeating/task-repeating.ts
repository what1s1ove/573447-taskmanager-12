import { checkIsTaskRepeating } from '~/helpers';
import { ITaskRepeating } from '~/common/interfaces';
import { createTaskEditRepeatingOptionTemplate } from './templates/task-repeating-option/task-repeating-option';

const createTaskEditRepeatingTemplate = (repeating: ITaskRepeating) => {
  const isRepeating = checkIsTaskRepeating(repeating);

  return `
  <button class="card__repeat-toggle" type="button">
    repeat:
    <span class="card__repeat-status">
      ${isRepeating ? `yes` : `no`}
    </span>
  </button>
  ${isRepeating
    ? `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
  ${Object.entries(repeating)
    .map(([day, repeat]) => createTaskEditRepeatingOptionTemplate(day, repeat))
    .join(``)}
        </div>
      </fieldset>`
    : ``
}`;
};

export { createTaskEditRepeatingTemplate };
