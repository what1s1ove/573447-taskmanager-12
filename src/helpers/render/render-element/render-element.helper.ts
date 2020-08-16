import Abstract from '~/view/abstract/abstract';
import { RenderPosition } from '~/common/enums';

const renderElement = (
  container: Element | Abstract,
  child: Element | Abstract,
  place: RenderPosition
) => {
  if (container instanceof Abstract) {
    container = container.node;
  }

  if (child instanceof Abstract) {
    child = child.node;
  }

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFORE_END:
      container.append(child);
      break;
  }
};

export { renderElement };
