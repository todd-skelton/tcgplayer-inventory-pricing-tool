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
  AppBar,
  Toolbar,
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
  ParsedCondition: string;
  Printing: string;
}

const myScript = `if (blp && mp) return Math.max(1.05 * blp + 0.5 * blp ** (1 / 3), mp * (80 / 85));

if (mp) return mp * 1.25;

if (blp) return 1.05 * blp + 0.5 * blp ** (1 / 3);

return mpp;`;

const defaultCalculationScript = `const floor = 0.15, percent = 1.15;

if (mp && lp) return Math.max(mp * percent, lp * percent, floor);

if (mp) return Math.max(mp * percent, floor);

if (lp) return Math.max(lp * percent, floor);

return mpp;`;

const defaultPrefilterScript = `// only include in the calculation when qty or add to qty is over 0
return q > 0 || aq > 0;`;

const defaultPostfilterScript = `// only include in the output when new price not the same as current price or add to qty is over 0
return mpp !== cp || aq > 0;`;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TCGplayer Inventory Pricing Tool" }, // Updated title
    {
      name: "description",
      content: "Manage and update your TCGplayer inventory pricing.",
    },
  ];
}

const prefiltered = (prefilterScript: string, row: TCGData): boolean => {
  const tcgMarketPrice = parseFloat(row["TCG Market Price"]);
  const tcgLowPriceWithShipping = parseFloat(
    row["TCG Low Price With Shipping"]
  );
  const tcgLowPrice = parseFloat(row["TCG Low Price"]);
  const tcgDirectLow = parseFloat(row["TCG Direct Low"]);
  const tcgMarketPlacePrice = parseFloat(row["TCG Marketplace Price"]);
  const totalQuantity = parseFloat(row["Total Quantity"]);
  const addToQuantity = parseFloat(row["Add to Quantity"]);
  const condition = row["Condition"];
  const productName = row["Product Name"];
  const rarity = row["Rarity"];
  const number = row["Number"];
  const setName = row["Set Name"];
  const productLine = row["Product Line"];

  const bestLowPrice =
    tcgLowPriceWithShipping > 4.99
      ? tcgLowPriceWithShipping
      : tcgLowPriceWithShipping - 1.31;

  try {
    const func = new Function(
      "mp",
      "lps",
      "lp",
      "dlp",
      "mpp",
      "blp",
      "q",
      "c",
      "p",
      "r",
      "n",
      "s",
      "l",
      "aq",
      prefilterScript
    );
    return func(
      tcgMarketPrice,
      tcgLowPriceWithShipping,
      tcgLowPrice,
      tcgDirectLow,
      tcgMarketPlacePrice,
      bestLowPrice,
      totalQuantity,
      condition,
      productName,
      rarity,
      number,
      setName,
      productLine,
      addToQuantity
    );
  } catch (error) {
    console.error("Error in filter script:", error);
    return false;
  }
};

const calculateNewPrice = (calculationScript: string, row: TCGData): number => {
  const tcgMarketPrice = parseFloat(row["TCG Market Price"]);
  const tcgLowPriceWithShipping = parseFloat(
    row["TCG Low Price With Shipping"]
  );
  const tcgLowPrice = parseFloat(row["TCG Low Price"]);
  const tcgDirectLow = parseFloat(row["TCG Direct Low"]);
  const tcgMarketPlacePrice = parseFloat(row["TCG Marketplace Price"]);
  const totalQuantity = parseFloat(row["Total Quantity"]);
  const addToQuantity = parseFloat(row["Add to Quantity"]);
  const condition = row["Condition"];
  const productName = row["Product Name"];
  const rarity = row["Rarity"];
  const number = row["Number"];
  const setName = row["Set Name"];
  const productLine = row["Product Line"];

  const bestLowPrice =
    tcgLowPriceWithShipping > 4.99
      ? tcgLowPriceWithShipping
      : tcgLowPriceWithShipping - 1.31;

  try {
    const func = new Function(
      "mp",
      "lps",
      "lp",
      "dlp",
      "mpp",
      "blp",
      "q",
      "c",
      "p",
      "r",
      "n",
      "s",
      "l",
      "aq",
      calculationScript
    );
    return func(
      tcgMarketPrice,
      tcgLowPriceWithShipping,
      tcgLowPrice,
      tcgDirectLow,
      tcgMarketPlacePrice,
      bestLowPrice,
      totalQuantity,
      condition,
      productName,
      rarity,
      number,
      setName,
      productLine,
      addToQuantity
    );
  } catch (error) {
    console.error("Error in calculation script:", error);
    return NaN;
  }
};

