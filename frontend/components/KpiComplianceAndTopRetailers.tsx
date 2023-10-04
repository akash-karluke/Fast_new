import { Button, Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  COMPLIENCE_TO_ALL_KPIS_LABEL,
  TOP_TEN_RETAILERS,
} from "../store/config";
import Card from "antd/lib/card/Card";
import ComplienceToAllKpiChart from "./ComplianceToAllKpiChart";
import { Overviewservice } from "./Services/OverviewService";
import { LoadingOutlined } from "@ant-design/icons";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import EmptyComponent from "./Shared/EmptyComponent";
import { useSelector } from "react-redux";

const KpiComplianceAndTopRetailers = () => {
  const [showcard, setShowcard] = useState(false);

  const showCardHandler = () => {
    setShowcard(!showcard);
  };

  let buttontext = !showcard ? <PlusSquareOutlined /> : <MinusSquareOutlined />;

  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isKPIError, setIsKPIError] = useState(false);
  const [topRetailersData, setTopRetailersData] = useState<any>({});
  const [kpisComplianceData, setkpisComplianceData] = useState();
  const [noDataFound, setNoDataFound] = useState(true)
  const state: any = useSelector((state) => state);

  const overViewService = new Overviewservice();
  const fetchRetailersData = async () => {
    const globalDivision = encodeURIComponent(state.filters.selectedFilters?.globalDivision)
    overViewService
      .getTopRetailersData(3, globalDivision, state.filters.selectedFilters?.country.id,)
      .then((response) => {
        setTopRetailersData(response);
        if (response.data.length === 0) {
          setNoDataFound(true)
        }
      })
      .catch((err) => {
        message.error("Failed Loading retailers Data");
        setIsError(true);
        setNoDataFound(true)
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchComplianceToAllKPIsData = async () => {
    overViewService
      .getComplianceToAllKPIsData()
      .then((response: any) => {
        setkpisComplianceData(response.data)
      })
      .catch((err) => {
        message.error("Failed loading compliance to all KPI's data");
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchComplianceToAllKPIsData();
    fetchRetailersData();
  }, [state.filters.selectedFilters]);

  if (loading) {
    return (
      <Row justify="center">
        <LoadingOutlined />
      </Row>
    );
  }

  return (
    <>
      <Row
        justify={!showcard ? "space-between" : "end"}
        style={{ marginTop: "1.5rem", fontSize: "1rem", fontWeight: 600 }}
      >
        {!showcard && (
          <div>COMPLIANCE TO ALL KPIs IN OSA & TOP 10 RETAILERS</div>
        )}
        <Button
          onClick={showCardHandler}
          className={showcard ? styles.group : styles.group_active}
        >
          {buttontext}
        </Button>
      </Row>
      {showcard && (
        <Row gutter={[16, 8]} style={{ marginTop: "1.5rem" }}>
          <Col xs={24} md={12} lg={12}>
            <Row>{COMPLIENCE_TO_ALL_KPIS_LABEL}</Row>
            <Row style={{ marginTop: "1rem" }}>
              <Card className={styles.compliance_all_kpi_card}>
                {!isError && <div style={{ height: "100%", width: "100%" }}>
                  <ComplienceToAllKpiChart kpisComplianceData={kpisComplianceData} />
                </div>}
                {isError && noDataFound && <Row justify="center"><EmptyComponent /></Row>}
              </Card>
            </Row>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Row>{TOP_TEN_RETAILERS}</Row>
            <Row style={{ marginTop: "1rem" }}>
              <Card className={styles.compliance_all_kpi_card}>
                {!isKPIError && <div style={{ height: "100%", width: "100%" }}>
                  <Row justify="center">
                    <Row gutter={[24, 24]} justify={"space-around"} className={styles.headerStyle}>
                      <Col className={styles.retailersText} span={12}>
                        {"Retailers"}
                      </Col>
                      <Col className={styles.retailersText} span={12}>
                        {"OSA (%)"}
                      </Col>
                    </Row>
                    <div className={styles.scroll}>
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          {topRetailersData?.data?.sort((x: any, y: any) => { return y.OSAPercentage - x.OSAPercentage }).map(
                            (item: any) => {
                              return (
                                <div
                                  key={item.RetailerName}
                                  className={styles.retailersList}
                                >
                                  {item.RetailerName}
                                </div>
                              );
                            }
                          )}
                        </Col>
                        <Col span={12}>
                          {topRetailersData.data.sort((x: any, y: any) => { return y.OSAPercentage - x.OSAPercentage }).map(
                            (item: any) => {
                              return (
                                <div
                                  key={item.retailerName}
                                  className={styles.retailersList}
                                >
                                  {Math.round(item.OSAPercentage * 100)}
                                </div>
                              );
                            }
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Row>
                </div>}
                {isKPIError && noDataFound && <Row justify="center"><EmptyComponent /></Row>}
              </Card>

            </Row>
          </Col>
          <Col />
        </Row>
      )}
    </>
  );
};

export default KpiComplianceAndTopRetailers;
