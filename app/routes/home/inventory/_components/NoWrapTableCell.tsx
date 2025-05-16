import { TableCell } from "@mui/material";

export type NoWrapTableCellProps = {
  maxWidth?: string;
  title?: string;
  children?: React.ReactNode;
};

export default function NoWrapTableCell({
  maxWidth,
  title,
  children,
}: NoWrapTableCellProps) {
  return (
    <TableCell
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: maxWidth,
      }}
    >
      <span title={title}>{children}</span>
    </TableCell>
  );
}
