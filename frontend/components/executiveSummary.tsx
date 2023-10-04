import { Badge, Button, Card, Col, message, Row, Skeleton, Space } from "antd";
import { ExecuitveBarChart } from "./chart/execuitveBarChart";
import { EXECUTIVE_SUMMARY_LABEL } from "../store/config";
import styles from "../styles/Home.module.css";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Overviewservice } from "./Services/OverviewService";
import { useSelector } from "react-redux";

export const ExecuitveSummary = () => {
  const [showcard, setShowcard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [summaryData, setSummaryData] = useState<any>({});
  const overViewService = new Overviewservice();
  const state: any = useSelector((state) => state);

  const showCardHandler = () => {
    setShowcard(!showcard);
  };
  const fetchsummaryData = async () => {
    overViewService
      .getExecutiveSummary(3, state.filters.selectedFilters?.country.id)
      .then((resp: any) => {
        setSummaryData(resp);
      })
      .catch((err) => {
        message.error("Failed Loading barcharts Data");
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchsummaryData();
  }, []);
  if (loading) {
    return (
      <>
      <Row justify="center" className={styles.kpi_wrapper}>
        <Skeleton active />
      </Row>
      </>
    );
  }

  let buttontext = !showcard ? <PlusSquareOutlined /> : <MinusSquareOutlined />;

  if (!isError) {
    return (
      <>
    
        <Row
          justify={!showcard ? "space-between" : "end"}
          style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: 600 }}
        >
          {!showcard && <div>CURRENT, TARGET & DELTA TO MEET OSA GRAPH</div>}
          <Button
            onClick={showCardHandler}
            className={showcard ? styles.group : styles.group_active}
          >
            {buttontext}
          </Button>
        </Row>
        {showcard && (
          <Row
            justify="space-between"
            gutter={[8, 16]}
            style={{ marginTop: "1rem" }}
          >
            {[
              {
                type: "CURRENT OSA",
                Target: "95%",
              },
              {
                type: "TARGET OSA",
                Target: "95%",
              },
              {
                type: "DELTA TO MEET TARGET OSA",
                Target: "95%",
              },
            ].map((data: any, index: number) => {
              // eslint-disable-next-line react/jsx-key
              return (
                <>
                <Col xs={24} lg={8} md={12} key={index}>
                  <Card key={index + 1} className={styles.card}>
                    <Row justify="space-between">
                      <Col className={styles.card_title}>{data.type}</Col>
                      <Col className={styles.card_type}>
                        <Badge status="error" />
                        Target {data.Target}{" "}
                      </Col>
                    </Row>
                    <ExecuitveBarChart data={summaryData[index]} />
                  </Card>
                </Col>
                </>
              );
            })}
          </Row>
        )}
      </>
    );
  }
  return <></>;
};
