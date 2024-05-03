const input = document.querySelector("#input");
const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const convertBtn = document.querySelector("#convertbtn");
const result = document.querySelector("#result");

convertBtn.addEventListener("click", convert);

function populateCurrencies() {
  fetch("https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/codes")
    .then((response) => response.json())
    .then((data) => {
      const currencyCodes = data.supported_codes;
      currencyCodes.forEach((currencyCode) => {
        const option = document.createElement("option");
        option.value = currencyCode;
        option.textContent = currencyCode;
        fromCurrency.appendChild(option);
        toCurrency.appendChild(option.cloneNode(true));
      });
    });
}

populateCurrencies();

function convert() {
  if (!input || !fromCurrency || !toCurrency || !result) {
    console.error("Null pointer reference:", input, fromCurrency, toCurrency, result);
    return;
  }
  const amount = Number(input.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const fromShort = from && from.slice(0, 3).toUpperCase();
  const toShort = to && to.slice(0, 3).toUpperCase();

  if (!amount || !from || !to) {
    result.textContent = "Please fill in all fields.";
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/pair/${fromShort}/${toShort}/${amount}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        const convertedAmount = data.conversion_result;
        result.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
      } else {
        throw new Error("Conversion failed. Please try again later.");
      }
    })
    .catch((error) => {
      console.error(error);
      result.textContent = "Conversion failed. Please try again later.";
    });
}

