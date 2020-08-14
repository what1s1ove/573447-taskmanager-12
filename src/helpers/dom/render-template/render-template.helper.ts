const renderTemplate = (
  container: Element,
  template: string,
  place: InsertPosition
) => {
  container.insertAdjacentHTML(place, template);
};

export { renderTemplate };
