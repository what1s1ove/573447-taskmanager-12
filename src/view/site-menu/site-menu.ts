import { createElement } from '~/helpers/dom/index';

class SiteMenu {
  #element: Element | null = null;

  get node() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return `
      <section class="control__btn-wrap">
        <input
          type="radio"
          name="control"
          id="control__new-task"
          class="control__input visually-hidden"
        />
        <label for="control__new-task" class="control__label control__label--new-task">
          + ADD NEW TASK
        </label>
        <input
          type="radio"
          name="control"
          id="control__task"
          class="control__input visually-hidden"
          checked
        />
        <label for="control__task" class="control__label">TASKS</label>
        <input
          type="radio"
          name="control"
          id="control__statistic"
          class="control__input visually-hidden"
        />
        <label for="control__statistic" class="control__label">
          STATISTICS
        </label>
      </section>
    `;
  }

  removeElement() {
    this.#element = null;
  }
}

export default SiteMenu;
