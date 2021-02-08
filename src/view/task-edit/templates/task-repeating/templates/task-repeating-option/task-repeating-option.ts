const createTaskEditRepeatingOptionTemplate = (
  day: string,
  isRepeating: boolean,
  isDisabled: boolean
) => `
  <input
    id="repeat-${day}"
    value="${day}"
    ${isDisabled ? `checked` : ``}
    ${isRepeating ? `checked` : ``}
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    name="repeat"
  />
  <label class="card__repeat-day" for="repeat-${day}">
    ${day}
  </label>
`;

export { createTaskEditRepeatingOptionTemplate };
