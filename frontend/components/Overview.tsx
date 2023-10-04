import { Row, Col, Space } from "antd";
import { stat } from "fs";
import { useSelector } from "react-redux";
import { SALES_EXECUTION_OVERVIEW_LABEL } from "../store/config";
import styles from "../styles/Home.module.css";
import { getFilterText } from "./Utils";
const Overview = () => {
  const state: any = useSelector((state) => state);

  return (
    <Row>
      <Col xs={0} md={12} lg={8} className={styles.overview_label}>
        {SALES_EXECUTION_OVERVIEW_LABEL}
      </Col>
      <Col
        className={styles.overview_detail}
        xs={24}
        md={12}
        lg={16}
        style={{ textAlign: "right" }}
      >
        <Space>
          {state.filters.selectedFilters.globalDivision.length > 0 && <div className={styles.dotted_border}>
            {state.filters.selectedFilters.globalDivision}
            &nbsp;&nbsp;&nbsp;
          </div>}
          {state.filters.selectedFilters.category.length > 0 && <div className={styles.dotted_border}>
            {state.filters.selectedFilters.category.ProductCategory}
            &nbsp;&nbsp;&nbsp;
          </div>}
          <div>{state.filters.selectedFilters.country.countryName}</div>
        </Space>
      </Col>
    </Row>
  );
};
export default Overview;
