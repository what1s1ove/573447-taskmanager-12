import { RenderPosition } from '~/common/enums';

const renderElement = (
  container: Element,
  element: Element,
  place: RenderPosition
) => {
  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};

export { renderElement };
