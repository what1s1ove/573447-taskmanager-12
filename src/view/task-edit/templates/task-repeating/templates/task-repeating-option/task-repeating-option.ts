const createTaskEditRepeatingOptionTemplate = (
  day: string,
  isRepeating: boolean
) => `
  <input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${day}"
    name="repeat"
    value="${day}"
    ${isRepeating ? `checked` : ``}
  />
  <label class="card__repeat-day" for="repeat-${day}">
    ${day}
  </label>
`;

export { createTaskEditRepeatingOptionTemplate };
