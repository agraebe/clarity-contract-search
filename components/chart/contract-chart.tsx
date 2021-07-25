import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { Box } from "@chakra-ui/react";

const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 10, bottom: 50, left: 10 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="cardinal"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 10,
      tickPadding: 10,
      legend: "contracts per calendar week",
      legendOffset: 45,
      legendPosition: "middle",
    }}
    axisLeft={null}
    enableGridX={false}
    enableGridY={false}
    pointSize={3}
    pointColor={{ theme: "background" }}
    pointBorderWidth={3}
    pointBorderColor={{ from: "serieColor" }}
    enablePointLabel={true}
    pointLabel="y"
    pointLabelYOffset={-12}
    enableArea={true}
    areaOpacity={1}
    isInteractive={false}
    useMesh={false}
    legends={[]}
  />
);

export function ContractChart({ chartData }: ContractChartProps) {
  return (
    <Box>
      <div className="chart">
        <MyResponsiveLine data={chartData} />
      </div>
    </Box>
  );
}

interface ContractChartProps {
  chartData: {
    id: string;
    data: {
      x: number;
      y: number;
    }[];
  }[];
}

export default React.memo(ContractChart);
