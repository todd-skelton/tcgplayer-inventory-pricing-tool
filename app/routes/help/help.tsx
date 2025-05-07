import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Code from "./_components/Code";

export default function Help() {
  const examplePrefilterScript = `// Example: Filter out listings with zero quantity\nreturn totalQuantity > 0;`;

  const exampleUpdateListingScript = `// Example: Set a minimum price of $0.50 and adjust based on market price\nconst minimumPrice = 0.50;\nif (tcgMarketPrice) {\n  tcgMarketplacePrice = Math.max(tcgMarketPrice * 1.1, minimumPrice);\n} else {\n  tcgMarketplacePrice = minimumPrice;\n}`;

  const examplePostfilterScript = `// Example: Only include listings where the new price differs from the current price\nreturn tcgMarketplacePrice !== currentMarketplacePrice;`;

  return (
    <Container maxWidth="lg" sx={{ alignSelf: "center" }}>
      <Typography variant="h3" gutterBottom>
        Help Documentation
      </Typography>

      <Typography variant="h5" gutterBottom>
        Overview
      </Typography>
      <Typography component="p" gutterBottom>
        The Inventory Tool helps manage and update your TCGplayer inventory
        pricing. You can upload CSV files, process them with custom scripts, and
        download updated CSV files.
      </Typography>

      <Typography variant="h5" gutterBottom>
        JavaScript Basics (For Beginners)
      </Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <strong>Comments:</strong> Anything after <Code>//</Code> is a note.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <strong>Variables:</strong> Store information. Example:{" "}
          <Code>let price = 1.00;</Code>
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <strong>Conditions:</strong> Check if something is true. Example:{" "}
          <Code>if (price &gt; 0.5) {"{ ... }"}</Code>
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <strong>Return:</strong> Tells the tool to include or exclude
          listings.
        </Typography>
      </ul>

      <Typography variant="h5" gutterBottom>
        Available Variables
      </Typography>
      <Typography variant="h6">TCGplayer Listing Variables</Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgPlayerId</Code>: TCGplayer Product ID
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>productLine</Code>: Product Line
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>setName</Code>: Set Name
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>productName</Code>: Product Name
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>title</Code>: Title
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>number</Code>: Card Number
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>rarity</Code>: Rarity
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>condition</Code>: Condition
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgMarketPrice</Code>: Market Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgDirectLow</Code>: Direct Low Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgLowPriceWithShipping</Code>: Low Price with Shipping
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgLowPrice</Code>: Low Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>totalQuantity</Code>: Total Quantity
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>addToQuantity</Code>: Quantity to Add
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgMarketplacePrice</Code>: Marketplace Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>currentMarketplacePrice</Code>: Current Marketplace Price
        </Typography>
      </ul>

      <Typography variant="h6">
        TCGplayer Listing with My Store Variables
      </Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          All variables from TCGplayer Listing
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>myStoreReserveQuantity</Code>: My Store Reserve Quantity
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>myStorePrice</Code>: My Store Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>currentMyStorePrice</Code>: Current My Store Price
        </Typography>
      </ul>

      <Typography variant="h6">TCGplayer Buylisting Variables</Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>tcgPlayerId</Code>: TCGplayer Product ID
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>productLine</Code>: Product Line
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>setName</Code>: Set Name
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>productName</Code>: Product Name
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>number</Code>: Card Number
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>rarity</Code>: Rarity
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>condition</Code>: Condition
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>buylistMarketPrice</Code>: Buylist Market Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>buylistHighPrice</Code>: Buylist High Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>buylistQuantity</Code>: Buylist Quantity
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>addToBuylistQuantity</Code>: Quantity to Add to Buylist
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>myBuylistPrice</Code>: My Buylist Price
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          <Code>pendingPurchaseQuantity</Code>: Pending Purchase Quantity
        </Typography>
      </ul>

      <Typography variant="h5" gutterBottom>
        Example Scripts
      </Typography>
      <Typography variant="h6" gutterBottom>
        Pre-filter Script
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={examplePrefilterScript}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Update Listing Script
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={exampleUpdateListingScript}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Post-filter Script
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={examplePostfilterScript}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h5" gutterBottom>
        AI Prompt Templates (For Beginners)
      </Typography>
      <Typography component="p" gutterBottom>
        When writing your prompt for the AI, make sure to include all the
        possible variables listed above and a sample script. This helps the AI
        understand the context and the variables it can manipulate to generate
        your desired script effectively.
      </Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          Create a script that sets the price to 10% above market price, minimum
          $0.75.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          Create a pre-filter script that excludes listings where the quantity
          is zero.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          Write an update script that sets the price to the market price or
          $1.00, whichever is higher.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          Write a post-filter script that keeps listings where the new price
          differs from the old price.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          Complex: Price 20% above market, minimum $1.50. Exclude quantity zero
          or market price below $0.25.
        </Typography>
      </ul>

      <Typography variant="h5" gutterBottom>
        Starter Script Library
      </Typography>

      <Typography variant="h6" gutterBottom>
        Pre-filter Scripts
      </Typography>
      <Typography gutterBottom>Exclude zero quantity listings</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`return totalQuantity > 0;`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography gutterBottom>
        Exclude listings below $1 market price
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`return tcgMarketPrice >= 1;`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h6">Update Listing Scripts</Typography>
      <Typography gutterBottom>
        Price 10% above market, never below $0.75
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`if (tcgMarketPrice) {\n  tcgMarketplacePrice = Math.max(tcgMarketPrice * 1.1, 0.75);\n} else {\n  tcgMarketplacePrice = 0.75;\n}`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography>Price exactly at market, fallback to $0.50</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`if (tcgMarketPrice) {\n  tcgMarketplacePrice = tcgMarketPrice;\n} else {\n  tcgMarketplacePrice = 0.50;\n}`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography>Increase all prices by 5%</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`if (tcgMarketPrice) {\n  tcgMarketplacePrice = tcgMarketPrice * 1.05;\n}`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography>Cap prices at $10 max</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`if (tcgMarketPrice) {\n  tcgMarketplacePrice = Math.min(tcgMarketPrice, 10);\n}`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h6">Post-filter Scripts</Typography>
      <Typography>Keep only listings with price changes</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`return tcgMarketplacePrice !== currentMarketplacePrice;`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography>Keep only listings priced above $1</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`return tcgMarketplacePrice >= 1;`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="h5" gutterBottom>
        Script Writing Checklist
      </Typography>
      <ul>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          ✔ Use <Code>return</Code> in filter scripts.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          ✔ Check variable names (case-sensitive).
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          ✔ Confirm values exist before comparing.
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          ✔ Update scripts must set prices e.g. <Code>tcgMarketplacePrice</Code>
          .
        </Typography>
        <Typography component="li" variant="body2" sx={{ marginBottom: 1.5 }}>
          ✔ Test with a small CSV first.
        </Typography>
      </ul>

      <Typography variant="h5" gutterBottom>
        Frequently Asked Questions (FAQ)
      </Typography>

      <Typography variant="body1">Why did my prices all set to $0?</Typography>
      <Typography component="p" variant="body2" gutterBottom>
        Check if your script uses price variables without confirming they exist.
        Use <Code>if (tcgMarketPrice) {"{ ... }"}</Code>.
      </Typography>

      <Typography variant="body1">Why are no listings showing?</Typography>
      <Typography component="p" variant="body2" gutterBottom>
        Your filter script might be excluding everything. Review your{" "}
        <Code>return</Code> conditions.
      </Typography>

      <Typography variant="body1">
        What if I forget to set tcgMarketplacePrice?
      </Typography>
      <Typography component="p" variant="body2" gutterBottom>
        The price will remain the same as the current marketplace price.
      </Typography>

      <Typography variant="body1">
        Can I combine multiple conditions?
      </Typography>
      <Typography component="p" variant="body2" gutterBottom>
        Yes! Example:
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <CodeMirror
          value={`if (tcgMarketPrice && totalQuantity > 0) {\n  tcgMarketplacePrice = Math.max(tcgMarketPrice * 1.1, 1);\n}`}
          extensions={[javascript()]}
          theme="dark"
          readOnly
        />
      </Box>

      <Typography variant="body1">Can I undo a script?</Typography>
      <Typography component="p" variant="body2" gutterBottom>
        Yes, if you kept a backup of your original CSV.
      </Typography>
    </Container>
  );
}
