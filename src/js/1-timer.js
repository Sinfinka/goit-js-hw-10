import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  timeout: 3500,
  transitionIn: 'fadeIn',
  transitionOut: 'fadeOut',
  position: 'topRight',
  message: 'Please choose a date in the future',
  messageColor: 'white',
  backgroundColor: 'red',
  progressBar: false,
  close: true,
});

const datePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const resetBtn = document.querySelector('[data-reset]');

const timeElements = {};
['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
  timeElements[unit] = document.querySelector(`[data-${unit}]`);
});

startBtn.disabled = true;
resetBtn.disabled = true;

let userSelectedDate;
let countdownInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.show();
      return;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(datePicker, options);

startBtn.addEventListener('click', () => {
  const presentTime = new Date().getTime();
  const timeDifference = userSelectedDate.getTime() - presentTime;

  if (timeDifference > 0) {
    startCountdown(timeDifference);
    resetBtn.disabled = false;
  } else {
    iziToast.error();
  }
});

function startCountdown(timeDifference) {
  countdownInterval = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimerDisplay({ days, hours, minutes, seconds });
    timeDifference -= 1000;

    if (timeDifference < 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  resetBtn.addEventListener('click', resetTimer);
}

function resetTimer() {
  clearInterval(countdownInterval);

  Object.values(timeElements).forEach(element => (element.textContent = '00'));

  resetBtn.disabled = true;
  datePicker.disabled = false;
}

function addZero(unit) {
  return unit < 10 ? `0${unit}` : unit;
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timeElements.days.textContent = addZero(days);
  timeElements.hours.textContent = addZero(hours);
  timeElements.minutes.textContent = addZero(minutes);
  timeElements.seconds.textContent = addZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
