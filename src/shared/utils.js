const precisionCoefficient = precision => {
  let coef = 1
  for (let index = 0; index < precision; index++) {
    coef *= 10
  }
  return coef
}

export const roundNumber = (value, precision = 2) => {
  const precisionCoef = precisionCoefficient(precision)
  return Math.round(value * precisionCoef) / precisionCoef
}
