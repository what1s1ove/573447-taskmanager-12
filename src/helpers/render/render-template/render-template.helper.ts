const renderTemplate = (
  container: HTMLElement,
  template: string,
  place: InsertPosition
) => {
  container.insertAdjacentHTML(place, template);
};

export { renderTemplate };
