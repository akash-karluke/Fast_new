import { Button, Col, Row, Skeleton, Spin } from "antd";
import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { ExecuitveSummary } from "../components/executiveSummary";
import FilterSection from "../components/Filters";
import Kpi from "../components/Kpi";
import Overview from "../components/Overview";
import KpiComplianceAndTopRetailers from "../components/KpiComplianceAndTopRetailers";
import OSAMonthlyAndWeeklyStats from "../components/OSAMonthlyAndWeeklyStats";
import OverviewRootCauseChart from "../components/OverviewRootCauseChart";
import styles from "../styles/Home.module.css";
import EddgieAllStars from "../components/EddgieAllStars";
import { EXECUTIVE_SUMMARY_LABEL } from "../store/config";
import { Authentication } from "../components/Authentication";
import { useState } from "react";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import SkuLevelOSAFix from "../components/SkuLevelOSAFix";

const Home: NextPage = () => {
  const [showcard, setShowcard] = useState(false);

  const showCardHandler = () => {
    setShowcard(!showcard);
  };

  let buttontext = !showcard ? <PlusSquareOutlined /> : <MinusSquareOutlined />;
  const state: any = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false);
  if (state.filters.loading) return <Skeleton active avatar paragraph={{rows: 30}} />;
//   if (showModal)
//   return <SkuLevelOSAFix setShowModal={setShowModal} />
// else 
// return <button onClick={() => setShowModal(true)}>show modal</button>
  return (
    <div className="page">
      <Overview />
      <FilterSection />
      <Kpi />
      <Row
        style={{ marginTop: "1.5rem" }}
        className={styles.executive_summary_wrapper}
      >
        <Col xs={24} className={styles.executive_summary_label}>
          {EXECUTIVE_SUMMARY_LABEL}
        </Col>
      </Row>
      <OSAMonthlyAndWeeklyStats />
      <KpiComplianceAndTopRetailers />
      <ExecuitveSummary />
      <Row
        justify={!showcard ? "space-between" : "end"}
        style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: 600 }}
      >
        {!showcard && <div>BREAK-UP OF ROOT CAUSES AND EDDGIE ALL STARS</div>}
        <Button
          onClick={showCardHandler}
          className={showcard ? styles.group : styles.group_active}
        >
          {buttontext}
        </Button>
      </Row>
      {showcard && (
        <Row style={{ marginTop: "1.5rem" }} justify="center" gutter={[16, 8]}>
          <Col xs={24} md={24} lg={12}>
            <OverviewRootCauseChart />
          </Col>
          <Col xs={24} md={24} lg={12}>
            <EddgieAllStars />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Home;
