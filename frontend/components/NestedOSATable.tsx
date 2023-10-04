import { message, Pagination, Row } from "antd";
import { NESTED_OSA_TABLE_TYPE } from "../store/config";
import TableComponent from "./TableComponent";
import nestedColumnMetaData from "./TablesMetaData/NestedOSAColumnsMeta.json";
import styles from "../styles/logBook.module.css";
import { useEffect, useState } from "react";
import { NestedOsaTableService } from "./Services/NestedOsaTableService";
import { LoadingOutlined } from "@ant-design/icons";
import OverviewDrawerComponent from "./OverviewDrawerComponent";
import { useSelector } from "react-redux";

const NestedOSATable = () => {
  const nestedOsaTableservice = new NestedOsaTableService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nestedOsaData, setNestedOsaData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState(null);
  const { selectedFilters } = useSelector((state: any) => state.filters);
  useEffect(() => {
    fetchNestedOsaTableData();
  }, [currentPage]);

  const fetchNestedOsaTableData = async () => {
    nestedOsaTableservice
      .getNestedOsaTableData(2547,currentPage,
        5,
        )
      .then((res: any) => {
        setNestedOsaData(res.data);
      })
      .catch(() => {
        message.error("Failed loading Next Best Action");
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
    <div style={{backgroundColor: '#242424'}}>
      <TableComponent
        columns={nestedOsaTableservice.decorateColumns(
          nestedColumnMetaData,
          setActionId
        )}
        type={NESTED_OSA_TABLE_TYPE}
        dataSource={nestedOsaData}
        totalPages={nestedOsaData.totalPages}
        currentPage={currentPage}
      />
       <Row justify="end" style={{ marginTop: "1rem" }}>
        <Pagination
          current={currentPage}
          responsive
          total={nestedOsaData.totalRecords}
          pageSize={9}
          onChange={(page, size) => {
            setCurrentPage(+page);
            setLoading(true);
          }}
        />
      </Row>
    </div>
  );
};
export default NestedOSATable;
