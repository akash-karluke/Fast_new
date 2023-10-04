import { Avatar, Col, Row, Space } from "antd";
import { BarChart, Bar, ResponsiveContainer, XAxis } from "recharts";
import { ArrowUpOutlined } from "@ant-design/icons";
import styles from "../../styles/Home.module.css";

const StackedBarChart = (props: any) => {
  const { kpiComplianceData } = props
  let text = kpiComplianceData?.compliancePercentage
  let result = text.slice(0, 2);
  const percentageChange=result-kpiComplianceData.prevWeekOSAPercenetage+"%"
  const data = [
    {
      uv: result-kpiComplianceData.prevWeekOSAPercenetage,
      pv: result
    },
  ];
  return (
    <>
      <Row>
        <Col flex="100px">
          <div className={styles.coreOsaBarChart}>
            <ResponsiveContainer height="100%" width={70}>
              <BarChart data={data}>
                <XAxis dataKey="x" tick={false} stroke="white" />
                <Bar dataKey="pv" stackId="a" fill="#1F40E3" />
                <Bar dataKey="uv" stackId="a" fill="#4662F0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col flex="auto">
          <Col>
            <div className={styles.coreOsaComplianceTitle}>{"Compliance"}</div>
            <Space>
              <span className={styles.coreOsaPercentage}>{kpiComplianceData?.compliancePercentage}</span>
              <span style={{ borderRadius: '100px', paddingLeft: '0.1rem', paddingRight: '0.1rem', backgroundColor: 'rgba(37, 149, 76, 0.182724)' }}>
                <ArrowUpOutlined
                  style={{ fontSize: "90%", color: "#07D34E" }}
                />
              </span>
              <span className={styles.complianceText}>{"+"+percentageChange}</span>
            </Space>
          </Col>
          <Row>
            <Col>
              <div style={{ paddingTop: "20px" }}>
                <div className={styles.osaValueLabel}>{"Value"}</div>
                <div className={styles.coreOsaPercentage}>{kpiComplianceData.currency+kpiComplianceData.currentWeekOSAValue}</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default StackedBarChart;
