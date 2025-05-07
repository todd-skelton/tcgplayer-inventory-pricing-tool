import React from "react";
import {
  defaultListingInventory,
  mapTcgPlayerListingToListing,
  mapListingToTcgPlayerListing,
  updateListingTotals,
  initializeListingTotals,
  listingAutocomplete,
  updateListing,
  filteredListing,
} from "./TcgPlayerListing";
import InventoryTool from "../InventoryTool";
import { ProductLineSetTableCell } from "../_components/ProductLineSetTableCell";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import NumberFormattedTableCell from "~/routes/home/inventory/_components/NumberFormattedTableCell";
import TableHeaderWithSummary from "~/routes/home/inventory/_components/TableHeaderWithSummary";
import {
  changeCurrencyFormatter,
  changePercentageFormatter,
  currencyFormatter,
  quantityFormatter,
} from "../formatters";
import { ProductTableCell } from "../_components/ProductTableCell";

export const defaultPrefilterScript = `// help: remove anything not in stock
return totalQuantity > 0 || addToQuantity > 0;`;

export const defaultUpdateListingScript = `// help: set a floor of 15 cents and a percent of 115%
const floor = 0.15, percent = 1.15;

// help: if the market price and low price are both available, use the higher of the two or the floor
if (tcgMarketPrice && tcgLowPrice) 
tcgMarketplacePrice = Math.max(tcgMarketPrice * percent, tcgLowPrice * percent, floor);

// help: if the market price is available, use it or the floor
else if (tcgMarketPrice) 
tcgMarketplacePrice = Math.max(tcgMarketPrice * percent, floor);

// help: if the low price is available, use it or the floor
else if (tcgLowPrice) 
tcgMarketplacePrice = Math.max(tcgLowPrice * percent, floor);

// help: otherwise, use the current marketplace price
else tcgMarketplacePrice = currentMarketplacePrice;`;

export const defaultPostfilterScript = `// help: remove anything without a price change
return tcgMarketplacePrice !== currentMarketplacePrice;`;

export default function Listings() {
  return (
    <InventoryTool
      defaultInventory={defaultListingInventory}
      defaultUpdateListingScript={defaultUpdateListingScript}
      defaultPrefilterScript={defaultPrefilterScript}
      defaultPostfilterScript={defaultPostfilterScript}
      completionSource={listingAutocomplete}
      mapRawToListing={mapTcgPlayerListingToListing}
      mapListingToRaw={mapListingToTcgPlayerListing}
      updateListing={updateListing}
      updateListingTotals={updateListingTotals}
      filteredListing={filteredListing}
      initializeTotals={initializeListingTotals}
    >
      {(totals, listings) =>
        listings.length > 0 && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Product&nbsp;Line:&nbsp;Set</TableCell>
                <TableCell>
                  Product&nbsp;-&nbsp;Number&nbsp;-&nbsp;Rarity&nbsp;-&nbsp;Condition
                </TableCell>
                <TableHeaderWithSummary
                  header="Market"
                  value={totals.tcgMarketPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Low+S"
                  value={totals.tcgLowPriceWithShipping}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Low"
                  value={totals.tcgLowPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Direct"
                  value={totals.tcgDirectLow}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Qty"
                  value={totals.totalQuantity}
                  format={quantityFormatter}
                />
                <TableHeaderWithSummary
                  header="Current"
                  value={totals.currentMarketplacePrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="New"
                  value={totals.tcgMarketplacePrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Δ&nbsp;($)"
                  value={
                    totals.tcgMarketplacePrice - totals.currentMarketplacePrice
                  }
                  format={changeCurrencyFormatter}
                  deltaHighlighted
                />
                <TableHeaderWithSummary
                  header="Δ&nbsp;(%)"
                  value={
                    (totals.tcgMarketplacePrice -
                      totals.currentMarketplacePrice) /
                    totals.currentMarketplacePrice
                  }
                  format={changePercentageFormatter}
                  deltaHighlighted
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map(
                ({
                  tcgPlayerId,
                  productLine,
                  setName,
                  productName,
                  number,
                  rarity,
                  condition,
                  title,
                  tcgMarketplacePrice,
                  currentMarketplacePrice,
                  tcgMarketPrice,
                  tcgDirectLow,
                  tcgLowPrice,
                  tcgLowPriceWithShipping,
                  totalQuantity,
                }) => {
                  const priceDifference =
                    tcgMarketplacePrice - currentMarketplacePrice;
                  const percentageChange =
                    priceDifference / currentMarketplacePrice;

                  return (
                    <TableRow key={tcgPlayerId}>
                      <ProductLineSetTableCell
                        productLine={productLine}
                        setName={setName}
                        maxWidth="150px"
                      />
                      <ProductTableCell
                        productName={productName}
                        number={number}
                        rarity={rarity}
                        condition={condition}
                        title={title}
                        maxWidth="250px"
                      />
                      <NumberFormattedTableCell
                        value={tcgMarketPrice}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={tcgLowPriceWithShipping}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={tcgLowPrice}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={tcgDirectLow}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={totalQuantity}
                        format={quantityFormatter}
                      />
                      <NumberFormattedTableCell
                        value={currentMarketplacePrice}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={tcgMarketplacePrice}
                        format={currencyFormatter}
                      />
                      <NumberFormattedTableCell
                        value={priceDifference}
                        format={changeCurrencyFormatter}
                        deltaHighlighted
                      />
                      <NumberFormattedTableCell
                        value={percentageChange}
                        format={changePercentageFormatter}
                        deltaHighlighted
                      />
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        )
      }
    </InventoryTool>
  );
}
