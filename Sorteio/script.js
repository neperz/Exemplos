const form = document.querySelector('form');
const result = document.getElementById('result');
const recentNumbersList = document.getElementById('recent-numbers-list');
const clearButton = document.getElementById('clear-button');
let  recentNumbers =[] ;
// Carrega a lista de números recentes do Local Storage
recentNumbers = JSON.parse(localStorage.getItem('recentNumbers')) || [];
updateRecentNumbersList();

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const numbersInput = document.getElementById('numbers');
  let numbers = numbersInput.value.replace(/[^\d,]/g, ''); // remove caracteres que não são números ou vírgulas
  numbers = numbers.replace(/,,/g, ','); // remove vírgulas consecutivas
  numbersInput.value = numbers;
  const numbersArray = numbers.split(',').map(Number);
  const uniqueNumbers = new Set(numbersArray); // remove números duplicados
  const numbersList = [...uniqueNumbers];

// Carrega a lista de últimos números sorteados da memória do navegador
let ultimosNumeros = JSON.parse(localStorage.getItem("recentNumbers")) || [];

// Verifica se algum dos números já foi sorteado antes
for (let i = 0; i < numbersList.length; i++) {
  let numero = numbersList[i];

  if (ultimosNumeros.includes(numero)) {
    // Se o número já foi sorteado, remove-o da lista e sorteia novamente
    numbersList.splice(i, 1);
    i--;

    // Se todos os números foram sorteados antes, mostra uma mensagem de erro
    if (numbersList.length === 0) {
      alert("Não é possível sortear números não repetidos. Tente novamente com números diferentes.");
      return;
    }
  }
}


  const randomIndex = Math.floor(Math.random() * numbersList.length);
  const randomNumber = numbersList[randomIndex];
  result.innerHTML  = `<h2>Número sorteado:</h2><p>O número sorteado é: ${randomNumber}</p>`;

  // Adiciona o número recente à lista e a atualiza no Local Storage
  recentNumbers.push(randomNumber);
  if (recentNumbers.length > 10) {
    recentNumbers.shift();
  }
  updateRecentNumbersList();
  localStorage.setItem('recentNumbers', JSON.stringify(recentNumbers));

});

const numbersInput = document.getElementById('numbers');
numbersInput.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[^\d,]/g, ''); // remove caracteres que não são números ou vírgulas
  e.target.value = e.target.value.replace(/,,/g, ','); // remove vírgulas consecutivas
});

clearButton.addEventListener('click', function(e) {
  e.preventDefault();
  recentNumbers=[];  
  localStorage.removeItem('recentNumbers');
  recentNumbersList.innerHTML = "";
});

function updateRecentNumbersList() {
  recentNumbersList.innerHTML = '';
  recentNumbers.forEach(function(number) {
    const listItem = document.createElement('li');
    listItem.textContent = number;
    recentNumbersList.appendChild(listItem);
  });
}
