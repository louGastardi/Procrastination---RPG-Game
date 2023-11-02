document.getElementById('start-button').addEventListener('click', () => {
  document.getElementsByClassName('all-elements')[0].style.display = 'flex';
  document.getElementsByClassName('start')[0].style.display = 'none';

  const overworld = new Overworld({
    element: document.querySelector('.game-container'),
  });

  overworld.start();
});
