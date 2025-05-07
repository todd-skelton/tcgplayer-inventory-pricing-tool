export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const quantityFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const changeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  signDisplay: "exceptZero",
  currency: "USD",
});

export const changePercentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
