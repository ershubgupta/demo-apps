import {
  calendarButtonClassName,
  calendarDayClassName,
  calendarGridClassName,
  calendarHeaderClassName,
  calendarPopupClassName,
  calendarTitleClassName,
  calendarWeekdayClassName,
} from "./calendarStyles";

type CalendarPopupOptions = {
  datePickerWrapper: HTMLElement;
  monthIndex: number;
  onMonthChange: (monthIndex: number) => void;
};

type PopupState = CalendarPopupOptions & {
  calendarPopup: HTMLDivElement;
};

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

let popupState: PopupState | null = null;
let outsideClickCleanup: (() => void) | null = null;

export function openCalendarPopup(options: CalendarPopupOptions) {
  removeCalendarPopup();

  const calendarPopup = createCalendarPopup(options.monthIndex);
  popupState = {
    ...options,
    calendarPopup,
  };

  positionCalendarPopup(calendarPopup, options.datePickerWrapper);
  document.body.appendChild(calendarPopup);
  installOutsideClickHandler(options.datePickerWrapper);
}

export function removeCalendarPopup() {
  if (!popupState) {
    return;
  }

  const { calendarPopup } = popupState;
  popupState = null;

  if (calendarPopup.isConnected) {
    calendarPopup.remove();
  }
}

export function cleanupCalendarPopup() {
  outsideClickCleanup?.();
  outsideClickCleanup = null;
  removeCalendarPopup();
}

function createCalendarPopup(monthIndex: number) {
  const calendarPopup = document.createElement("div");
  calendarPopup.className = calendarPopupClassName;
  calendarPopup.setAttribute("data-debug-calendar-popup", "true");
  calendarPopup.setAttribute("role", "dialog");
  calendarPopup.setAttribute("aria-label", "Calendar");

  renderCalendarPopup(calendarPopup, monthIndex);

  return calendarPopup;
}

function renderCalendarPopup(
  calendarPopup: HTMLDivElement,
  monthIndex: number
) {
  calendarPopup.replaceChildren();

  const header = document.createElement("div");
  header.className = calendarHeaderClassName;

  const title = document.createElement("div");
  title.className = calendarTitleClassName;
  title.textContent = monthFormatter.format(new Date(2026, monthIndex, 1));

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = calendarButtonClassName;
  nextButton.textContent = "Next Month";
  nextButton.addEventListener("click", handleNextMonthClick);

  header.append(title, nextButton);

  const grid = document.createElement("div");
  grid.className = calendarGridClassName;

  weekdays.forEach((weekday) => {
    const cell = document.createElement("div");
    cell.className = calendarWeekdayClassName;
    cell.textContent = weekday;
    grid.appendChild(cell);
  });

  Array.from({ length: 21 }, (_, index) => index + 1).forEach((day) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = calendarDayClassName;
    cell.textContent = String(day);
    grid.appendChild(cell);
  });

  calendarPopup.append(header, grid);
}

function handleNextMonthClick() {
  if (!popupState) {
    return;
  }

  const nextMonthIndex = popupState.monthIndex + 1;
  popupState.monthIndex = nextMonthIndex;
  popupState.onMonthChange(nextMonthIndex);
  renderCalendarPopup(popupState.calendarPopup, nextMonthIndex);
}

function installOutsideClickHandler(datePickerWrapper: HTMLElement) {
  outsideClickCleanup?.();

  document.addEventListener("pointerdown", handleDocumentPointerDown, true);

  outsideClickCleanup = () => {
    document.removeEventListener(
      "pointerdown",
      handleDocumentPointerDown,
      true
    );
  };

  function handleDocumentPointerDown(event: PointerEvent) {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (datePickerWrapper.contains(target)) {
      return;
    }

    // Intentionally broken for the DOM removal debugging demo.
    // Calendar clicks are incorrectly treated as outside clicks.
    removeCalendarPopup();
  }
}

function positionCalendarPopup(
  calendarPopup: HTMLElement,
  datePickerWrapper: HTMLElement
) {
  const rect = datePickerWrapper.getBoundingClientRect();
  calendarPopup.style.left = `${Math.max(16, rect.left)}px`;
  calendarPopup.style.top = `${rect.bottom + 8}px`;
}
