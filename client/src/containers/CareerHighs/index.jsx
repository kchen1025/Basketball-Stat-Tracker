import { getCareerHighs } from "@/api/player";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

import { format } from "date-fns";

import DataTable from "@/components/DataTable";

export async function loader({ params }) {
  const { results: careerHighs } = await getCareerHighs();
  return { careerHighs };
}

const CareerHighs = () => {
  const { careerHighs } = useLoaderData();
  const transformedCareerHighs = careerHighs.map((e) => ({
    ...e,
    game_date: format(e.game_date, "M-d-yyyy"),
  }));

  return (
    <DataTable
      headerText={"Career Highs (Points)"}
      subHeaderText={"Career highs with games and dates"}
      defaultSortKey={"career_high_points"}
      defaultSortDirection={"asc"}
      headerColumns={[
        { key: "name", label: "Name", rowSpan: 2, align: "left" },
        {
          key: "career_high_points",
          label: "Points",
          rowSpan: 2,
          align: "right",
        },
        { key: "game_name", label: "Game Name", rowSpan: 2, align: "right" },
        {
          key: "game_date",
          label: "Game Date",
          rowSpan: 2,
          align: "right",
        },
      ]}
      data={transformedCareerHighs}
    />
  );
};

export default CareerHighs;
