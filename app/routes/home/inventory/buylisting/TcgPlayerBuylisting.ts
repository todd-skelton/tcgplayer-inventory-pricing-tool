import { completeFromList } from "@codemirror/autocomplete";
import type { Autocompletion } from "../Autocompletion.type";
import type { Inventory } from "../Inventory.type";
import { roundTo } from "~/utilities/math";

export interface TcgPlayerBuylisting {
  "TCGplayer Id": string;
  "Product Line": string;
  "Set Name": string;
  "Product Name": string;
  Number: string;
  Rarity: string;
  Condition: string;
  "Buylist Market Price": string;
  "Buylist High Price": string;
  "Buylist Quantity": string;
  "Add to Buylist Quantity": string;
  "My Buylist Price": string;
  "Pending Purchase Quantity": string;
}

export interface Buylisting {
  tcgPlayerId: string;
  productLine: string;
  setName: string;
  productName: string;
  number: string;
  rarity: string;
  condition: string;
  buylistMarketPrice: number;
  buylistHighPrice: number;
  buylistQuantity: number;
  addToBuylistQuantity: number;
  myBuylistPrice: number;
  pendingPurchaseQuantity: number;
  currentBuylistPrice: number;
  error?: string;
  raw: { [key: string]: string };
}

export interface BuylistingTotals {
  buylistMarketPrice: number;
  buylistHighPrice: number;
  buylistQuantity: number;
  addToBuylistQuantity: number;
  myBuylistPrice: number;
  currentBuylistPrice: number;
  pendingPurchaseQuantity: number;
}

export type BuylistingInventory = Inventory<
  "TcgPlayerBuylisting",
  Buylisting,
  BuylistingTotals
>;

export const initializeBuylistingTotals = (): BuylistingTotals => ({
  buylistMarketPrice: 0,
  buylistHighPrice: 0,
  buylistQuantity: 0,
  addToBuylistQuantity: 0,
  myBuylistPrice: 0,
  pendingPurchaseQuantity: 0,
  currentBuylistPrice: 0,
});

export const defaultBuylistingInventory: BuylistingInventory = {
  type: "TcgPlayerBuylisting",
  listings: [],
  totals: initializeBuylistingTotals(),
};

export const mapTcgPlayerBuylistingToBuylisting = (
  buylisting: TcgPlayerBuylisting
): Buylisting => {
  const {
    "TCGplayer Id": tcgPlayerId,
    "Product Line": productLine,
    "Set Name": setName,
    "Product Name": productName,
    Number: number,
    Rarity: rarity,
    Condition: condition,
    "Buylist Market Price": buylistMarketPrice,
    "Buylist High Price": buylistHighPrice,
    "Buylist Quantity": buylistQuantity,
    "Add to Buylist Quantity": addToBuylistQuantity,
    "My Buylist Price": myBuylistPrice,
    "Pending Purchase Quantity": pendingPurchaseQuantity,
    ...raw
  } = buylisting;

  return {
    tcgPlayerId,
    productLine,
    setName,
    productName,
    number,
    rarity,
    condition,
    buylistMarketPrice: parseFloat(buylistMarketPrice),
    buylistHighPrice: parseFloat(buylistHighPrice),
    buylistQuantity: parseInt(buylistQuantity, 10),
    addToBuylistQuantity: parseInt(addToBuylistQuantity, 10),
    myBuylistPrice: parseFloat(myBuylistPrice),
    pendingPurchaseQuantity: parseInt(pendingPurchaseQuantity, 10),
    currentBuylistPrice: parseFloat(myBuylistPrice),
    raw,
  };
};

export const updateBuylistingTotals = (
  totals: BuylistingTotals,
  buylisting: Buylisting
): void => {
  totals.buylistMarketPrice += buylisting.buylistMarketPrice || 0;
  totals.buylistHighPrice += buylisting.buylistHighPrice || 0;
  totals.buylistQuantity += buylisting.buylistQuantity || 0;
  totals.addToBuylistQuantity += buylisting.addToBuylistQuantity || 0;
  totals.myBuylistPrice += buylisting.myBuylistPrice || 0;
  totals.pendingPurchaseQuantity += buylisting.pendingPurchaseQuantity || 0;
  totals.currentBuylistPrice += buylisting.currentBuylistPrice || 0;
};

