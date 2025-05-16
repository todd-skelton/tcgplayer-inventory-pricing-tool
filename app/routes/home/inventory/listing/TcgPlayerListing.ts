import { completeFromList } from "@codemirror/autocomplete";
import type { Autocompletion } from "../Autocompletion.type";
import type { Inventory } from "../Inventory.type";
import { roundTo } from "~/utilities/math";

export interface TcgPlayerListing {
  "TCGplayer Id": string;
  "Product Line": string;
  "Set Name": string;
  "Product Name": string;
  Title: string;
  Number: string;
  Rarity: string;
  Condition: string;
  "TCG Market Price": string;
  "TCG Direct Low": string;
  "TCG Low Price With Shipping": string;
  "TCG Low Price": string;
  "Total Quantity": string;
  "Add to Quantity": string;
  "TCG Marketplace Price": string;
  "Photo URL": string;
}

export interface Listing {
  tcgPlayerId: string;
  productLine: string;
  setName: string;
  productName: string;
  title: string;
  number: string;
  rarity: string;
  condition: string;
  tcgMarketPrice: number;
  tcgDirectLow: number;
  tcgLowPriceWithShipping: number;
  tcgLowPrice: number;
  totalQuantity: number;
  addToQuantity: number;
  tcgMarketplacePrice: number;
  currentMarketplacePrice: number;
  photoUrl: string;
  error?: string;
  raw: { [key: string]: string };
}

export interface ListingTotals {
  tcgMarketPrice: number;
  tcgDirectLow: number;
  tcgLowPriceWithShipping: number;
  tcgLowPrice: number;
  totalQuantity: number;
  tcgMarketplacePrice: number;
  currentMarketplacePrice: number;
}

export type ListingInventory = Inventory<
  "TcgPlayerListing",
  Listing,
  ListingTotals
>;

export const initializeListingTotals = (): ListingTotals => ({
  totalQuantity: 0,
  tcgMarketPrice: 0,
  tcgLowPriceWithShipping: 0,
  tcgLowPrice: 0,
  tcgDirectLow: 0,
  tcgMarketplacePrice: 0,
  currentMarketplacePrice: 0,
});

export const defaultListingInventory: ListingInventory = {
  type: "TcgPlayerListing",
  listings: [],
  totals: initializeListingTotals(),
};

export const mapTcgPlayerListingToListing = (
  listing: TcgPlayerListing
): Listing => {
  const {
    "TCGplayer Id": tcgPlayerId,
    "Product Line": productLine,
    "Set Name": setName,
    "Product Name": productName,
    Title: title,
    Number: number,
    Rarity: rarity,
    Condition: condition,
    "TCG Market Price": tcgMarketPrice,
    "TCG Direct Low": tcgDirectLow,
    "TCG Low Price With Shipping": tcgLowPriceWithShipping,
    "TCG Low Price": tcgLowPrice,
    "Total Quantity": totalQuantity,
    "Add to Quantity": addToQuantity,
    "TCG Marketplace Price": tcgMarketplacePrice,
    "Photo URL": photoUrl,
    ...raw
  } = listing;

  return {
    tcgPlayerId,
    productLine,
    setName,
    productName,
    title,
    number,
    rarity,
    condition,
    tcgMarketPrice: parseFloat(tcgMarketPrice),
    tcgDirectLow: parseFloat(tcgDirectLow),
    tcgLowPriceWithShipping: parseFloat(tcgLowPriceWithShipping),
    tcgLowPrice: parseFloat(tcgLowPrice),
    totalQuantity: parseInt(totalQuantity, 10),
    addToQuantity: parseInt(addToQuantity, 10),
    tcgMarketplacePrice: parseFloat(tcgMarketplacePrice),
    currentMarketplacePrice: parseFloat(tcgMarketplacePrice),
    photoUrl: photoUrl,
    raw,
  };
};

export const updateListingTotals = (
  totals: ListingTotals,
  listing: Listing
): void => {
  const quantity = listing.totalQuantity || 0 + listing.addToQuantity || 0;

  totals.tcgMarketPrice += listing.tcgMarketPrice || 0 * quantity;

  totals.tcgDirectLow += listing.tcgDirectLow || 0 * quantity;

  totals.tcgLowPriceWithShipping +=
    listing.tcgLowPriceWithShipping || 0 * quantity;

  totals.tcgLowPrice += listing.tcgLowPrice || 0 * quantity;

  totals.totalQuantity += listing.totalQuantity || 0;

  totals.totalQuantity += listing.addToQuantity || 0;

  totals.tcgMarketplacePrice += listing.tcgMarketplacePrice || 0 * quantity;

  totals.currentMarketplacePrice +=
    listing.currentMarketplacePrice || 0 * quantity;
};

