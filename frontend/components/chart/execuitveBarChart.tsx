import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import styles from "../../styles/Home.module.css";

const colors = scaleOrdinal(schemeCategory10).range();

const data = [
  {
    name: "Beauty and Wellbeing",
    uv: 80,
    pv: "80%",
  },
  {
    name: "Personal Care",
    uv: 70,
    pv: "70%",
  },
  {
    name: "Home Care",
    uv: 93,
    pv: "93%",
  },
  {
    name: "Nutrition",
    uv: 75,
    pv: "75%",
  },
  {
    name: "Ice Cream",
    uv: 59,
    pv: "59%",
  },
];

export const ExecuitveBarChart = (props: { data: any }): JSX.Element => {
  return (
    <>
    <ResponsiveContainer height={220}>
      <BarChart
        data={props.data}
        layout="vertical"
        barCategoryGap={6}
        margin={{
          top: 25,
          right: 15,
        }}
      >
        <CartesianGrid
          horizontal={false}
          vertical={true}
          stroke="grey"
          strokeDasharray="5 5"
        />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickCount={6}
          tick={{ fill: "white", fontSize: "0.625rem" }}
          tickFormatter={(tick: any) => {
            return `${tick}%`;
          }}
        />
        <YAxis
          type="category"
          tickLine={false}
          tick={{ fill: "white", fontSize: "0.625rem" }}
          domain={["dataMin", "dataMax"]}
          dataKey="name"
        />
        <ReferenceLine x="95" stroke="red" strokeDasharray="3 3" />
        <Bar dataKey="uv" fill="#8884d8">
          <LabelList
            dataKey="pv"
            position="insideRight"
            style={{ fill: "white", fontSize: "10px" }}
          />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </>
  );
};
