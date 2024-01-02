import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const iziToastRedSettings = {
  timeout: 3000,
  transitionIn: 'fadeIn',
  transitionOut: 'fadeOut',
  position: 'topRight',
  messageColor: 'white',
  backgroundColor: 'red',
  progressBar: false,
  close: true,
};

const iziToastGreenSettings = {
  timeout: 3000,
  transitionIn: 'fadeIn',
  transitionOut: 'fadeOut',
  position: 'topRight',
  messageColor: 'white',
  backgroundColor: 'green',
  progressBar: false,
  close: true,
};

const promiseForm = document.querySelector('#promiseForm');

promiseForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const delayInput = document.querySelector('[name="delay"]');
  const stateInput = document.querySelector('[name="state"]:checked');

  const delay = parseInt(delayInput.value, 10);
  const state = stateInput.value;

  const promise = new Promise((resolve, reject) => {
    if (isNaN(delay) || delay < 0) {
      reject('Invalid delay value');
    } else {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    }
  });

  promise.then(
    result => {
      iziToastGreenSettings.message = `✅ Fulfilled promise in ${result}ms`;
      iziToast.show(iziToastGreenSettings);
    },
    error => {
      iziToastRedSettings.message = `❌ Rejected promise in ${error}ms`;
      iziToast.show(iziToastRedSettings);
    }
  );
});
