import type { Route } from "./+types/home";
import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tooltip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Papa from "papaparse";
import { useLocalStorageState } from "~/hooks/useLocalStorageState";

interface TCGData {
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
  "Current Price": string;
}

const myScript = `
if (blp && mp) { return Math.max(1.05 * blp + 0.5 * blp ** (1 / 3), mp * (80 / 85)); }

if (mp) return mp * 1.25;

if (blp) return 1.05 * blp + 0.5 * blp ** (1 / 3);

return mpp;
`;

const defaultCalculationScript = `
const floor = 0.15, percent = 1.15;

if (mp && lp) { return Math.max(mp * percent, lp * percent, floor); }

if (mp) { return Math.max(mp * percent, floor); }

if (lp) { return Math.max(lp * percent, floor); }

return mpp;
`;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TCGplayer Inventory Pricing Tool" }, // Updated title
    {
      name: "description",
      content: "Manage and update your TCGplayer inventory pricing.",
    },
  ];
}

const calculateNewPrice = (
  calculationScript: string,
  tcgMarketPrice: number,
  tcgLowPriceWithShipping: number,
  tcgLowPrice: number,
  tcgMarketPlacePrice: number,
  totalQuantity: number,
  condition: string,
  productName: string,
  rarity: string,
  number: string,
  setName: string,
  productLine: string
): number => {
  const bestLowPrice =
    tcgLowPriceWithShipping > 4.99
      ? tcgLowPriceWithShipping
      : tcgLowPriceWithShipping - 1.31;
  try {
    const func = new Function(
      "mp",
      "lps",
      "lp",
      "mpp",
      "blp",
      "q",
      "c",
      "p",
      "r",
      "n",
      "s",
      "l",
      calculationScript
    );
    return func(
      tcgMarketPrice,
      tcgLowPriceWithShipping,
      tcgLowPrice,
      tcgMarketPlacePrice,
      bestLowPrice,
      totalQuantity,
      condition,
      productName,
      rarity,
      number,
      setName,
      productLine
    );
  } catch (error) {
    console.error("Error in calculation script:", error);
    return NaN;
  }
};

