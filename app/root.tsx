import React from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import type { Route } from "./+types/root";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: true,
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Stack spacing={2}>
            <AppBar position="static">
              <Toolbar>
                <Stack direction="row" sx={{ flexGrow: 1 }} spacing={2}>
                  <Typography variant="h6">
                    TCGplayer Inventory Pricing Tool
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Home">
                    <IconButton color="inherit" onClick={() => navigate("/")}>
                      <HomeIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Help">
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/help")}
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Toolbar>
            </AppBar>
            {children}
          </Stack>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
