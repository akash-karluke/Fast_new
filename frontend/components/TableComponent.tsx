import { Table } from "antd";
import styles from "../styles/logBook.module.css";

const TableComponent = ({
  columns,
  dataSource,
  type,
  totalPages,
  currentPage,
  isScroll,
}: {
  columns: any;
  dataSource: any;
  type?: string;
  totalPages?: number;
  currentPage?: number;
  isScroll?: boolean;
}) => {
  return (
    <Table
      bordered={false}
      rowClassName="edgieAllStarsTable"
      className={styles.table}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
};
export default TableComponent;
