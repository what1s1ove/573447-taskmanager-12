import { MenuItem } from '~/common/enums';
import { BindingCbWithOne } from '~/common/types';
import AbstractView from '~/view/abstract/abstract';

type CallBacks = {
  onMenuItemChange: BindingCbWithOne<MenuItem>
};

class SiteMenu extends AbstractView {
  protected callbacks: CallBacks;

  get template() {
    return `
      <section class="control__btn-wrap">
        <input
          value="${MenuItem.ADD_NEW_TASK}"
          type="radio"
          name="control"
          id="control__new-task"
          class="control__input visually-hidden"
        />
        <label for="control__new-task" class="control__label control__label--new-task">
          + ADD NEW TASK
        </label>
        <input
          value="${MenuItem.TASKS}"
          type="radio"
          name="control"
          id="control__task"
          class="control__input visually-hidden"
          checked
        />
        <label for="control__task" class="control__label">TASKS</label>
        <input
          value="${MenuItem.STATISTICS}"
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

  #onMenuItemChange = ({ target }: Event) => {
    this.callbacks.onMenuItemChange(
      (target as HTMLInputElement).value as MenuItem
    );
  };

  public setOnMenuClick(callback: BindingCbWithOne<MenuItem>) {
    this.callbacks.onMenuItemChange = callback;

    this.node.addEventListener(`change`, this.#onMenuItemChange);
  }

  public setMenuItem(menuItem: MenuItem) {
    const inputNode: HTMLInputElement = this.node.querySelector(`[value=${menuItem}]`);

    inputNode.checked = true;
  }
}

export default SiteMenu;
