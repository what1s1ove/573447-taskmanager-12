import AbstractView from '~/view/abstract/abstract';

class Board extends AbstractView {
  get template() {
    return `
      <section class="board container"></section>
    `;
  }
}

export default Board;
