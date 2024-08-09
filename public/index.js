window.addEventListener('DOMContentLoaded', (event) => {
  const setUserClickEvent = (elem) => {
    elem.addEventListener('click', (event) => {
      alert(event.target.innerHTML);
    });
  };

  document.querySelectorAll('.user-name').forEach(setUserClickEvent);

  document.querySelector('.send-button').addEventListener('click', (event) => {
    const newElement = document.createElement('li');
    const text = document.querySelector('.input-text').value;
    newElement.innerHTML = text;
    newElement.classList.add('user-name');
    setUserClickEvent(newElement);
    document.querySelector('.user-list').appendChild(newElement);

    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: text })
    });
  });

  const incrementButton = document.getElementById('increment-button');
  const clickCountDisplay = document.getElementById('click-count');

  fetch('/counter-value')
    .then(response => response.json())
    .then(data => {
      clickCountDisplay.textContent = data.count;
    });

  incrementButton.addEventListener('click', () => {
    fetch('/increment')
      .then(() => {
        fetch('/counter-value')
          .then(response => response.json())
          .then(data => {
            clickCountDisplay.textContent = data.count;
          });
      });
  });



  const textArea = document.querySelector('#text-area');
  const countDisplay = document.querySelector('#char-count');

  textArea.addEventListener('input', () => {
    countDisplay.textContent = textArea.value.length;
  });

  document.querySelector('#change-color').addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
  });
});





