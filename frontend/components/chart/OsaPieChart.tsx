import { Col, Row } from "antd";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
const COLORS = ["#6648FF", "#71CE0D", "#B161D7", "#16CEB9"];
const OsaPieChart = ({ data, nameKey, dataKey }: any) => {
  return (
    <ResponsiveContainer height={300}>
      <PieChart height={342} margin={{ left: 10 }}>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
          outerRadius={100}
          fill="#82ca9d"
          isAnimationActive={false}
          label={(entry) => {
            return `${entry.payload[dataKey]}%`;
          }}
          labelLine={false}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend
          margin={{ left: 30 }}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{marginLeft: '24rem'}}
          payload={data.map((item: any, index: number) => ({
            id: item[nameKey],
            type: "circle",
            value: `${item[nameKey]}`,
            color: COLORS[index % COLORS.length],
          }))}
        >sdsa</Legend>
      </PieChart>
    </ResponsiveContainer>
  );
};
export default OsaPieChart;
