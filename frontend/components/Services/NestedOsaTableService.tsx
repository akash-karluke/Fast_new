import _ from "lodash";
import { nestedOSaTableData } from "../../store/MockData/nestedOsaData";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import axios from "axios";
export class NestedOsaTableService {

  getNestedOsaTableData = async (
    storeId: number,
    currentPage: number,
    recordsPerPage: number,
  ) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}table/get-category-tabular?storeId=${storeId}&page_num=${currentPage}&page_size=${recordsPerPage}`
      )
      .then((tableData) => {
        let response = tableData;
        response.data = tableData.data.map((item: any, index: any) => ({
          ...item,
          key: index + 1,
          category: item.ProductCategory,
          action: item.Action,
          currentOSAPercentage: Math.round(item.OSAPercentage * 100).toFixed(),
          coreOSAPercentage: Math.round(item.COREOSAPercentage * 100).toFixed(),
          salesUpliftNumber: item.SalesUplift,
          npdOSAPercentage: Math.round(item.NPDOSAPercentage * 100).toFixed(),
          actionCreatedOn: "12 Jan, 2022",
          reasonForNonCompliance: "Increase Core OSA in Deodrant Category",
          fieldRep: item.SalesRepFirstName,
          status: "fixed",
          actionId: index,
          serialNumber: (currentPage - 1) * recordsPerPage + index + 1,
        }));
        return response;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  decorateColumns = (columns: any[] = [], setActionId: any) => {
    const columnMeta = columns;
    const statusCol = _.find(columnMeta, {
      dataIndex: "status",
    });

    if (statusCol) {
      statusCol.render = (text: string, record: any) => {
        return (
          <span
            style={{
              color: "green",
              fontSize: "0.875rem",
              fontWeight: "900",
              cursor: "pointer",
            }}
            onClick={() => {
              setActionId(record.actionId);
            }}
          >
            {text}&nbsp; &nbsp;
            <Badge count={<ArrowRightOutlined style={{ color: "white" }} />} />
          </span>
        );
      };
    }
    return columnMeta;
  };
}
