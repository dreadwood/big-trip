const TABS = [
  `Table`,
  `Stats`
];

export const createMenuTemplate = (selectedFilter = `Table`) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${TABS.map((item) => `<a
        class="trip-tabs__btn ${item === selectedFilter ? `trip-tabs__btn--active` : ``}"
        href="#"
      >${item}</a>`).join(`\n`)}
    </nav>`
  );
};