export const filteredListing = (
  filterScript: string,
  listing: Listing
): boolean => {
  try {
    const func = new Function(
      "listing",
      `with (listing) { 
      ${filterScript} 
      }`
    );
    return func(listing);
  } catch (error) {
    console.error("Error in filter script:", error);
    listing.error = error instanceof Error ? error.message : String(error);
    return false;
  }
};

export const normalizeListing = (listing: Listing): void => {
  listing.tcgMarketPrice = roundTo(listing.tcgMarketPrice, 2);
  listing.tcgDirectLow = roundTo(listing.tcgDirectLow, 2);
  listing.tcgLowPriceWithShipping = roundTo(listing.tcgLowPriceWithShipping, 2);
  listing.tcgLowPrice = roundTo(listing.tcgLowPrice, 2);
  listing.totalQuantity = roundTo(listing.totalQuantity, 0);
  listing.addToQuantity = roundTo(listing.addToQuantity, 0);
  listing.tcgMarketplacePrice = roundTo(listing.tcgMarketplacePrice, 2);
  listing.currentMarketplacePrice = roundTo(listing.currentMarketplacePrice, 2);
};

export const updateListing = (script: string, listing: Listing): void => {
  try {
    const func = new Function(
      "listing",
      `with (listing) { 
      ${script} 
      }`
    );
    func(listing);
    normalizeListing(listing);
  } catch (error) {
    listing.error =
      error instanceof Error ? error.message : "Error in calculation script";
    console.error("Error in calculation script:", error, script);
  }
};

export const mapListingToTcgPlayerListing = (
  listing: Listing
): TcgPlayerListing => {
  return {
    "TCGplayer Id": listing.tcgPlayerId,
    "Product Line": listing.productLine,
    "Set Name": listing.setName,
    "Product Name": listing.productName,
    Title: listing.title,
    Number: listing.number,
    Rarity: listing.rarity,
    Condition: listing.condition,
    "TCG Market Price": isNaN(listing.tcgMarketPrice)
      ? ""
      : listing.tcgMarketPrice.toFixed(2),
    "TCG Direct Low": isNaN(listing.tcgDirectLow)
      ? ""
      : listing.tcgDirectLow.toFixed(2),
    "TCG Low Price With Shipping": isNaN(listing.tcgLowPriceWithShipping)
      ? ""
      : listing.tcgLowPriceWithShipping.toFixed(2),
    "TCG Low Price": isNaN(listing.tcgLowPrice)
      ? ""
      : listing.tcgLowPrice.toFixed(2),
    "Total Quantity": isNaN(listing.totalQuantity)
      ? ""
      : listing.totalQuantity.toFixed(0),
    "Add to Quantity": isNaN(listing.addToQuantity)
      ? ""
      : listing.addToQuantity.toFixed(0),
    "TCG Marketplace Price": isNaN(listing.tcgMarketplacePrice)
      ? ""
      : listing.tcgMarketplacePrice.toFixed(2),
    "Photo URL": listing.photoUrl,
    ...listing.raw,
  };
};

export const listingVariables: Autocompletion<Listing>[] = [
  { label: "tcgPlayerId", type: "variable", info: "TCG Player Product Id" },
  { label: "productLine", type: "variable", info: "Product Line" },
  { label: "setName", type: "variable", info: "Set Name" },
  { label: "productName", type: "variable", info: "Product Name" },
  { label: "title", type: "variable", info: "Title" },
  { label: "number", type: "variable", info: "Number" },
  { label: "rarity", type: "variable", info: "Rarity" },
  { label: "condition", type: "variable", info: "Condition" },
  { label: "tcgMarketPrice", type: "variable", info: "TCG Market Price" },
  { label: "tcgDirectLow", type: "variable", info: "TCG Direct Low" },
  {
    label: "tcgLowPriceWithShipping",
    type: "variable",
    info: "TCG Low Price With Shipping",
  },
  { label: "tcgLowPrice", type: "variable", info: "TCG Low Price" },
  { label: "totalQuantity", type: "variable", info: "Total Quantity" },
  { label: "addToQuantity", type: "variable", info: "Add to Quantity" },
  {
    label: "tcgMarketplacePrice",
    type: "variable",
    info: "TCG Marketplace Price",
  },
  {
    label: "currentMarketplacePrice",
    type: "variable",
    info: "Current TCG Marketplace Price",
  },
];

export const listingAutocomplete = completeFromList(listingVariables);
