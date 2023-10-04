import {
  Avatar,
  Button,
  Col,
  Divider,
  Drawer,
  Menu,
  message,
  Row,
  Select,
  Space,
  Tag,
  Input,
  Tooltip
} from "antd";
import {
  LinkOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  LoadingOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { CalendarOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Overviewservice } from "./Services/OverviewService";
import styles from "../styles/Home.module.css";
import _ from "lodash";
import { CORE_SKUS_AVAILABLE } from "../store/config";
import availableSkusMetaData from "../components/TablesMetaData/availableSKUsMetaData.json"
import TableComponent from "./TableComponent";

const OverviewDrawerComponent = ({ showModal, actionId }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [openedDropDown, setOpenDropdown] = useState("");
  const overviewService = new Overviewservice();
  const [value, setValue] = useState("");

  const { TextArea } = Input;
  const getkeys = useCallback(
    (type: string) => {
      if (type === "action") {
        return {
          currentVal: data.currentAction,
          allVal: data.allActions,
          currentKey: "currentAction",
        };
      }
      if ("rootCause" === type) {
        return {
          currentKey: "currentRootCause",
          currentVal: data.currentRootCause,
          allVal: data.allRootCause,
        };
      }
      if ("assignedTo" === type) {
        return {
          currentKey: "currentlyAssignedTo",
          currentVal: data.currentlyAssignedTo,
          allVal: data.canBeAssinedTo,
        };
      }
      return {
        currentVal: "",
        allVal: "",
        currentKey: "",
      };
    },
    [data]
  );
  const fetchDrawerData = async () => {
    await overviewService
      .getDrawerData()
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        message.error("Failed Loading Drawer Data");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchDrawerData();
  }, []);
  if (loading) {
    return (
      <Row justify="center" className={styles.kpi_wrapper}>
        <LoadingOutlined />
      </Row>
    );
  }

  const GetOverlay = ({ type }: any) => {
    const { currentVal, allVal, currentKey } = getkeys(type);
    return (
      <Menu
        className={`${styles.menu_component} ${"assignedTo" === type ? styles[`${type}_menu_component`] : ""
          }`}
        onOpenChange={(data) => {
          if (data.length) {
            setOpenDropdown(type);
          } else {
            setOpenDropdown("");
          }
        }}
        theme="dark"
        inlineIndent={0}
        mode="inline"
        style={{
          background: "#221F1F",
          height: "12px",
        }}
        items={
          "assignedTo" === type
            ? [
              {
                label: (
                  <>
                    <Avatar size={"small"}>
                      {currentVal.userName
                        .split(" ")
                        .map((word: string) => word[0])
                        .join("")}
                    </Avatar>
                    {"  "}
                    {currentVal.userName}
                  </>
                ),
                key: currentVal.userId,
                style: {
                  background: "#221F1F",
                },
                children: _.union([currentVal, ...allVal]).map((item) => {
                  return {
                    label: item.userName,
                    key: item.userId,
                    onClick: () => {
                      setData((prevData: any) => {
                        return {
                          ...prevData,
                          [currentKey]: {
                            userName: item.userName,
                            userId: item.userId,
                          },
                        };
                      });
                    },
                  };
                }),
              },
            ]
            : [
              {
                label: currentVal,
                key: currentVal,
                style: {
                  background: "#221F1F",
                  fontSize: "14px",
                },
                children: _.union([currentVal, ...allVal]).map((item) => {
                  return {
                    label: item,
                    key: item,
                    onClick: () => {
                      setData((prevData: any) => {
                        return { ...prevData, [currentKey]: item };
                      });
                    },
                  };
                }),
              },
            ]
        }
      />
    );
  };
  return (
    <Drawer
      onClose={() => showModal(null)}
      visible={actionId !== null}
      key={actionId}
      closable={false}
      maskClosable={true}
      destroyOnClose
      headerStyle={{ backgroundColor: "#111111", border: "none" }}
      title={
        <Row justify="end">
          <Col>
            <LinkOutlined style={{ color: "white" }} />
          </Col>
          <Col offset={1}>
            <CloseCircleOutlined
              style={{ color: "white" }}
              onClick={() => showModal(null)}
            />
          </Col>
        </Row>
      }
      width={"50vw"}
      style={{ backgroundColor: "rgba(0,0,0, 0.75)" }}
      drawerStyle={{ backgroundColor: "#221F1F" }}
    >
      <Row className={styles.store_location_row}>{data.storelocation}</Row>
      <Row>{data.storeName}</Row>
      <Divider dashed style={{ borderColor: "white" }} />
      <Row>
        <Col xs={18}>
          {[
            {
              type: "action",
              label: "Action",
            },
            {
              type: "rootCause",
              label: "Root Cause",
            },
            {
              type: "assignedTo",
              label: "Assigned To",
            },
          ].map((data, key) => {
            return (
              <Row
                justify="space-between"
                key={key}
                style={{ marginTop: "1.3rem" }}
              >
                <Col xs={5}>
                  <label className={styles.drawer_label}>{data.label}</label>
                </Col>
                <Col
                  xs={19}
                  onClick={() => {
                    setOpenDropdown(data.type);
                  }}
                  style={{
                    zIndex: data.type === openedDropDown ? 9999 : "auto",
                  }}
                >
                  <GetOverlay type={data.type} />
                </Col>
              </Row>
            );
          })}
        </Col>
        <Col xs={6}>
          <Button className={styles.drawer_mark}>
            <Space>
              <CheckOutlined />
              Mark Complete
            </Space>
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "1.3rem" }}>
        <Col xs={4}>
          <label className={styles.drawer_label}>Due Date</label>
        </Col>
        <Col xs={7}>
          <Space>
            <CalendarOutlined />
            {data.dueDate}
          </Space>
        </Col>
        <Col xs={2}>
          <label className={styles.drawer_label}>status</label>
        </Col>
        <Col xs={11}>
          <Select
            autoFocus
            mode="tags"
            defaultValue={[data.currentStatus]}
            size="small"
            style={{ width: "100%" }}
            dropdownClassName={styles.select_dropdown}
            tagRender={({ label, closable, onClose }) => {
              return (
                <Tag
                  color="green"
                  style={{ borderRadius: "15px" }}
                  closable={closable}
                  onClose={onClose}
                >
                  {label}
                </Tag>
              );
            }}
          >
            {data.allStatuses.map((statusItem: any) => {
              return (
                <Select.Option key={statusItem}>{statusItem}</Select.Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <Row style={{ marginTop: "1.3rem" }}>{CORE_SKUS_AVAILABLE}</Row>
      <Row style={{ backgroundColor: "#1E1E1E", marginTop: "1.3rem" }}>
        <TableComponent
          columns={availableSkusMetaData}
          dataSource={data.allSKUs}
          type=""
          isScroll={false}
        />
      </Row>
      <Row style={{ marginTop: "1.3rem" }} >
      <div className={styles.textBoxDiv}>
      <TextArea
        className={styles.textBox}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a comment or add an update or upload an image"
        autoSize={{
          minRows: 1,
          maxRows: 5,
        }}
      />
        </div>
      </Row>


    </Drawer>
  );
};
export default OverviewDrawerComponent;
