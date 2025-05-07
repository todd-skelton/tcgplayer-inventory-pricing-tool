import React from "react";
import {
  defaultBuylistingInventory,
  mapTcgPlayerBuylistingToBuylisting,
  mapBuylistingToTcgPlayerBuylisting,
  updateBuylistingTotals,
  initializeBuylistingTotals,
  buylistingAutocomplete,
  updateBuylisting,
  filteredListing,
} from "./TcgPlayerBuylisting";
import InventoryTool from "../InventoryTool";
import { ProductLineSetTableCell } from "../_components/ProductLineSetTableCell";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import NumberFormattedTableCell from "../_components/NumberFormattedTableCell";
import TableHeaderWithSummary from "../_components/TableHeaderWithSummary";
import {
  changeCurrencyFormatter,
  changePercentageFormatter,
  currencyFormatter,
  quantityFormatter,
} from "../formatters";
import { ProductTableCell } from "../_components/ProductTableCell";

export const defaultPrefilterScript = `// comment: remove anything not in stock
return addToBuylistQuantity > 0 || buylistQuantity > 0;`;

export const defaultUpdateListingScript = `const percent = 0.85;

if (buylistMarketPrice && buylistHighPrice) 
  myBuylistPrice = Math.min(buylistMarketPrice * percent, buylistHighPrice * percent);

else if (buylistMarketPrice) myBuylistPrice = Math.min(tcgMarketPrice * percent);

else if (buylistHighPrice) myBuylistPrice = Math.min(buylistHighPrice * percent);

else myBuylistPrice = currentBuylistPrice;`;

export const defaultPostfilterScript = `// comment: remove anything without a price change
return myBuylistPrice !== currentBuylistPrice;`;

export default function Buylistings() {
  return (
    <InventoryTool
      defaultInventory={defaultBuylistingInventory}
      defaultUpdateListingScript={defaultUpdateListingScript}
      defaultPrefilterScript={defaultPrefilterScript}
      defaultPostfilterScript={defaultPostfilterScript}
      completionSource={buylistingAutocomplete}
      mapRawToListing={mapTcgPlayerBuylistingToBuylisting}
      mapListingToRaw={mapBuylistingToTcgPlayerBuylisting}
      updateListing={updateBuylisting}
      updateListingTotals={updateBuylistingTotals}
      filteredListing={filteredListing}
      initializeTotals={initializeBuylistingTotals}
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
                  value={totals.buylistMarketPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="High"
                  value={totals.buylistHighPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Qty"
                  value={totals.buylistQuantity}
                  format={quantityFormatter}
                />
                <TableHeaderWithSummary
                  header="Current"
                  value={totals.currentBuylistPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="New"
                  value={totals.myBuylistPrice}
                  format={currencyFormatter}
                />
                <TableHeaderWithSummary
                  header="Δ&nbsp;($)"
                  value={totals.myBuylistPrice - totals.buylistHighPrice}
                  format={changeCurrencyFormatter}
                  deltaHighlighted
                />
                <TableHeaderWithSummary
                  header="Δ&nbsp;(%)"
                  value={
                    (totals.myBuylistPrice - totals.buylistHighPrice) /
                    totals.buylistHighPrice
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
                  buylistMarketPrice,
                  buylistHighPrice,
                  buylistQuantity,
                  myBuylistPrice,
                  currentBuylistPrice,
                  error,
                }) => (
                  <TableRow key={tcgPlayerId}>
                    {error ? (
                      <TableCell colSpan={2} style={{ color: "red" }}>
                        {error}
                      </TableCell>
                    ) : (
                      <>
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
                          maxWidth="250px"
                          title={""}
                        />
                      </>
                    )}
                    <NumberFormattedTableCell
                      value={buylistMarketPrice}
                      format={currencyFormatter}
                    />
                    <NumberFormattedTableCell
                      value={buylistHighPrice}
                      format={currencyFormatter}
                    />
                    <NumberFormattedTableCell
                      value={buylistQuantity}
                      format={quantityFormatter}
                    />
                    <NumberFormattedTableCell
                      value={currentBuylistPrice}
                      format={currencyFormatter}
                    />
                    <NumberFormattedTableCell
                      value={myBuylistPrice}
                      format={currencyFormatter}
                    />
                    <NumberFormattedTableCell
                      value={myBuylistPrice - buylistHighPrice}
                      format={changeCurrencyFormatter}
                      deltaHighlighted
                    />
                    <NumberFormattedTableCell
                      value={
                        (myBuylistPrice - buylistHighPrice) / buylistHighPrice
                      }
                      format={changePercentageFormatter}
                      deltaHighlighted
                    />
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )
      }
    </InventoryTool>
  );
}
