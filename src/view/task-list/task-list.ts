import AbstractView from '~/view/abstract/abstract';

class TaskList extends AbstractView {
  get template() {
    return `
      <div class="board__tasks"></div>
    `;
  }
}

export default TaskList;
