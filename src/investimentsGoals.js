function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** 1 / 12;
}

function generateReturnsArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  montlyContribution = 0,
  returnRate = 0,
  returnTimeFrame = "monthly"
) {
  if (!startingAmount || !timeHorizon) {
    throw new error(
      "Investimento inicioal e prazo devem ser preenchidos com valores positivos, numéricos e maiores que zeros!"
    );
  }
  // o comando abaixo testa se o returnTimeFrame = "montly", então retorna 1 + returnRate / 100  (para ficar = 1,05), senão, chama a função
  // convertToMontlyReturnRate(1 + returnRate / 100), para converter o % de rendimento anual em % de rendimento mensal e também ficar = a 1,05;
  const finalReturnRate =
    returnTimeFrame === "montly"
      ? 1 + returnRate / 100
      : convertToMontlyReturnRate(1 + returnRate / 100);

  // se período de tempo for = 'montly', então retorna o proóprio horizonte de tempo (período), senão (se for anual),
  //retorna o horizonte de tempo X 12 (qtde de meses de um  ano)
  const finalTimeHorizon =
    timePeriod === "montly" ? timeHorizon : timeHorizon * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalinterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnArray = [referenceInvestmentObject];

  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnArray[timeReference - 1].totalAmount * finalReturnRate +
      montlyContribution;

    const interestReturns =
      returnArray[timeReference - 1].totalAmount * finalReturnRate;

    const investedAmount = startingAmount + montlyContribution * timeReference;
    const totalinterestReturns = totalAmount - investedAmount;

    returnArray.push({
      investedAmount: investedAmount,
      interestReturns: interestReturns,
      totalinterestReturns: totalinterestReturns,
      month: timeReference,
      totalAmount: totalAmount,
    });
  }
  return returnArray;
}