export const mapBuylistingToTcgPlayerBuylisting = (
  buylisting: Buylisting
): TcgPlayerBuylisting => {
  return {
    "TCGplayer Id": buylisting.tcgPlayerId,
    "Product Line": buylisting.productLine,
    "Set Name": buylisting.setName,
    "Product Name": buylisting.productName,
    Number: buylisting.number,
    Rarity: buylisting.rarity,
    Condition: buylisting.condition,
    "Buylist Market Price": isNaN(buylisting.buylistMarketPrice)
      ? ""
      : buylisting.buylistMarketPrice.toFixed(2),
    "Buylist High Price": isNaN(buylisting.buylistHighPrice)
      ? ""
      : buylisting.buylistHighPrice.toFixed(2),
    "Buylist Quantity": isNaN(buylisting.buylistQuantity)
      ? ""
      : buylisting.buylistQuantity.toFixed(0),
    "Add to Buylist Quantity": isNaN(buylisting.addToBuylistQuantity)
      ? ""
      : buylisting.addToBuylistQuantity.toFixed(0),
    "My Buylist Price": isNaN(buylisting.myBuylistPrice)
      ? ""
      : buylisting.myBuylistPrice.toFixed(2),
    "Pending Purchase Quantity": isNaN(buylisting.pendingPurchaseQuantity)
      ? ""
      : buylisting.pendingPurchaseQuantity.toFixed(0),
    ...buylisting.raw,
  };
};

const normalizeBuylisting = (buylisting: Buylisting): void => {
  buylisting.buylistMarketPrice = roundTo(buylisting.buylistMarketPrice, 2);
  buylisting.buylistHighPrice = roundTo(buylisting.buylistHighPrice, 2);
  buylisting.buylistQuantity = roundTo(buylisting.buylistQuantity, 0);
  buylisting.addToBuylistQuantity = roundTo(buylisting.addToBuylistQuantity, 0);
  buylisting.myBuylistPrice = roundTo(buylisting.myBuylistPrice, 2);
  buylisting.pendingPurchaseQuantity = roundTo(
    buylisting.pendingPurchaseQuantity,
    0
  );
  buylisting.currentBuylistPrice = roundTo(buylisting.currentBuylistPrice, 2);
};

export const filteredListing = (
  filterScript: string,
  listing: Buylisting
): boolean => {
  try {
    const func = new Function("listing", `with (listing) { ${filterScript} }`);
    return func(listing);
  } catch (error) {
    console.error("Error in filter script:", error);
    listing.error = error instanceof Error ? error.message : String(error);
    return false;
  }
};

export const updateBuylisting = (
  script: string,
  buylisting: Buylisting
): void => {
  try {
    const func = new Function("buylisting", `with (buylisting) { ${script} }`);
    func(buylisting);
    normalizeBuylisting(buylisting);
  } catch (error) {
    buylisting.error =
      error instanceof Error ? error.message : "Error in calculation script";
    console.error("Error in calculation script:", error, script);
  }
};

export const buylistingVariables: Autocompletion<Buylisting>[] = [
  { label: "tcgPlayerId", type: "variable", info: "TCG Player Product Id" },
  { label: "productLine", type: "variable", info: "Product Line" },
  { label: "setName", type: "variable", info: "Set Name" },
  { label: "productName", type: "variable", info: "Product Name" },
  { label: "number", type: "variable", info: "Number" },
  { label: "rarity", type: "variable", info: "Rarity" },
  { label: "condition", type: "variable", info: "Condition" },
  {
    label: "buylistMarketPrice",
    type: "variable",
    info: "Buylist Market Price",
  },
  { label: "buylistHighPrice", type: "variable", info: "Buylist High Price" },
  { label: "buylistQuantity", type: "variable", info: "Buylist Quantity" },
  {
    label: "addToBuylistQuantity",
    type: "variable",
    info: "Add to Buylist Quantity",
  },
  { label: "myBuylistPrice", type: "variable", info: "My Buylist Price" },
  {
    label: "pendingPurchaseQuantity",
    type: "variable",
    info: "Pending Purchase Quantity",
  },
  {
    label: "currentBuylistPrice",
    type: "variable",
    info: "Current Buylist Price",
  },
];

export const buylistingAutocomplete = completeFromList(buylistingVariables);
