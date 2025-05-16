import { TableCell, Typography } from "@mui/material";

export type NumberFormattedTableCellProps = {
  value: number;
  format: Intl.NumberFormat;
  deltaHighlighted?: boolean;
};

export default function NumberFormattedTableCell({
  value,
  format,
  deltaHighlighted = false,
}: NumberFormattedTableCellProps) {
  if (isNaN(value)) {
    return <TableCell align="right" sx={{ width: "0%" }}></TableCell>;
  }

  if (!deltaHighlighted) {
    return <TableCell align="right">{format.format(value)}</TableCell>;
  }

  const color = value > 0 ? "success" : value < 0 ? "error" : "textPrimary";

  return (
    <TableCell align="right" sx={{ width: "0%" }}>
      <Typography variant="body2" color={color}>
        {format.format(value)}
      </Typography>
    </TableCell>
  );
}
