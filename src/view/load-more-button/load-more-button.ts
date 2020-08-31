import AbstractView from '~/view/abstract/abstract';
import { BindingCb } from '~/common/types';

type CallBacks = {
  onClick: BindingCb;
};

class LoadMoreButton extends AbstractView {
  protected callbacks: CallBacks;

  get template() {
    return `
      <button class="load-more" type="button">
        load more
      </button>
    `;
  }

  #onClick = (evt: Event) => {
    evt.preventDefault();

    this.callbacks.onClick();
  };

  public setOnClick = (callback: BindingCb) => {
    this.callbacks.onClick = callback;

    this.node.addEventListener(`click`, this.#onClick);
  };
}

export default LoadMoreButton;
