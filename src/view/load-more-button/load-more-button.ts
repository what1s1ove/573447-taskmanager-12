import AbstractView from '~/view/abstract/abstract';

class LoadMoreButton extends AbstractView {
  get template() {
    return `
      <button class="load-more" type="button">
        load more
      </button>
    `;
  }
}

export default LoadMoreButton;
