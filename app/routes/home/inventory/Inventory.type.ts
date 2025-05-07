export type Inventory<TType, TListing, TTotal> = {
  type: TType;
  listings: TListing[];
  totals: TTotal;
};
