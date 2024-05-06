const fromAmountInput = document.querySelector("#from-amount");
const toAmountInput = document.querySelector("#to-amount");
const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");

// Fetches currency codes and populates the currency dropdowns
async function fetchAndPopulateCurrencies() {
  try {
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/codes"
    );
    const data = await response.json();
    const currencyCodes = data.supported_codes;
    currencyCodes.forEach((currencyCode) => {
      const option = document.createElement("option");
      option.value = currencyCode;
      option.textContent = currencyCode;
      fromCurrency.appendChild(option.cloneNode(true));
      toCurrency.appendChild(option.cloneNode(true));
    });

    fromCurrency.value = "KES,Kenyan Shilling";
    toCurrency.value = "USD,United States Dollar";

    convert();
  } catch (error) {
    console.error("Failed to populate currencies:", error);
  }
}

// Converts currency based on input values
async function convert() {
  let amount;
  let from;
  let to;

  if (this.id === "from-amount") {
    amount = Number(fromAmountInput.value) || 0;
    from = fromCurrency.value.slice(0, 3).toUpperCase();
    to = toCurrency.value.slice(0, 3).toUpperCase();
  } else if (this.id === "to-amount") {
    amount = Number(toAmountInput.value) || 0;
    from = toCurrency.value.slice(0, 3).toUpperCase();
    to = fromCurrency.value.slice(0, 3).toUpperCase();
  }

  try {
    if (!amount || !from || !to) {
      fromAmountInput.value = "";
      toAmountInput.value = "";
      return;
    }

    const url = `https://v6.exchangerate-api.com/v6/cc54afd12bb7c5e0b2316b7f/pair/${from}/${to}/${amount}`;

    const response = await fetch(url);
    const { conversion_result: convertedAmount } = await response.json();

    if (this.id === "from-amount") {
      toAmountInput.value = convertedAmount.toFixed(2);
    } else if (this.id === "to-amount") {
      fromAmountInput.value = convertedAmount.toFixed(2);
    }
  } catch (error) {
    console.error("Failed to convert currencies:", error);
    // You can add more specific error handling here
  }
}

// Event listeners
fromAmountInput.addEventListener("input", convert);
toAmountInput.addEventListener("input", convert);
fromCurrency.addEventListener("change", convert);
toCurrency.addEventListener("change", convert);

// Initial population of currencies
fetchAndPopulateCurrencies();
