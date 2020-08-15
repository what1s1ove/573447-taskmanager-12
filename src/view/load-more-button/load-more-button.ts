import AbstractView from '~/view/abstract/abstract';
import { BindingCb } from '~/common/types';

type CallBacks = {
  onClick: BindingCb;
};

class LoadMoreButton extends AbstractView {
  get template() {
    return `
      <button class="load-more" type="button">
        load more
      </button>
    `;
  }

  #onClick = (evt: Event) => {
    evt.preventDefault();

    (this.callbacks as CallBacks).onClick();
  };

  public setOnClick = (callback: BindingCb) => {
    (this.callbacks as CallBacks).onClick = callback;

    this.element.addEventListener(`click`, this.#onClick);
  };
}

export default LoadMoreButton;
