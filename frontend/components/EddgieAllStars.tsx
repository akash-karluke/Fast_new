import { message, Row } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Overviewservice } from "./Services/OverviewService";
import TableComponent from "./TableComponent";
import eddgieColumns from "./TablesMetaData/eddgieStarsColumnsMeta.json";
import { EDDGIE_ALL_STARS } from "../store/config";
import styles from "../styles/Home.module.css";
import { useSelector } from "react-redux";

const EddgieAllStars = () => {
  const overviewService = new Overviewservice();
  const [eddgieData, setEddgieData] = useState([]);
  const [loading, setLoading] = useState(true);

  const state: any = useSelector((state) => state);

  const fetchEddgieData = async () => {
    const globalDivision=encodeURIComponent(state.filters.selectedFilters?.globalDivision)
    return await overviewService.getEddgieStars(state.filters.selectedFilters?.country.id,globalDivision );
  };
  useEffect(() => {
    fetchEddgieData()
      .then((resp: any) => {
        let data: any = {}
        data.data = resp.data.map((item: any) => ({
          ...item,
          changeInCS: item.OSAPercentage - item.lastCS
        }))
        let topEddgieStars=data.data.sort((x: any, y: any) => { return y.changeInCS - x.changeInCS }).slice(0,5)
        setEddgieData(topEddgieStars)
      })
      .catch(() => {
        message.error("Failed loading eddgie All Stars");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state.filters.selectedFilters?.country.id]);
  if (loading) {
    return (
      <Row justify="center">
        <LoadingOutlined />
      </Row>
    );
  }

  return (
    <>
      <Row>
        {EDDGIE_ALL_STARS}
      </Row>
      <div style={{ marginTop: '1rem', }} >
        <TableComponent
          columns={eddgieColumns}
          dataSource={eddgieData}
          type="eddgieAllStars"
          isScroll={false} />
      </div>
    </>
  );
};
export default EddgieAllStars;
