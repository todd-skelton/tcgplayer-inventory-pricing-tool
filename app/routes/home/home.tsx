import type { Route } from "././+types/home";
import {
  Typography,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
  Tooltip,
  IconButton,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useLocalStorageState } from "~/hooks/useLocalStorageState";
import Listings from "./inventory/listing/Listings";
import ListingsWithMyStore from "./inventory/listingWithMyStore/ListingsWithMyStore";
import Buylistings from "./inventory/buylisting/Buylistings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TCGplayer Inventory Pricing Tool" },
    {
      name: "description",
      content: "Manage and update your TCGplayer inventory pricing.",
    },
  ];
}

type SupportedInventoryTypes =
  | "TcgPlayerListing"
  | "TcgPlayerListingWithMyStore"
  | "TcgPlayerBuylisting";

export default function Home() {
  const [inventoryType, setInventoryType] =
    useLocalStorageState<SupportedInventoryTypes>(
      "inventoryType",
      "TcgPlayerListing"
    );

  function handleInventoryTypeChange(
    event: SelectChangeEvent<
      "TcgPlayerListing" | "TcgPlayerListingWithMyStore" | "TcgPlayerBuylisting"
    >
  ): void {
    const type = event.target.value as SupportedInventoryTypes;
    setInventoryType(type);
  }

  function handleSaveSettings() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = Date.now();
    const fileName = `pricing-tool-settings-${timestamp}.json`;
    link.href = url;
    link.download = fileName;
    link.click();
  }

  function handleLoadSettings(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (typeof data === "object" && data !== null) {
          Object.keys(data).forEach((key) => {
            localStorage.setItem(key, data[key]);
          });
          window.location.reload(); // Reload to apply the settings
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Container sx={{ alignSelf: "center" }}>
        <Stack direction="row" spacing={2}>
          <FormControl size="small">
            <InputLabel id="inventory-type-select-label">
              Inventory Type
            </InputLabel>
            <Select
              labelId="inventory-type-select-label"
              id="inventory-type-select"
              label="Inventory Type"
              value={inventoryType}
              onChange={handleInventoryTypeChange}
            >
              <MenuItem value="TcgPlayerListing">TcgPlayer Inventory</MenuItem>
              <MenuItem value="TcgPlayerListingWithMyStore">
                TcgPlayer Inventory With My Store
              </MenuItem>
              <MenuItem value="TcgPlayerBuylisting">TcgPlayer Buylist</MenuItem>
            </Select>
          </FormControl>
          <Button
            color="inherit"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Scripts
          </Button>
          <Button
            color="inherit"
            component="label"
            startIcon={<UploadIcon />}
            onClick={handleSaveSettings}
          >
            Load Scripts
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleLoadSettings}
            />
          </Button>
        </Stack>
      </Container>
      {renderInventoryTool(inventoryType)}
    </>
  );
}

const renderInventoryTool = (inventoryType: SupportedInventoryTypes) => {
  switch (inventoryType) {
    case "TcgPlayerListing":
      return <Listings />;
    case "TcgPlayerListingWithMyStore":
      return <ListingsWithMyStore />;
    case "TcgPlayerBuylisting":
      return <Buylistings />;
    default:
      return <></>;
  }
};
