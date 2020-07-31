import { AdjacentHTMLPlace } from "~/common/enums";

const renderTemplate = (
  container: Element,
  template: string,
  place: AdjacentHTMLPlace
) => {
  container.insertAdjacentHTML(place, template);
};

export { renderTemplate };
