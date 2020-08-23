import { TaskDueDate } from '~/common/types';
import { formatTaskDueDate } from '~/helpers';

const createTaskEditDateTemplate = (dueDate: TaskDueDate, isDueDate: boolean) => `
  <button class="card__date-deadline-toggle" type="button">
    date:
    <span class="card__date-status">
      ${isDueDate ? `yes` : `no`}
    </span>
  </button>
  ${isDueDate
  ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${formatTaskDueDate(dueDate)}"
      />
    </label>
  </fieldset>`
  : ``}
`;

export { createTaskEditDateTemplate };