function mapNewPriceToRow(row: TCGData, calculationScript: string): TCGData {
  const currentPrice = parseFloat(row["TCG Marketplace Price"]);
  const newPrice = calculateNewPrice(
    calculationScript,
    parseFloat(row["TCG Market Price"]),
    parseFloat(row["TCG Low Price With Shipping"]),
    parseFloat(row["TCG Low Price"]),
    currentPrice,
    parseFloat(row["Total Quantity"]),
    row["Condition"],
    row["Product Name"],
    row["Rarity"],
    row["Number"],
    row["Set Name"],
    row["Product Line"]
  );

  return {
    ...row,
    "Current Price": currentPrice.toFixed(2) || "",
    "TCG Marketplace Price": newPrice?.toFixed(2) || "",
  };
}

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<TCGData[]>([]);
  const [calculationScript, setCalculationScript] =
    useLocalStorageState<string>("calculationScript", defaultCalculationScript);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useLocalStorageState(
    "rowsPerPage",
    250
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleHelpDialogOpen = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpDialogClose = () => {
    setHelpDialogOpen(false);
  };

  const handleClearDataset = () => {
    setData([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newData: TCGData[] = [];
      Papa.parse<TCGData>(file, {
        header: true,
        skipEmptyLines: true,
        step: (row) => {
          const parsedRow = row.data;
          if (parsedRow["Total Quantity"] !== "0") {
            newData.push(
              mapNewPriceToRow(
                parsedRow,
                calculationScript || defaultCalculationScript
              )
            );
          }
        },
        complete: () => {
          setData(newData);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const calculateTotals = () => {
    const totals = {
      totalQuantity: 0,
      tcgMarketPrice: 0,
      tcgLowPriceWithShipping: 0,
      tcgLowPrice: 0,
      tcgMarketplacePrice: 0,
      tcgCurrentPrice: 0,
      totalChange: 0, // Add totalChange
    };

    data.forEach((row) => {
      const quantity = parseFloat(row["Total Quantity"]) || 0;
      totals.totalQuantity += quantity;
      totals.tcgMarketPrice +=
        quantity * parseFloat(row["TCG Market Price"]) || 0;
      totals.tcgLowPriceWithShipping +=
        quantity * parseFloat(row["TCG Low Price With Shipping"]) || 0;
      totals.tcgLowPrice += quantity * parseFloat(row["TCG Low Price"]) || 0;
      totals.tcgMarketplacePrice +=
        quantity * parseFloat(row["TCG Marketplace Price"]) || 0;
      totals.tcgCurrentPrice +=
        quantity * parseFloat(row["Current Price"]) || 0;
    });

    // Calculate totalChange
    totals.totalChange = totals.tcgMarketplacePrice - totals.tcgCurrentPrice;

    return totals;
  };

  const totals = React.useMemo(() => calculateTotals(), [data]);

  const handleDownloadCSV = () => {
    const filteredData = data.map(({ "Current Price": _, ...rest }) => rest); // Remove "Old Price"
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tcgplayer_pricing_update_${new Date()
      .toISOString()
      .replace(/[:T-]/g, ".")}.csv`;
    link.click();
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Stack spacing={2}>
      <Container sx={{ alignSelf: "center" }}>
        <Stack spacing={2}>
          <Typography variant="h4">TCGplayer Iventory Pricing Tool</Typography>
          <Stack spacing={2} direction="row">
            <Button variant="outlined" onClick={handleHelpDialogOpen}>
              View Script Help
            </Button>
            <Button
              variant="outlined"
              component="a"
              href="/inventory-pricing-tool-guide.gif"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Workflow Guide
            </Button>
          </Stack>
          <TextField
            label="Calculation Script"
            spellCheck="false"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                style: {
                  fontFamily: "monospace",
                },
              },
            }}
            placeholder="Enter your calculation script here"
            multiline
            fullWidth
            value={calculationScript}
            onChange={(e) => setCalculationScript(e.target.value)}
            variant="outlined"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reset height to auto to calculate the new height
              target.style.height = `${target.scrollHeight}px`; // Set height to match content
            }}
            disabled={data.length > 0} // Disable when data is loaded
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" component="label">
              Upload Inventory Export
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadCSV}
            >
              Download Update CSV
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearDataset} // Call the clear dataset handler
            >
              Clear Dataset
            </Button>
          </Stack>
        </Stack>
      </Container>
      {data.length > 0 && (
        <>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  Product&nbsp;Line&nbsp;(l):&nbsp;Set&nbsp;(s)
                </TableCell>
                <TableCell>
                  Product&nbsp;(p)&nbsp;-&nbsp;Number&nbsp;(n)&nbsp;-&nbsp;Rarity&nbsp;(r)&nbsp;-&nbsp;Condition&nbsp;(c)
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Market&nbsp;(mp)
                  <br />
                  {isNaN(totals.tcgMarketPrice)
                    ? ""
                    : currencyFormatter.format(totals.tcgMarketPrice)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Low+Shipping&nbsp;(lps)
                  <br />
                  {isNaN(totals.tcgLowPriceWithShipping)
                    ? ""
                    : currencyFormatter.format(totals.tcgLowPriceWithShipping)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Low&nbsp;(lp)
                  <br />
                  {isNaN(totals.tcgLowPrice)
                    ? ""
                    : currencyFormatter.format(totals.tcgLowPrice)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Qty&nbsp;(q)
                  <br />
                  {isNaN(totals.totalQuantity) ? "" : totals.totalQuantity}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Current&nbsp;(mpp)
                  <br />
                  {isNaN(totals.tcgCurrentPrice)
                    ? ""
                    : currencyFormatter.format(totals.tcgCurrentPrice)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  New
                  <br />
                  {isNaN(totals.tcgMarketplacePrice)
                    ? ""
                    : currencyFormatter.format(totals.tcgMarketplacePrice)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Δ&nbsp;($)
                  <br />
                  <Typography
                    variant="body2"
                    style={{
                      color:
                        totals.totalChange > 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {isNaN(totals.totalChange)
                      ? ""
                      : totals.totalChange > 0
                      ? "+" + currencyFormatter.format(totals.totalChange)
                      : currencyFormatter.format(totals.totalChange)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Δ&nbsp;(%)
                  <br />
                  <Typography
                    variant="body2"
                    style={{
                      color:
                        totals.totalChange > 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {isNaN(totals.totalChange) || totals.tcgCurrentPrice === 0
                      ? ""
                      : totals.totalChange > 0
                      ? "+" +
                        (
                          ((totals.tcgMarketplacePrice -
                            totals.tcgCurrentPrice) /
                            totals.tcgCurrentPrice) *
                          100
                        ).toFixed(2)
                      : (
                          ((totals.tcgMarketplacePrice -
                            totals.tcgCurrentPrice) /
                            totals.tcgCurrentPrice) *
                          100
                        ).toFixed(2)}
                    %
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(
                  page * (rowsPerPage ?? 250),
                  page * (rowsPerPage ?? 250) + (rowsPerPage ?? 250)
                )
                .map((row) => (
                  <TableRow key={row["TCGplayer Id"]}>
                    <TableCell>
                      {row["Product Line"]}: {row["Set Name"]}
                    </TableCell>
                    <TableCell>
                      {row["Product Name"] && `${row["Product Name"]} `}
                      {row["Number"] && `- ${row["Number"]} `}
                      {row["Rarity"] && `- ${row["Rarity"]} `}
                      {row["Condition"] && `- ${row["Condition"]}`}
                      {row["Title"] && (
                        <Tooltip title={row["Title"]} arrow>
                          <ImageIcon
                            sx={{
                              fontSize: "1rem",
                              verticalAlign: "middle",
                              marginLeft: "0.25rem",
                            }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["TCG Market Price"]))
                        ? ""
                        : currencyFormatter.format(
                            parseFloat(row["TCG Market Price"])
                          )}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["TCG Low Price With Shipping"]))
                        ? ""
                        : currencyFormatter.format(
                            parseFloat(row["TCG Low Price With Shipping"])
                          )}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["TCG Low Price"]))
                        ? ""
                        : currencyFormatter.format(
                            parseFloat(row["TCG Low Price"])
                          )}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["Total Quantity"]))
                        ? ""
                        : row["Total Quantity"]}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["Current Price"]))
                        ? ""
                        : currencyFormatter.format(
                            parseFloat(row["Current Price"])
                          )}
                    </TableCell>
                    <TableCell align="right">
                      {isNaN(parseFloat(row["TCG Marketplace Price"]))
                        ? ""
                        : currencyFormatter.format(
                            parseFloat(row["TCG Marketplace Price"])
                          )}
                    </TableCell>

                    {(() => {
                      const marketplacePrice = parseFloat(
                        row["TCG Marketplace Price"]
                      );
                      const currentPrice = parseFloat(row["Current Price"]);
                      const priceDifference = marketplacePrice - currentPrice;
                      const percentageChange =
                        (priceDifference / currentPrice) * 100;
                      return (
                        <>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  priceDifference > 0
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                              }}
                            >
                              {isNaN(priceDifference)
                                ? ""
                                : priceDifference > 0
                                ? "+" +
                                  currencyFormatter.format(priceDifference)
                                : currencyFormatter.format(priceDifference)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  priceDifference > 0
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                              }}
                            >
                              {isNaN(priceDifference) || currentPrice === 0
                                ? ""
                                : priceDifference > 0
                                ? "+" + percentageChange.toFixed(2)
                                : percentageChange.toFixed(2)}
                              %
                            </Typography>
                          </TableCell>
                        </>
                      );
                    })()}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[100, 250, 500, 1000]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage ?? 250}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Dialog open={helpDialogOpen} onClose={handleHelpDialogClose}>
        <DialogTitle>Calculation Script Help</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            To upload your inventory, go to the pricing tab in the seller portal
            on TCG Player and press the "Export from Live" button to download
            all rows. Use this file as the input for the tool.
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can use the calculation script to define how new prices are
            calculated for your inventory. The script is evaluated dynamically,
            and you can use the following variables:
          </Typography>
          <Typography component="dl" gutterBottom>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              mp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              TCG Market Price
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              lps
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              TCG Low Price With Shipping
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              lp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              TCG Low Price
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              mpp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              TCG Marketplace Price (current price)
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              blp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              The best low price, calculated as described in the code.
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              q
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Total Quantity
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              c
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Condition
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              p
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Product Name
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              r
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Rarity
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              n
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Number
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              s
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Set Name
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              l
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Product Line
            </Typography>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your script should return the new price as a number.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The default calculation script determines the new price by applying
            a 15% increase to the TCG Market Price (mp) and/or the TCG Low Price
            (lp), ensuring the result is no less than a minimum floor price of
            $0.15. If both mp and lp are available, the higher of the two
            adjusted prices is used. If only one of mp or lp is available, the
            adjusted value of that price is used. If neither mp nor lp is
            available, the current TCG Marketplace Price (mpp) is returned as
            the fallback.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
