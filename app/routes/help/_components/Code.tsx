import { Paper } from "@mui/material";

export default function Code({ children }: { children: React.ReactNode }) {
  return (
    <Paper component="code" sx={{ padding: 0.5 }} variant="outlined">
      {children}
    </Paper>
  );
}
