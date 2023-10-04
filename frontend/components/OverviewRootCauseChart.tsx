import { Col, message, Row } from "antd";
import { useEffect, useState } from "react";
import OsaPieChart from "./chart/OsaPieChart";
import { Overviewservice } from "./Services/OverviewService";
import { LoadingOutlined } from "@ant-design/icons";
import styles from '../styles/Home.module.css';

const OverviewRootCauseChart = () => {
  const overviewService = new Overviewservice();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRootCauseBreakUp = async () => {
    return await overviewService.getRootCauseBreakUp();
  };
  useEffect(() => {
    fetchRootCauseBreakUp()
      .then((res: any) => {
        setChartData(res);
      })
      .catch(() => {
        message.error("Failed loading root cause breakup");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <Row justify="center" >
        <LoadingOutlined />
      </Row>
    );
  }
  return (
    <>
    <Row>BREAK-UP OF ROOT CAUSES</Row>
    <Row style={{ backgroundColor: '#1E1E1E',maxHeight: '342px', marginTop: '1rem' }} >
      <Col xs={24} className={styles.root_cause}>
        <OsaPieChart
          data={chartData}
          dataKey="valueInPercentage"
          nameKey="cause" />
      </Col>
    </Row></>
  );
};
export default OverviewRootCauseChart;
