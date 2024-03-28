import { Table, Box, Typography, Link } from "@mui/joy";
import { useState } from "react";
import { ArrowDownIcon } from "@/icons";
import { getComparator } from "@/utils/sortUtils";

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort,
  headerColumns,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        {headerColumns.map((col) => {
          const active = orderBy === col.key;
          return (
            <th key={col.key}>
              <Link
                underline="none"
                color="neutral"
                textColor={active ? "primary.plainColor" : undefined}
                component="button"
                onClick={createSortHandler(col.key)}
                fontWeight="lg"
                startDecorator={<ArrowDownIcon opacity={active ? 1 : 0} />}
                sx={{
                  "& svg": {
                    transition: "0.2s",
                    transform:
                      active && order === "desc"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  },
                  "&:hover": { "& svg": { opacity: 1 } },
                }}
              >
                {col.label}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const DataTable = ({
  headerText,
  subHeaderText,
  headerColumns,
  data,
  defaultSortKey,
  defaultSortDirection,
}) => {
  const [order, setOrder] = useState(defaultSortDirection || "desc");
  const [orderBy, setOrderBy] = useState(defaultSortKey || "id");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
      margin={5}
    >
      <Typography level="h2" mt={2}>
        {headerText}
      </Typography>
      <Typography level="body-xs" mb={2}>
        {subHeaderText}
      </Typography>

      <Table
        borderAxis="bothBetween"
        aria-label="basic table"
        stickyHeader
        stripe="odd"
        hoverRow
      >
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerColumns={headerColumns}
        />
        <tbody>
          {data.sort(getComparator(order, orderBy)).map((row, i) => (
            <tr key={`${row.name}-${i}`}>
              {headerColumns.map((col) => (
                <td key={col.key} align={col.align}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default DataTable;