const postfiltered = (postfilterScript: string, row: TCGData): boolean => {
  const tcgMarketPrice = parseFloat(row["TCG Market Price"]);
  const tcgLowPriceWithShipping = parseFloat(
    row["TCG Low Price With Shipping"]
  );
  const tcgLowPrice = parseFloat(row["TCG Low Price"]);
  const tcgDirectLow = parseFloat(row["TCG Direct Low"]);
  const tcgMarketPlacePrice = parseFloat(row["TCG Marketplace Price"]);
  const totalQuantity = parseFloat(row["Total Quantity"]);
  const addToQuantity = parseFloat(row["Add to Quantity"]);
  const condition = row["Condition"];
  const productName = row["Product Name"];
  const rarity = row["Rarity"];
  const number = row["Number"];
  const setName = row["Set Name"];
  const productLine = row["Product Line"];
  const currentPrice = parseFloat(row["Current Price"]);

  const bestLowPrice =
    tcgLowPriceWithShipping > 4.99
      ? tcgLowPriceWithShipping
      : tcgLowPriceWithShipping - 1.31;

  try {
    const func = new Function(
      "mp",
      "lps",
      "lp",
      "dlp",
      "mpp",
      "blp",
      "q",
      "c",
      "p",
      "r",
      "n",
      "s",
      "l",
      "cp",
      "aq",
      postfilterScript
    );
    return func(
      tcgMarketPrice,
      tcgLowPriceWithShipping,
      tcgLowPrice,
      tcgDirectLow,
      tcgMarketPlacePrice,
      bestLowPrice,
      totalQuantity,
      condition,
      productName,
      rarity,
      number,
      setName,
      productLine,
      currentPrice,
      addToQuantity
    );
  } catch (error) {
    console.error("Error in filter script:", error);
    return false;
  }
};

