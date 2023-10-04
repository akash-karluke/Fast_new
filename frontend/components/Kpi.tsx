import { Button, Col, message, Row, Skeleton } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import salesRepIcon from "../assets/icons/salesRepIcon.svg";
import heartEyes from "../assets/icons/heartEyes.svg";
import dollerTounge from "../assets/icons/dollerTounge.svg";
import moneyBag from "../assets/icons/moneyBag.svg";
import {
  BEST_PERFORMING_STORE_LABEL,
  EXCELLENT_WORK_LABEL,
  GREETING_TEXT,
  LAST_5_VISITS_LABEL,
  NUMBER_OF_RETAILERS_LABEL,
  NUMBER_OF_SKU_LABEL,
  REGION_LABEL,
  STORE_WITH_LARGEST_GROWTH_POT_LABEL,
  TOTAL_VALUE_GAIN_LABEL,
} from "../store/config";
import styles from "../styles/Home.module.css";
import { Overviewservice } from "./Services/OverviewService";
import { LoadingOutlined } from "@ant-design/icons";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
const Kpi = () => {
  const { user } = useSelector((state: any) => state);
  console.log(user)
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [kpiData, setKpiData] = useState<any>({});
  const overViewService = new Overviewservice();

  const fetchKpiData = async () => {
    overViewService
      .getKpiData(3)
      .then((response) => {
        setKpiData(response);
      })
      .catch((err) => {
        message.error("Failed Loading KPI Data");
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchKpiData();
  }, []);
  if (loading) {
    return (
      <Row justify="center" className={styles.kpi_wrapper}>
        <Skeleton active />
      </Row>
    );
  }
  if (!isError) {
    return (
      <>
        <Row className={`${styles.kpi_wrapper}`} gutter={[16, 16]}>
          <Col
            xs={0}
            lg={4}
            xl={3}
            className={`${styles.bg1E1E1E} ${styles.middle_in_col}`}
          >
            <Row
              style={{ height: "6rem", paddingTop: "1rem" }}
              justify="center"
            >
              <Image src={salesRepIcon} />
            </Row>
            <Row
              justify="center"
              style={{ height: "6rem", paddingTop: "2rem" }}
            >
              <Col className={styles.centerInCol} xs={24}>
                {GREETING_TEXT}
              </Col>
              <Col className={styles.centerInCol} xs={24}>
                {user.user.displayName}
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={24} lg={13} xl={13}>
            <Row gutter={[16, 16]} style={{ marginBottom: "0.5rem" }}>
              <Col xs={24} md={12} lg={10}>
                <Row gutter={[{ xs: 64, sm: 64, md: 64, lg: 16, xl: 16 }, 16]}>
                  <Col xs={12} md={10}>
                    <Row
                      justify="center"
                      className={`${styles.bg1E1E1E} ${styles.kpi_card_row}`}
                      style={{ marginTop: "0.5rem" }}
                    >
                      <Col
                        className={`${styles.centerInCol} ${styles.px14}`}
                        xs={24}
                      >
                        {REGION_LABEL}
                      </Col>
                      <Col
                        className={`${styles.centerInCol} ${styles.kpi_value}`}
                        xs={24}
                      >
                        {kpiData.numberOfRegions}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={14} lg={14}>
                    <Row
                      justify="center"
                      className={`${styles.bg1E1E1E} ${styles.kpi_card_row}`}
                      style={{ marginTop: "0.5rem" }}
                    >
                      <Col
                        className={`${styles.centerInCol} ${styles.px14}`}
                        xs={24}
                      >
                        {NUMBER_OF_RETAILERS_LABEL}
                      </Col>
                      <Col
                        className={`${styles.centerInCol} ${styles.kpi_value}`}
                        xs={24}
                      >
                        {kpiData.numberOfRetailers}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12} lg={14} className={`${styles.bg1E1E1E}`}>
                <Row gutter={[{ xs: 64, sm: 64, md: 64, lg: 8 }, 16]}>
                  <Col xs={24}>
                    <Row>
                      <Col xs={11} md={10}>
                        <Row
                          justify="center"
                          className={`${styles.bg000000} `}
                          style={{ marginTop: "0.5rem", height: "92px" }}
                        >
                          <Col
                            className={`${styles.centerInCol} ${styles.px14}`}
                            xs={24}
                          >
                            <Row align="middle">
                              {BEST_PERFORMING_STORE_LABEL}
                            </Row>
                          </Col>
                          <Col
                            className={`${styles.centerInCol} ${styles.kpi_value}`}
                            xs={24}
                          >
                            {kpiData.numberOfBestPerformingStores}
                          </Col>
                        </Row>
                      </Col>
                      <Col className={`${styles.special_black_border}`}></Col>
                      <Col xs={12} md={12}>
                        <Row
                          justify="center"
                          className={`${styles.bg000000}`}
                          style={{ marginTop: "0.5rem", height: "92px" }}
                        >
                          <Col
                            className={`${styles.centerInCol} ${styles.px14}`}
                            xs={24}
                            style={{ height: "25px" }}
                          >
                            {STORE_WITH_LARGEST_GROWTH_POT_LABEL}
                          </Col>
                          <Col
                            className={`${styles.centerInCol} ${styles.kpi_value}`}
                            xs={24}
                          >
                            {kpiData.numberOfStoresWithLargestGrowthPotential}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[8, 16]}>
              <Col xs={24} md={12} lg={10}>
                <Row
                  gutter={[{ xs: 64, sm: 64, md: 64, lg: 16, xl: 16 }, 16]}
                  justify="center"
                  style={{marginLeft:"-24px", marginRight:"-18px"}}
                >
                  <Col xs={24} md={20} className={`${styles.aggregated_kpi}`}>
                    <Row
                      justify="center"
                      align="middle"
                      className={`${styles.kpi_card_row}`}
                    >
                      <Col
                        xs={13}
                        className={`${styles.special_border} ${styles.kpi_padding} `}
                        style={{paddingLeft:"10px"}}
                      >
                        <Row className={`${styles.right_margin}`}>
                          {NUMBER_OF_SKU_LABEL}
                        </Row>
                      </Col>
                      <Col
                        offset={1}
                        xs={10}
                        className={`${styles.font_40_weight_900} `}
                      >
                        {kpiData.numberOftargetSKUs}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                md={12}
                lg={14}
                style={{ padding: "0px !important" }}
              >
                <Row
                  gutter={[{ xs: 64, sm: 64, md: 64, lg: 16, xl: 16 }, 16]}
                  justify="center"
                  style={{marginLeft:"-4px", marginRight:"-8px"}}
                >
                  <Col
                    xs={24}
                    md={20}
                    lg={24}
                    className={`${styles.aggregated_kpi}`}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      className={`${styles.kpi_card_row}`}
                    >
                      <Col xs={3}>
                        <Image width={48} height={48} src={moneyBag} />
                      </Col>
                      <Col
                        xs={10}
                        lg={6}
                        className={`${styles.special_border} ${styles.kpi_padding}`}
                      >
                        <Row >
                          {TOTAL_VALUE_GAIN_LABEL}
                        </Row>
                      </Col>
                      <Col
                        offset={1}
                        xs={10}
                        className={styles.font_40_weight_900}
                      >
                        {`${kpiData.totalValueGaininEuros}`}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={24} lg={7} xl={8}>
            <Row
              style={{ minHeight: "14rem" }}
              gutter={[{ xs: 64, sm: 64, md: 128, lg: 16 }, 16]}
              justify="space-evenly"
            >
              <Col xs={10} className={styles.last_visit_sales}>
                <Row justify="center">
                  <Image src={heartEyes} />
                </Row>
                <Row justify="center">
                  <Col xs={20} className={`${styles.centerInCol}`}>
                    {EXCELLENT_WORK_LABEL.replace(
                      "REPLACE_AMOUNT",
                      kpiData.netSalesIncrement
                    )}
                  </Col>
                </Row>
              </Col>
              <Col xs={10} className={styles.last_five_visit_sales}>
                <Row justify="center">
                  <Image src={dollerTounge} />
                </Row>
                <Row justify="center">
                  <Col xs={24} md={20} className={`${styles.centerInCol}`}>
                    {LAST_5_VISITS_LABEL.replace(
                      "REPLACE_AMOUNT",
                      kpiData.lastFiveVistsIncrement
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
  return <></>;
};
export default Kpi;
