import flatpickr from 'flatpickr';
// Дополнительный импорт стилей
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

// ссылки на элементы документа
const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.btnStart.setAttribute('disabled', '');

// настройки ф-ции flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (selectedDates[0] >= Date.now()) {
      refs.btnStart.removeAttribute('disabled');
      refs.btnStart.style.backgroundColor = 'green';
    } else {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.btnStart.setAttribute('disabled', '');
    }
  },
};

// // инициализация ф-ции flatpickr
flatpickr('#datetime-picker', options);

// создание класса Timer
class Timer {
  constructor(onTick) {
    this.intervalId = null;
    this.onTick = onTick;
  }

  start() {
    const targetDate = new Date(refs.input.value);
    refs.btnStart.setAttribute('disabled', '');
    refs.btnStart.style.backgroundColor = 'red';

    this.intervalId = setInterval(() => {
      const currentDate = Date.now();
      const difference = targetDate - currentDate;
      const time = this.convertMs(difference);

      if (difference <= 1000) {
        clearInterval(this.intervalId);
      }
      this.onTick(time);
    }, 1000);
  }

  // ф-ция конвертирования времени из 'ms' в 'dd:hh:mm:ss'
  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

// ф-ция форматирования значения (дополняет строку нолями спереди до достижения длины в 2 символа)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// ф-ция обновления интерфейса
function updateInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// создаем экземпляр таймера (передаем ф-цию updateInterface в качестве коллбека onTick в конструктор класса)
const timer = new Timer(updateInterface);

refs.btnStart.addEventListener('click', timer.start.bind(timer));
