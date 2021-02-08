import AbstractView from '~/view//abstract/abstract';

class Loading extends AbstractView {
  get template() {
    return `
      <p class="board__no-tasks">
        Loading...
      </p>
    `;
  }
}

export default Loading;
