import {
  Col,
  Input,
  Row,
  TableProps,
  message,
  Pagination,
  Modal,
  Skeleton,
} from "antd";
import { Space, Table } from "antd";
import type { ColumnsType, SorterResult } from "antd/es/table/interface";
import sortIcon from "../assets/icons/sortIcon.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Overviewservice } from "./Services/OverviewService";
import { OSA_GROWTH_OPPORTUNITIES_TABLE_LABEL } from "../store/config";
import NestedOSATable from "./NestedOSATable";
import { LoadingOutlined } from "@ant-design/icons";
import {
  osaGrowthOpportunitiesProps,
  osaGrowthOpportunitiesTableProps,
} from "./modals/osaOverviewModels";
import { useSelector } from "react-redux";
import _ from "lodash";
import SkuLevelOSAFix from "./SkuLevelOSAFix";

const OsaGrowthOpportunities = () => {
  const [osaTableData, setOsaTableData] =
    useState<osaGrowthOpportunitiesTableProps>();
  const [expanded, setexpanded] = useState(-1);
  const overviewService = new Overviewservice();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedInfo, setSortedInfo] = useState<
    SorterResult<osaGrowthOpportunitiesProps>
  >({});
  const [showModal, setShowModal] = useState(false);
  const { selectedFilters } = useSelector((state: any) => state.filters);
  const { user } = useSelector((state: any) => state.user);

  console.log(selectedFilters);
  useEffect(() => {
    getGrowthOpportunitiesData();
  }, [currentPage, selectedFilters.retailer.id]);

  const getGrowthOpportunitiesData = async () => {
    setLoading(true);
    await overviewService
      .getGrowthOpportunitiesTableData(
        currentPage,
        10,
        selectedFilters.retailer.id,
        4
      )
      .then((res: any) => {
        setOsaTableData(res);
      })
      .catch((error) => {
        message.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Row justify="center" className={styles.kpi_wrapper}>
        <Skeleton active />
      </Row>
    );
  }
  const handleChange: TableProps<osaGrowthOpportunitiesProps>["onChange"] = (
    {},
    {},
    sorter
  ) => {
    setSortedInfo(sorter as SorterResult<osaGrowthOpportunitiesProps>);
  };
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnsType<osaGrowthOpportunitiesProps> = [
    {
      title: "S.No",
      dataIndex: "serialNumber",
      width: "7%",
    },
    {
      title: (
        <span style={{ alignItems: "center" }}>
          {"Store Name"} <Image className={styles.sortIcon} src={sortIcon} />
        </span>
      ),
      dataIndex: "store_chain",
      key: "store_chain",
      sorter: (a: any, b: any) => a.store_chain.localeCompare(b.store_chain),
      sortOrder:
        sortedInfo.columnKey === "store_chain" ? sortedInfo.order : null,
      width: "13%",
      ellipsis: true,
    },
    {
      title: "Store Code",
      dataIndex: "StoreID",
      key: "serialNumber",
      width: "10%",
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      width: "25%",
    },
    {
      title: "Core OSA",
      dataIndex: "CORE_OSA",
      key: "CORE_OSA",
      width: "10%",
    },
    {
      title: "Full OSA",
      dataIndex: "Full_OSA",
      key: "Full_OSA",
      width: "10%",
    },
    {
      title: "NPD OSA",
      dataIndex: "NPD_OSA",
      key: "NPD_OSA",
      width: "10%",
    },
    {
      title: "Sales Uplift No",
      key: "Sales_Uplift",
      width: "15%",
      dataIndex: "Sales_Uplift",
    },
  ];
  const decorateColumns = (columns: any) => {
    const modifiedcol = columns;
    const salesUpliftCol = _.find(modifiedcol, {
      dataIndex: "Sales_Uplift",
    });
    salesUpliftCol.render = (value: any) => {
      // console.log(value, 'salesuplift');
      // if (!value || NaN === value) {
      return "-";
      // }
      // return value
    };
    const storeNAmeCol = _.find(modifiedcol, {
      dataIndex: "store_chain",
    });
    storeNAmeCol.render = () => "-";
    return modifiedcol;
  };
  return (
    <>
      <Row style={{ marginTop: "1rem" }}>
        <Col xs={24} md={24} lg={24} className={styles.osaTableTitle}>
          {OSA_GROWTH_OPPORTUNITIES_TABLE_LABEL}
        </Col>
      </Row>
      <Row style={{ marginTop: "1.5rem" }}>
        <Col xs={24} md={24} lg={24}>
          <Table
            rowClassName={`antTable ${
              osaTableData?.data.length ? "" : "dark_body_table"
            }`}
            showSorterTooltip={false}
            className={styles.osaTable}
            columns={decorateColumns(columns)}
            dataSource={osaTableData?.data}
            onChange={handleChange}
            pagination={{
              current: currentPage,
              pageSize: osaTableData?.total_record_per_page,
              total: osaTableData?.total_record,
              onChange: onPageChange,
              showSizeChanger: false,
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setShowModal(true);
                },
              };
            }}
          />
          <Modal
            title="Next Best Action"
            centered
            visible={showModal}
            className="sku_fix_modal"
            footer={null}
            onCancel={() => setShowModal(false)}
            width="85vw"
          >
            <NestedOSATable/>
            {/* <SkuLevelOSAFix setShowModal={setShowModal} showModal={showModal} /> */}
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default OsaGrowthOpportunities;
