import {getDateWithDash} from '../utils/common.js';

export const createDayTemplate = (date, i) => {
  const dateElement = new Date(date);

  const datetime = getDateWithDash(dateElement);
  const formatDate = date.toUpperCase().slice(4, 10);

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${i + 1}</span>
        <time
          class="day__date"
          datetime="${datetime}"
        >${formatDate}</time>
      </div>

      <ul class="trip-events__list trip-events__list-${i}"></ul>
    </li>`
  );
};
