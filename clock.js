let hours = 8;
let minutes = 0;
let hoursAndMinutes = ``;

function clock() {
  const leadingZero = (n) => (n > 9 ? n : `0${n}`);

  minutes++;

  if (minutes === 60) {
    minutes = 0;
    hours++;
    if (hours >= 24) {
      // this.endGame();
    }
  }

  hoursAndMinutes = `${leadingZero(hours)} ${leadingZero(minutes)}`;

  return (document.querySelector('#clock').innerHTML = hoursAndMinutes);
}

setInterval(clock(), 1000);
