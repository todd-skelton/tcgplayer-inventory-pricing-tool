import { TableCell, Typography, useTheme } from "@mui/material";

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

  const theme = useTheme();
  const color =
    value > 0
      ? theme.palette.success.main
      : value < 0
      ? theme.palette.error.main
      : theme.palette.text.primary;

  return (
    <TableCell align="right" sx={{ width: "0%" }}>
      <Typography variant="body2" style={{ color }}>
        {format.format(value)}
      </Typography>
    </TableCell>
  );
}
