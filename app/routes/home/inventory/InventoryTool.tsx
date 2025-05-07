import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  Stack,
  TablePagination,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Papa from "papaparse";
import { useLocalStorageState } from "~/hooks/useLocalStorageState";
import CodeMirror from "@uiw/react-codemirror";
import {
  autocompletion,
  type CompletionSource,
} from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { type Inventory } from "./Inventory.type";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export type InventoryToolProps<TType, TListing, TTotals, TRawListing> = {
  defaultInventory: Inventory<TType, TListing, TTotals>;
  defaultUpdateListingScript: string;
  defaultPrefilterScript: string;
  defaultPostfilterScript: string;
  completionSource: CompletionSource;
  mapRawToListing: (rawListing: TRawListing) => TListing;
  mapListingToRaw: (listing: TListing) => TRawListing;
  updateListing: (updateScript: string, listing: TListing) => void;
  updateListingTotals: (totals: TTotals, listing: TListing) => void;
  filteredListing: (filterScript: string, listing: TListing) => boolean;
  initializeTotals: () => TTotals;
  children: (totals: TTotals, pagedListings: TListing[]) => React.ReactNode;
};

export default function InventoryTool<TType, TListing, TTotals, TRawListing>({
  defaultInventory,
  defaultUpdateListingScript,
  defaultPrefilterScript,
  defaultPostfilterScript,
  completionSource,
  mapRawToListing,
  mapListingToRaw,
  updateListing,
  updateListingTotals,
  filteredListing,
  initializeTotals,
  children,
}: InventoryToolProps<TType, TListing, TTotals, TRawListing>) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDarkMode ? "dark" : "light";

  const [inventory, setInventory] =
    useState<Inventory<TType, TListing, TTotals>>(defaultInventory);

  const [updateListingScript, setUpdateListingScript] =
    useLocalStorageState<string>(
      `${inventory.type}_updateListingScript`,
      defaultUpdateListingScript
    );

  const [prefilterScript, setPrefilterScript] = useLocalStorageState<string>(
    `${inventory.type}_prefilterScript`,
    defaultPrefilterScript
  );

  const [postfilterScript, setPostfilterScript] = useLocalStorageState<string>(
    `${inventory.type}_postfilterScript`,
    defaultPostfilterScript
  );

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useLocalStorageState(
    "rowsPerPage",
    250
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scriptsVisible, setScriptsVisible] = useState(true);

  const toggleScriptsVisibility = () => {
    setScriptsVisible((prev) => !prev);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearDataset = () => {
    setInventory(defaultInventory);
    setScriptsVisible(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const listings: TListing[] = [];
    const totals: TTotals = initializeTotals();
    Papa.parse<TRawListing>(file, {
      header: true,
      skipEmptyLines: true,
      step: (row) => {
        const listing = mapRawToListing(row.data);
        if (!filteredListing(prefilterScript, listing)) return;
        updateListing(updateListingScript, listing);
        updateListingTotals(totals, listing);
        if (!filteredListing(postfilterScript, listing)) return;
        listings.push(listing);
      },
      complete: () => {
        setPage(0);
        setInventory({
          type: defaultInventory.type,
          listings,
          totals,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setScriptsVisible(false);
      },
    });
  };

  const handleDownloadCSV = () => {
    const filteredData = inventory.listings.map(mapListingToRaw);
    const csv = Papa.unparse<TRawListing>(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tcgplayer_listing_update_${new Date()
      .toISOString()
      .replace(/[:T-]/g, ".")}.csv`;
    link.click();
  };

  const handleResetToDefault = () => {
    setUpdateListingScript(defaultUpdateListingScript);
    setPrefilterScript(defaultPrefilterScript);
    setPostfilterScript(defaultPostfilterScript);
    setScriptsVisible(true);
    setInventory(defaultInventory);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { listings, totals } = inventory;

  const memoizedChildren = React.useMemo(() => {
    return children(
      totals,
      inventory.listings.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    );
  }, [totals, listings, page, rowsPerPage, children]);

  return (
    <Stack spacing={2}>
      <Container sx={{ alignSelf: "center" }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<UploadFileIcon />}
            >
              Process CSV
              <input
                type="file"
                accept=".csv"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadCSV}
              disabled={listings.length === 0}
              startIcon={<DownloadIcon />}
            >
              Download Updated CSV
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearDataset}
              disabled={listings.length === 0}
              startIcon={<ClearIcon />}
            >
              Clear Dataset
            </Button>
            <Button
              color="error"
              onClick={handleResetToDefault}
              startIcon={<RestartAltIcon />}
            >
              Reset to Default
            </Button>
            <Button
              color="inherit"
              onClick={toggleScriptsVisibility}
              startIcon={
                scriptsVisible ? <VisibilityOffIcon /> : <VisibilityIcon />
              }
            >
              {scriptsVisible ? "Hide Scripts" : "Show Scripts"}
            </Button>
          </Stack>
          {scriptsVisible && (
            <>
              <Typography variant="h6">Pre-filter Script</Typography>
              <CodeMirror
                value={prefilterScript}
                extensions={[
                  javascript(),
                  autocompletion({
                    override: [completionSource],
                  }),
                ]}
                theme={mode}
                onChange={(value) => setPrefilterScript(value)}
              />
              <Typography variant="h6">Update Script</Typography>
              <CodeMirror
                value={updateListingScript}
                extensions={[
                  javascript(),
                  autocompletion({
                    override: [completionSource],
                  }),
                ]}
                theme={mode}
                onChange={(value) => setUpdateListingScript(value)}
              />
              <Typography variant="h6">Post-filter Script</Typography>
              <CodeMirror
                value={postfilterScript}
                extensions={[
                  javascript(),
                  autocompletion({
                    override: [completionSource],
                  }),
                ]}
                theme={mode}
                onChange={(value) => setPostfilterScript(value)}
              />
            </>
          )}
        </Stack>
      </Container>
      {listings.length > 0 && (
        <>
          {memoizedChildren}
          <TablePagination
            rowsPerPageOptions={[100, 250, 500, 1000]}
            count={inventory.listings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Stack>
  );
}
