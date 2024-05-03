const input = document.querySelector("#input");
const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const convertBtn = document.querySelector("#convertbtn");
const result = document.querySelector("#result");

convertBtn.addEventListener("click", convert);

function populateCurrencies() {
  fetch("https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/codes")
    .then(res => res.json())
    .then(data => {
      const codes = data.supported_codes;

      codes.forEach(code => {
        const option = document.createElement("option");
        option.textContent = code;
        fromCurrency.appendChild(option);
        toCurrency.appendChild(option.cloneNode(true));
      });
    });
}

populateCurrencies();

function convert() {
  const amount = Number(input.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || !from || !to) {
    result.textContent = "Please fill in all fields.";
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/pair/${from}/${to}/${amount}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        const convertedAmount = data.conversion_result;
        result.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
      } else {
        result.textContent = "Conversion failed. Please try again later.";
      }
    })
    .catch(() => {
      result.textContent = "Conversion failed. Please try again later.";
    });
}