function applyPriceScript(row: TCGData, calculationScript: string): TCGData {
  const currentPrice = parseFloat(row["TCG Marketplace Price"]);
  const newPrice = calculateNewPrice(calculationScript, row);

  const validConditions = [
    "Near Mint",
    "Lightly Played",
    "Moderately Played",
    "Heavily Played",
    "Damaged",
    "Unopened",
  ];

  const condition =
    validConditions.find((c) => row["Condition"].startsWith(c)) || "Unknown";

  const printing = row["Condition"].substring(condition.length).trim();

  return {
    ...row,
    "Current Price": currentPrice.toFixed(2) || "",
    "TCG Marketplace Price": newPrice?.toFixed(2) || "",
    ParsedCondition: condition,
    Printing: printing,
  };
}

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<TCGData[]>([]);
  const [calculationScript, setCalculationScript] =
    useLocalStorageState<string>("calculationScript", defaultCalculationScript);
  const [prefilterScript, setPrefilterScript] = useLocalStorageState<string>(
    "prefilterScript",
    defaultPrefilterScript
  );
  const [postfilterScript, setPostfilterScript] = useLocalStorageState<string>(
    "postfilterScript",
    defaultPostfilterScript
  );
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useLocalStorageState(
    "rowsPerPage",
    250
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
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
          if (!prefiltered(prefilterScript, parsedRow)) return;

          const newPrice = applyPriceScript(parsedRow, calculationScript);

          if (!postfiltered(postfilterScript, newPrice)) return;

          newData.push(newPrice);
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
      tcgDirectLow: 0,
      tcgMarketplacePrice: 0,
      tcgCurrentPrice: 0,
      totalChange: 0,
      totalChangeFromMarket: 0,
    };

    data.forEach((row) => {
      const quantity = parseFloat(row["Total Quantity"]) || 0;
      totals.totalQuantity += quantity;
      totals.tcgMarketPrice +=
        quantity * parseFloat(row["TCG Market Price"]) || 0;
      totals.tcgLowPriceWithShipping +=
        quantity * parseFloat(row["TCG Low Price With Shipping"]) || 0;
      totals.tcgLowPrice += quantity * parseFloat(row["TCG Low Price"]) || 0;
      totals.tcgDirectLow += quantity * parseFloat(row["TCG Direct Low"]) || 0;
      totals.tcgMarketplacePrice +=
        quantity * parseFloat(row["TCG Marketplace Price"]) || 0;
      totals.tcgCurrentPrice +=
        quantity * parseFloat(row["Current Price"]) || 0;
    });

    // Calculate totalChange
    totals.totalChange = totals.tcgMarketplacePrice - totals.tcgCurrentPrice;
    totals.totalChangeFromMarket =
      totals.tcgMarketplacePrice - totals.tcgMarketPrice;

    return totals;
  };

  const totals = React.useMemo(() => calculateTotals(), [data]);

  const handleDownloadCSV = () => {
    const filteredData = data.map(
      ({ "Current Price": cp, ParsedCondition: pc, Printing: p, ...rest }) =>
        rest
    );
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

  const handleResetToDefault = () => {
    setCalculationScript(defaultCalculationScript);
    setPrefilterScript(defaultPrefilterScript);
    setPostfilterScript(defaultPostfilterScript);
    setData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Stack spacing={2}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TCGplayer Inventory Pricing Tool
          </Typography>
          <Button color="inherit" onClick={handleHelpDialogOpen}>
            View Script Help
          </Button>
          <Button
            color="inherit"
            component="a"
            href="/inventory-pricing-tool-guide.gif"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Workflow Guide
          </Button>
          <Button
            color="inherit"
            onClick={handleResetToDefault}
            disabled={data.length > 0}
          >
            Reset to Default
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ alignSelf: "center" }}>
        <Stack spacing={2}>
          <TextField
            label="Pre-filter Script"
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
            placeholder="Enter your pre-filter script here"
            multiline
            fullWidth
            value={prefilterScript}
            onChange={(e) => setPrefilterScript(e.target.value)}
            variant="outlined"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reset height to auto to calculate the new height
              target.style.height = `${target.scrollHeight}px`; // Set height to match content
            }}
            disabled={data.length > 0} // Disable when data is loaded
          />
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
          <TextField
            label="Post-filter Script"
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
            placeholder="Enter your post-filter script here"
            multiline
            fullWidth
            value={postfilterScript}
            onChange={(e) => setPostfilterScript(e.target.value)}
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
                  Mrkt&nbsp;(mp)
                  <br />
                  {isNaN(totals.tcgMarketPrice)
                    ? ""
                    : currencyFormatter.format(totals.tcgMarketPrice)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  L+S&nbsp;(lps)
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
                  Direct&nbsp;(dlp)
                  <br />
                  {isNaN(totals.tcgDirectLow)
                    ? ""
                    : currencyFormatter.format(totals.tcgDirectLow)}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Qty&nbsp;(q)
                  <br />
                  {isNaN(totals.totalQuantity) ? "" : totals.totalQuantity}
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Crnt&nbsp;(mpp)
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
                  <Tooltip
                    title={`Change from Market: ${
                      isNaN(totals.totalChangeFromMarket)
                        ? "N/A"
                        : currencyFormatter.format(totals.totalChangeFromMarket)
                    }`}
                    arrow
                  >
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
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ width: "0%" }}>
                  Δ&nbsp;(%)
                  <br />
                  <Tooltip
                    title={`Percent Change from Market: ${
                      isNaN(totals.totalChangeFromMarket) ||
                      totals.tcgMarketPrice === 0
                        ? "N/A"
                        : (
                            ((totals.tcgMarketplacePrice -
                              totals.tcgMarketPrice) /
                              totals.tcgMarketPrice) *
                            100
                          ).toFixed(2) + "%"
                    }`}
                    arrow
                  >
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
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(
                  page * (rowsPerPage ?? 250),
                  page * (rowsPerPage ?? 250) + (rowsPerPage ?? 250)
                )
                .map((row) => {
                  const marketplacePrice = parseFloat(
                    row["TCG Marketplace Price"]
                  );
                  const currentPrice = parseFloat(row["Current Price"]);
                  const priceDifference = marketplacePrice - currentPrice;
                  const percentageChange =
                    (priceDifference / currentPrice) * 100;

                  const formattedMarketPrice = isNaN(
                    parseFloat(row["TCG Market Price"])
                  )
                    ? ""
                    : currencyFormatter.format(
                        parseFloat(row["TCG Market Price"])
                      );

                  const formattedLowPriceWithShipping = isNaN(
                    parseFloat(row["TCG Low Price With Shipping"])
                  )
                    ? ""
                    : currencyFormatter.format(
                        parseFloat(row["TCG Low Price With Shipping"])
                      );

                  const formattedLowPrice = isNaN(
                    parseFloat(row["TCG Low Price"])
                  )
                    ? ""
                    : currencyFormatter.format(
                        parseFloat(row["TCG Low Price"])
                      );

                  const directLowPrice = parseFloat(row["TCG Direct Low"]);
                  const formattedDirectLowPrice = isNaN(directLowPrice)
                    ? ""
                    : currencyFormatter.format(directLowPrice);

                  const formattedTotalQuantity = isNaN(
                    parseFloat(row["Total Quantity"])
                  )
                    ? ""
                    : row["Total Quantity"];

                  const formattedCurrentPrice = isNaN(currentPrice)
                    ? ""
                    : currencyFormatter.format(currentPrice);

                  const formattedMarketplacePrice = isNaN(marketplacePrice)
                    ? ""
                    : currencyFormatter.format(marketplacePrice);

                  const formattedPriceDifference = isNaN(priceDifference)
                    ? ""
                    : priceDifference > 0
                    ? "+" + currencyFormatter.format(priceDifference)
                    : currencyFormatter.format(priceDifference);

                  const formattedPercentageChange =
                    isNaN(priceDifference) || currentPrice === 0
                      ? ""
                      : priceDifference > 0
                      ? "+" + percentageChange.toFixed(2)
                      : percentageChange.toFixed(2);

                  const priceDifferenceColor =
                    priceDifference > 0
                      ? theme.palette.success.main
                      : priceDifference < 0
                      ? theme.palette.error.main
                      : theme.palette.text.primary;

                  return (
                    <TableRow key={row["TCGplayer Id"]}>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        <span
                          title={`${row["Product Line"]}: ${row["Set Name"]}`}
                        >
                          {row["Product Line"]}: {row["Set Name"]}
                        </span>
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "250px",
                        }}
                      >
                        <span
                          title={`${row["Product Name"] || ""} ${
                            row["Number"] || ""
                          } ${row["Rarity"] || ""} ${row["Condition"] || ""}`}
                        >
                          {row["Title"] && (
                            <ImageIcon
                              sx={{
                                fontSize: "1rem",
                                verticalAlign: "middle",
                                marginLeft: "0.25rem",
                              }}
                              titleAccess={row["Title"]}
                            />
                          )}
                          {row["Product Name"] && `${row["Product Name"]} `}
                          {row["Number"] && `- ${row["Number"]} `}
                          {row["Rarity"] && `- ${row["Rarity"]} `}
                          {row["Condition"] && `- ${row["Condition"]}`}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        {formattedMarketPrice}
                      </TableCell>
                      <TableCell align="right">
                        {formattedLowPriceWithShipping}
                      </TableCell>
                      <TableCell align="right">{formattedLowPrice}</TableCell>
                      <TableCell align="right">
                        {formattedDirectLowPrice}
                      </TableCell>
                      <TableCell align="right">
                        {formattedTotalQuantity}
                      </TableCell>
                      <TableCell align="right">
                        {formattedCurrentPrice}
                      </TableCell>
                      <TableCell align="right">
                        {formattedMarketplacePrice}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          style={{
                            color: priceDifferenceColor,
                          }}
                        >
                          {formattedPriceDifference}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          style={{
                            color: priceDifferenceColor,
                          }}
                        >
                          {formattedPercentageChange}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              dlp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              TCG Direct Low
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
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              aq
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Add to Quantity
            </Typography>
            <Typography
              component="dt"
              variant="h6"
              style={{ fontFamily: "monospaced" }}
            >
              cp
            </Typography>
            <Typography component="dd" variant="body2" gutterBottom>
              Current Price
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
