import { Col, message, Pagination, Row } from "antd";
import { LOGBOOK_TABLE_LABEL, LOGBOOK_TABLE_TYPE } from "../store/config";
import TableComponent from "./TableComponent";
import logbookColumnMetaData from "./TablesMetaData/LogbookColumnsMeta.json";
import styles from "../styles/logBook.module.css";
import { useEffect, useState } from "react";
import { Logbookservice } from "./Services/LogbookService";
import { LoadingOutlined } from "@ant-design/icons";

const LogbookTable = () => {
  const logbookService = new Logbookservice();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logbookData, setLogBookData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchLogTableData();
  }, [currentPage]);
  const fetchLogTableData = async () => {
    logbookService
      .getLogBookTableData(currentPage, 9)
      .then((res: any) => {
        setLogBookData(res.data);
      })
      .catch(() => {
        message.error("Failed loading logs");
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <Row justify="center" className={styles.kpi_wrapper}>
        <LoadingOutlined />
      </Row>
    );
  }
  return (
    <>
     <Row style={{ marginTop: '1rem' }}>
        <Col xs={24} md={24} lg={24} className={styles.logbookTableTitle}>
          {LOGBOOK_TABLE_LABEL}
        </Col>
      </Row>
      <Row style={{ marginTop: "1.5rem" }}></Row>
      <TableComponent
        columns={logbookService.decorateColumns(logbookColumnMetaData)}
        type={LOGBOOK_TABLE_TYPE}
        dataSource={logbookData.data}
        totalPages={logbookData.totalPages}
        currentPage={currentPage}
      />
      <Row justify="end" style={{ marginTop: "1rem" }}>
        <Pagination
          current={currentPage}
          responsive
          total={logbookData.totalRecords}
          pageSize={9}
          onChange={(page, size) => {
            setCurrentPage(+page);
            setLoading(true);
          }}
        />
      </Row>
    </>
  );
};
export default LogbookTable;
