const apiKey = "cur_live_oYXFuLUTihSJlMDTrwEkAerSJNkbIHrkYfny8ERN";
const apiURL = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;

// Function to dynamically populate dropdowns
async function populateCurrencies() {
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    if (data && data.data) {
      // Loop through available currencies and add them as options
      Object.keys(data.data).forEach((currencyCode) => {
        const optionFrom = document.createElement("option");
        optionFrom.value = currencyCode;
        optionFrom.textContent = currencyCode;

        const optionTo = document.createElement("option");
        optionTo.value = currencyCode;
        optionTo.textContent = currencyCode;

        fromCurrency.appendChild(optionFrom);
        toCurrency.appendChild(optionTo);
      });
    }
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
}

// Call the function to populate the dropdowns when the page loads
window.onload = populateCurrencies;

// Function to fetch and convert currency
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "Please enter a valid amount.";
    return;
  }

  if (fromCurrency === "#" || toCurrency === "#") {
    resultDiv.textContent = "Please select valid currencies.";
    return;
  }

  try {
    const response = await fetch(`${apiURL}&currencies=${fromCurrency},${toCurrency}`);
    const data = await response.json();

    if (data && data.data) {
      const fromRate = data.data[fromCurrency].value;
      const toRate = data.data[toCurrency].value;
      const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);

      resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } else {
      resultDiv.textContent = "Error fetching exchange rates. Please try again.";
    }
  } catch (error) {
    console.error("Error:", error);
    resultDiv.textContent = "Failed to fetch currency data.";
  }
}

// Function to reset the form
function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("fromCurrency").value = "#";
  document.getElementById("toCurrency").value = "#";
  document.getElementById("result").textContent = "";
}
