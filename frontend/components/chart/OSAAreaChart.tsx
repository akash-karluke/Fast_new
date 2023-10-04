import { Badge, message, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Overviewservice } from "../Services/OverviewService";

const OSAAreaChart = ({ type }: { type: string }) => {
  const [loading, setLoading] = useState(true);
  const [areaData, setAreaData] = useState<any>({});
  const fetchAreaChartData = async () => {
    return Overviewservice.getOSAAreachartData(type);
  };
  useEffect(() => {
    fetchAreaChartData()
      .then((res: any) => {
        setAreaData(res);
      })
      .catch(() => {
        message.error(`Failed Loading ${type} chart data`);
      });
  }, []);
  const renderperage = (tickItem: any) => `${tickItem}%`;
  return (
    <>
      <Row style={{ height: "320px", background: '#1E1E1E', padding: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={500} height={320} data={areaData.chartData}>
            {"weekly" === type ? (
              <defs>
                <linearGradient
                  id={`colorUv${type}`}
                  gradientTransform="rotate(90)"
                >
                  <stop
                    offset="14.5%"
                    stopColor="rgba(102, 72, 255, 0.360461)"
                  />
                  <stop offset="100%" stopColor="rgba(20, 14, 51, 0.199128)" />
                  <stop
                    offset="100%"
                    stopColor="rgba(0, 0, 0, 0.0001)"
                  />
                </linearGradient>
              </defs>
            ) : (
              <defs>
                <linearGradient
                  id={`colorUv${type}`}
                  gradientTransform="rotate(90)"
                >
                  <stop
                    offset="13.95%"
                    stopColor="rgba(72, 255, 167, 0.360461)"
                  />
                  <stop
                    offset="99.45%"
                    stopColor="rgba(20, 14, 51, 0.199128)"
                  />
                  <stop
                    offset="99.45%"
                    stopColor="rgba(0, 0, 0, 0.0001)"
                  />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid stroke="#292C38" strokeDasharray="0.5 0.5" />
            <XAxis dataKey="timeline" axisLine={{ stroke: '#292C38' }} />
            <YAxis dataKey="osa%" axisLine={{ stroke: '#292C38' }} tickFormatter={renderperage} />
            <ReferenceLine
              y={areaData.target}
              stroke="#F7517F"
              strokeDasharray="3 3"
            />
            <Tooltip />
            <Area
              type="nocurve"
              dataKey="osa%"
              stroke={'weekly' === type ? '#6648FF' : '#07D34E'}
              fill={`url(#colorUv${type})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Row>
    </>
  );
};
export default OSAAreaChart;
