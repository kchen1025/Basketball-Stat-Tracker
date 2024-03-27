import { Link } from "@mui/joy";
import { isTotalGameStats } from "../utils";
import { ArrowDownIcon } from "@/icons";

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort,
  columnsToShow,
  selectedGame,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        <th style={{ textAlign: "center" }} colSpan={17}>
          TOTAL STATS
        </th>
        {isTotalGameStats(selectedGame) ? (
          <>
            <th style={{ textAlign: "center" }} colSpan={5}>
              PER GAME AVERAGES
            </th>
          </>
        ) : null}
      </tr>
      <tr>
        {columnsToShow.map((col) => {
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

export default EnhancedTableHead;
