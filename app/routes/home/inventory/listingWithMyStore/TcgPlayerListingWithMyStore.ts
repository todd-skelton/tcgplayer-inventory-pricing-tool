import { completeFromList } from "@codemirror/autocomplete";
import {
  initializeListingTotals,
  listingVariables,
  mapListingToTcgPlayerListing,
  mapTcgPlayerListingToListing,
  updateListingTotals,
  normalizeListing,
  type Listing,
  type ListingTotals,
  type TcgPlayerListing,
} from "../listing/TcgPlayerListing";
import type { Autocompletion } from "../Autocompletion.type";
import type { Inventory } from "../Inventory.type";
import { roundTo } from "~/utilities/math";

export interface TcgPlayerListingWithMyStore extends TcgPlayerListing {
  "My Store Reserve Quantity": string;
  "My Store Price": string;
}

export interface ListingWithMyStore extends Listing {
  myStoreReserveQuantity: number;
  myStorePrice: number;
  currentMyStorePrice: number;
}

export interface ListingWithMyStoreTotals extends ListingTotals {
  myStoreReserveQuantity: number;
  myStorePrice: number;
  currentMyStorePrice: number;
}

export type ListingWithMyStoreInventory = Inventory<
  "TcgPlayerListingWithMyStore",
  ListingWithMyStore,
  ListingWithMyStoreTotals
>;

export const initializeListingTotalsWithMyStore =
  (): ListingWithMyStoreTotals => ({
    ...initializeListingTotals(),
    myStoreReserveQuantity: 0,
    myStorePrice: 0,
    currentMyStorePrice: 0,
  });

export const defaultListingInventory: ListingWithMyStoreInventory = {
  type: "TcgPlayerListingWithMyStore",
  listings: [],
  totals: initializeListingTotalsWithMyStore(),
};

export const mapTcgPlayerListingToListingWithMyStore = (
  listing: TcgPlayerListingWithMyStore
): ListingWithMyStore => {
  const {
    "My Store Reserve Quantity": myStoreReserveQuantity,
    "My Store Price": myStorePrice,
    ...raw
  } = listing;

  return {
    ...mapTcgPlayerListingToListing(raw),
    myStoreReserveQuantity: parseInt(myStoreReserveQuantity, 10),
    myStorePrice: parseFloat(myStorePrice),
    currentMyStorePrice: parseFloat(myStorePrice),
  };
};

export const filteredListing = (
  filterScript: string,
  listing: ListingWithMyStore
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

const normalizeListingWithMyStore = (listing: ListingWithMyStore): void => {
  normalizeListing(listing);
  listing.myStoreReserveQuantity = roundTo(listing.myStoreReserveQuantity, 0);
  listing.myStorePrice = roundTo(listing.myStorePrice, 2);
  listing.currentMyStorePrice = roundTo(listing.currentMyStorePrice, 2);
};

export const updateListingWithMyStore = (
  script: string,
  listing: ListingWithMyStore
): void => {
  try {
    const func = new Function("listing", `with (listing) { ${script} }`);
    func(listing);
    normalizeListingWithMyStore(listing);
  } catch (error) {
    listing.error =
      error instanceof Error ? error.message : "Error in calculation script";
    console.error("Error in calculation script:", error, script);
  }
};

export const updateListingWithMyStoreTotals = (
  totals: ListingWithMyStoreTotals,
  listing: ListingWithMyStore
): void => {
  updateListingTotals(totals, listing);
  const myStoryQuantity = listing.myStoreReserveQuantity || 0;
  totals.myStoreReserveQuantity += myStoryQuantity;
  totals.myStorePrice += listing.myStorePrice || 0 * myStoryQuantity;
  totals.currentMyStorePrice +=
    listing.currentMyStorePrice || 0 * myStoryQuantity;
};

export const mapListingToTcgPlayerListingWithMyStore = (
  listing: ListingWithMyStore
): TcgPlayerListingWithMyStore => {
  return {
    ...mapListingToTcgPlayerListing(listing),
    "My Store Reserve Quantity": isNaN(listing.myStoreReserveQuantity)
      ? ""
      : listing.myStoreReserveQuantity.toFixed(0),
    "My Store Price": isNaN(listing.myStorePrice)
      ? ""
      : listing.myStorePrice.toFixed(2),
  };
};

const listingVariablesWithMyStore: Autocompletion<ListingWithMyStore>[] = [
  ...listingVariables,
  {
    label: "myStoreReserveQuantity",
    type: "variable",
    info: "My Store Reserve Quantity",
  },
  {
    label: "myStorePrice",
    type: "variable",
    info: "My Store Price",
  },
  {
    label: "currentMyStorePrice",
    type: "variable",
    info: "Current My Store Price",
  },
];

export const listingWithMyStoreAutocomplete = completeFromList(
  listingVariablesWithMyStore
);
