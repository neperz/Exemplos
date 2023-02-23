const form = document.querySelector('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault();
 

  const button = e.target.querySelector('button[type="submit"]');
  button.classList.toggle('spin');
  button.addEventListener('animationend', function() {
    button.classList.toggle('spin');
    const numbersInput = document.getElementById('numbers');
    let numbers = numbersInput.value.replace(/[^\d,]/g, ''); // remove caracteres que não são números ou vírgulas
    numbers = numbers.replace(/,,/g, ','); // remove vírgulas consecutivas
    
    numbersInput.value = numbers;
    const numbersArray = numbers.split(',').map(Number);
    const randomIndex = Math.floor(Math.random() * numbersArray.length);
    const randomNumber = numbersArray[randomIndex];
    result.textContent = `O número sorteado é: ${randomNumber}`;
  });
});

const numbersInput = document.getElementById('numbers');
numbersInput.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[^\d,]/g, ''); // remove caracteres que não são números ou vírgulas
  e.target.value = e.target.value.replace(/,,/g, ','); // remove vírgulas consecutivas
});