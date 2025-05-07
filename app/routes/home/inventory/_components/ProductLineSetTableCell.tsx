import { TableCell } from "@mui/material";

export const ProductLineSetTableCell = ({
  productLine,
  setName,
  maxWidth,
}: {
  productLine: string;
  setName: string;
  maxWidth: string;
}) => {
  return (
    <TableCell
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: maxWidth,
      }}
    >
      <span title={`${productLine}: ${setName}`}>
        {productLine}: {setName}
      </span>
    </TableCell>
  );
};
