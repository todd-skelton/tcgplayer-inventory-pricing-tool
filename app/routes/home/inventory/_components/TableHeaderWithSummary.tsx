import { TableCell, Typography, useTheme } from "@mui/material";

export type TableHeaderWithSummaryProps = {
  header: string;
  value: number;
  format: Intl.NumberFormat;
  deltaHighlighted?: boolean;
};

export default function TableHeaderWithSummary({
  header,
  value,
  format,
  deltaHighlighted = false,
}: TableHeaderWithSummaryProps) {
  if (isNaN(value)) {
    return (
      <TableCell align="right" sx={{ width: "0%" }}>
        {header}
      </TableCell>
    );
  }

  if (!deltaHighlighted) {
    return (
      <TableCell align="right" sx={{ width: "0%" }}>
        {header}
        <br />
        {format.format(value)}
      </TableCell>
    );
  }

  const color = value > 0 ? "success" : value < 0 ? "error" : "textPrimary";

  return (
    <TableCell align="right" sx={{ width: "0%" }}>
      {header}
      <Typography variant="body2" color={color}>
        {format.format(value)}
      </Typography>
    </TableCell>
  );
}
