import { generateReturnsArray } from "./src/investimentsGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

const form = document.getElementById("investment-form");
//const calculateButton = document.getElementById("calculate-results");
const clearFormButton = document.getElementById("clear-form");

let progressionChartReference = {};
let doughnutChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}
function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  ressetChart();
  // const startingAmount = number(form["starting-amount"].value);
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );
  //console.log(returnsArray[returnsArray.length - 1]);
  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investimento", "Rendimento", "Imosto"],
      datasets: [
        {
          label: "Meu 1o. gráfico!",
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            formatCurrency(
              finalInvestmentObject.totalinterestReturns * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestmentObject.totalinterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  const investmentObject = returnsArray[returnsArray.length];

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjectEmpty(object) {
  return Object.keys(object).length === 0;
}
function ressetChart() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}
function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  ressetChart();

  const errorInputontainers = document.querySelectorAll(".error");

  for (const errorInputContainer of errorInputontainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}
function validateInput(evt) {
  //console.log(evt.target); --> comando para verificar onde o cursor foi clicado
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    //objetivo:  <p class="text-red-500 font-bold">Insira um valor numérico e maior que zeros!</p>
    const errorTextElement = document.createElement("p"); // cria esta tag <p></>
    errorTextElement.classList.add("text-red-500"); // <p class="text-red-500"></p>
    errorTextElement.classList.add("font-bold"); // <p class="text-red-500 font-bold"></p>
    errorTextElement.innerText = "Insira um valor numérico e maior que zeros!"; //  <p class="text-red-500 font-bold">Insira um valor numérico e maior que zeros!</p>

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}
for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
//calculateButton.addEventListener("click", renderProgression);
clearFormButton.addEventListener("click", clearForm);
