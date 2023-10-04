import { Badge, Button, Col, Row } from "antd";
import { useState } from "react";
import OSAAreaChart from "./chart/OSAAreaChart";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import styles from "../styles/Home.module.css";

const OSAMonthlyAndWeeklyStats = () => {
  const [showcard, setShowcard] = useState(false);

  const showCardHandler = () => {
    setShowcard(!showcard);
  };

  let buttontext = !showcard ? <PlusSquareOutlined /> : <MinusSquareOutlined />;
  return (
    <>
      <Row
        justify={!showcard ? "space-between" : "end"}
        style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: 600 }}
      >
        {!showcard && <div>WEEKLY & MONTHLY OSA STATS</div>}
        <Button
          onClick={showCardHandler}
          className={showcard ? styles.group : styles.group_active}
        >
          {buttontext}
        </Button>
      </Row>
      {showcard && (
        <Row justify="center" gutter={[16, 32]} style={{ marginTop: "1rem" }}>
          {["weekly", "monthly"].map((type) => {
            return (
              <Col
                key={type}
                xs={24}
                md={12}
                style={{ textTransform: "capitalize" }}
              >
                <Row style={{ marginBottom: "1rem" }}>{type} OSA</Row>
                <OSAAreaChart type={type} />
                <Row justify="start">
                  <Col>
                    <Badge status="error" />
                    Target Line
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
};
export default OSAMonthlyAndWeeklyStats;
