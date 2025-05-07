import { TableCell } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export const ProductTableCell = ({
  productName,
  number,
  rarity,
  condition,
  title,
  maxWidth,
}: {
  productName: string;
  number: string;
  rarity: string;
  condition: string;
  title: string;
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
      {title && (
        <ImageIcon
          sx={{
            fontSize: "1rem",
            verticalAlign: "middle",
            marginLeft: "0.25rem",
          }}
          titleAccess={title}
        />
      )}
      <span
        title={`${productName || ""} ${number || ""} ${rarity || ""} ${
          condition || ""
        }`}
      >
        {productName && `${productName} `}
        {number && `- ${number} `}
        {rarity && `- ${rarity} `}
        {condition && `- ${condition}`}
      </span>
    </TableCell>
  );
};
