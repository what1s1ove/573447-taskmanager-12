import Abstract from '~/view/abstract/abstract';
import { replaceWithElement } from '~/helpers';
import { BindingCb } from '~/common/types';

abstract class Smart<T> extends Abstract {
  abstract initListeners: BindingCb;

  protected data: T | null;

  constructor() {
    super();
    this.data = null;
  }

  protected updateNode = () => {
    let prevElement = this.node;
    this.removeElement();

    const newElement = this.node;

    replaceWithElement(prevElement, newElement);
    prevElement = null;

    this.initListeners();
  };

  public updateData = (dataPayload: Partial<T>, isDataUpdating = false) => {
    this.data = {
      ...this.data,
      ...dataPayload,
    };

    if (isDataUpdating) {
      return;
    }

    this.updateNode();
  };
}

export default Smart;
