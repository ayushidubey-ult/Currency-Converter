document.addEventListener("DOMContentLoaded", () => {
  const fromCurrency = document.querySelector("select[name='from']");
  const toCurrency = document.querySelector("select[name='to']");
  const amountInput = document.querySelector("input[type='text']");
  const msg = document.querySelector(".msg");
  const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");
  const getBtn = document.querySelector("form button");

  const currencyToCountry = {
    "USD": "US",
    "INR": "IN",
    "EUR": "EU",
    "AUD": "AU"
  };

  function updateFlag(selectEl) {
    let code = selectEl.value;
    let country = currencyToCountry[code];
    let img = selectEl.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${country}/flat/64.png`;
  }

  updateFlag(fromCurrency);
  updateFlag(toCurrency);

  fromCurrency.addEventListener("change", () => updateFlag(fromCurrency));
  toCurrency.addEventListener("change", () => updateFlag(toCurrency));

  async function getExchangeRate() {
    let amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      msg.innerText = "Please enter a valid amount";
      return;
    }

    msg.innerText = "Fetching rate...";

    let from = fromCurrency.value;
    let to = toCurrency.value;

    try {
      // NEW API — always works
      let url = `https://open.er-api.com/v6/latest/${from}`;
      let res = await fetch(url);
      let data = await res.json();

      if (data.result !== "success") {
        msg.innerText = "API Error. Try again.";
        return;
      }

      let rate = data.rates[to];
      let finalAmount = (amount * rate).toFixed(2);

      msg.innerText = `${amount} ${from} = ${finalAmount} ${to}`;

    } catch (err) {
      msg.innerText = "Network error. Try again.";
    }
  }

  getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
  });

  swapBtn.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlag(fromCurrency);
    updateFlag(toCurrency);

    getExchangeRate();
  });
});