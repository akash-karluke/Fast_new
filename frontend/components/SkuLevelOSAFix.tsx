import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Col,
  Divider,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Overviewservice } from "./Services/OverviewService";
import skuFixTableMetaData from "./TablesMetaData/skuFixTableMetaData.json";
import {
  CloseCircleOutlined,
  CheckOutlined,
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { modifySkuData } from "./Utils";
import { Logbookservice } from "./Services/LogbookService";
import _ from "lodash";
import { RcFile } from "antd/lib/upload";

const SkuLevelOSAFix = ({ setShowModal, showModal }: any) => {
  const logBookService = new Logbookservice();
  const [initData, setInitData] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [otherDesc, setOtherDesc] = useState<any>(null);
  const overviewService = new Overviewservice();
  const [detailedRootCause, setDetailedrootCause] = useState("");
  const [comment, setComment] = useState<any>({});
  const [isIndividual, setIsIndividual] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkOpData, setbulkOpData] = useState({
    comment: null,
    image: null,
    rootCause: null,
    availabiltyStatus: null,
  });
  const [multipleSkuFixTableDataIndexes, setMultipleSkuFixTableDataIndexes] =
    useState(["ean", "desc", "avaiabilityStatus"]);

  const skuFixTableColumnsCheckboxes = [
    {
      label: "SKU EAN",
      value: "ean",
      disabled: true,
    },
    {
      label: "SKU Description",
      value: "desc",
    },
    {
      label: "Availability",
      value: "avaiabilityStatus",
    },
    {
      label: "Root Cause",
      value: "rootCause",
    },
    {
      label: "User Comments",
      value: "comment",
    },
    {
      label: "Image",
      value: "image",
    },
  ];
  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(initData)) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  }, [JSON.stringify(data)]);

  const fetchDrawerData = async () => {
    await overviewService
      .getDrawerData()
      .then((res) => {
        setData(res);
        setInitData(JSON.parse(JSON.stringify(res)));
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
  useEffect(() => {
    // nothing here
  }, [JSON.stringify(data)]);

  const [reassigneeList, setReassgineeList] = useState<any>([]);

  const [multipleSkuFixMetaData, setMultipleSkuFixMetaData] = useState<any>(
    multipleSkuFixTableDataIndexes.map((index: string) => {
      return _.find(skuFixTableMetaData, { dataIndex: index });
    })
  );

  useEffect(() => {
    setMultipleSkuFixMetaData(
      multipleSkuFixTableDataIndexes.map((index: string) => {
        const column: any = _.find(skuFixTableMetaData, { dataIndex: index });
        delete column.width;
        return column;
      })
    );
  }, [multipleSkuFixTableDataIndexes]);
  if (loading) {
    return <Row justify="center" className={styles.kpi_wrapper}></Row>;
  }

  return (
    <>
      <Modal
        visible={showModal}
        width="90vw"
        className="sku_fix_modal"
        closeIcon={
          <CloseCircleOutlined
            style={{ color: "white" }}
            onClick={() => setShowModal(null)}
          />
        }
        footer={[
          <Badge key="badge" dot={isChanged ? true : false}>
            <Button key="submit">Submit</Button>
          </Badge>,
        ]}
        title={
          <>
            <Row className={styles.store_location_row}>
              {data.store.location}
            </Row>
            <Row>{data.store.name}</Row>
          </>
        }
        zIndex={3}
        destroyOnClose
      >
        <>
          <Row justify="space-between" style={{ marginBottom: "1rem" }}>
            <Col>{data.actionFor}</Col>
            <Button className={styles.drawer_mark}>
              <Space>
                <CheckOutlined />
                Mark Complete
              </Space>
            </Button>
          </Row>
          <Row>
            <Col xs={16}>
              <Row justify="space-between" style={{ marginTop: "1.3rem" }}>
                <Col xs={5}>
                  <label className={styles.drawer_label}>Assigned To</label>
                </Col>
                <Col xs={19}>
                  <Avatar size={"small"}>
                    {data.currentlyAssignedTo.name
                      .split(" ")
                      .map((word: string) => word[0])
                      .join("")}
                  </Avatar>
                  <AutoComplete
                    style={{ width: 200 }}
                    onSelect={(value: string, option: any) => {
                      setData((prevData: any) => {
                        return {
                          ...prevData,
                          currentlyAssignedTo: {
                            name: value,
                            userId: option.key,
                          },
                        };
                      });
                    }}
                    onSearch={_.debounce((value) => {
                      logBookService.handleSearch(
                        value,
                        data.store,
                        setReassgineeList
                      );
                    }, 400)}
                    placeholder={data.currentlyAssignedTo.name}
                  >
                    {reassigneeList.map((reassignee: any) => (
                      <AutoComplete.Option
                        backfill
                        key={reassignee.SalesRepId}
                        value={
                          reassignee.SalesRepFirstName +
                          " " +
                          reassignee.SalesRepMiddleName
                        }
                      >
                        {reassignee.SalesRepFirstName +
                          " " +
                          reassignee.SalesRepMiddleName}
                      </AutoComplete.Option>
                    ))}
                  </AutoComplete>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: "1.3rem" }}>
            <Col xs={16}>
              <Row>
                <Col xs={5}>
                  <label className={styles.drawer_label}>Due Date</label>
                </Col>
                <Col xs={19}>
                  <Space>
                    <CalendarOutlined />
                    {data.dueDate}
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col xs={8}>
              <Row>
                <Col xs={4}>
                  <label className={styles.drawer_label}>Status</label>
                </Col>
                <Col xs={20}>
                  <Select
                    autoFocus
                    mode="tags"
                    defaultValue={[data.currentStatus.value]}
                    size="small"
                    style={{ width: "100%" }}
                    dropdownClassName={styles.select_dropdown}
                    onSelect={(value: any, option: any) => {}}
                    options={data.allStatuses.map((status: any) => {
                      return { value: status.value };
                    })}
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
                  ></Select>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider dashed style={{ borderColor: "white" }} />
          <Row
            style={{
              marginBottom: "1rem",
              marginTop: "1rem",
              justifyContent: "space-between",
            }}
          >
            <Col>
              <Space>
                <Switch
                  onChange={() => setIsIndividual((prev: boolean) => !prev)}
                  checked={isIndividual}
                  // checkedChildren={"One SKU at a Time"}
                  // unCheckedChildren={"Multiple SKUs at a Time"}
                />
                {"One Sku At a time"}
              </Space>
            </Col>
            <Button
              key="submit"
              onClick={() => {
                selectedRows.map((selectedRow: any) => {
                  selectedRow = `${selectedRow}`;
                  setData((prevData: any) => {
                    return {
                      ...prevData,
                      allSku: {
                        ...prevData.allSku,
                        [selectedRow]: {
                          ...prevData.allSku[selectedRow],
                          comment: bulkOpData.comment,
                          rootCause: bulkOpData.rootCause,
                          image: bulkOpData.image,
                          avaiabilityStatus:
                            bulkOpData.availabiltyStatus !== null
                              ? bulkOpData.availabiltyStatus
                              : prevData.allSku[selectedRow].avaiabilityStatus,
                        },
                      },
                    };
                  });
                });
                setbulkOpData({
                  comment: null,
                  image: null,
                  rootCause: null,
                  availabiltyStatus: null,
                });
                message.success("saved your changes!!");
              }}
            >
              Save as Draft
            </Button>
          </Row>
          <Row style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            {isIndividual
              ? "Update SKU's one by one:"
              : "Select SKU's And Update All Those At Once:"}
          </Row>
          {isIndividual && (
            <Table
              columns={logBookService.decorateSkuLevelFixesColumn(
                skuFixTableMetaData,
                data,
                comment,
                setData,
                setOtherDesc,
                setComment
              )}
              dataSource={modifySkuData(data)}
              className={styles.osaTable}
              rowClassName="edgieAllStarsTable"
              style={{ marginTop: "1rem" }}
              scroll={{ y: "300px" }}
            />
          )}

          {!isIndividual && (
            <>
              <Row justify="space-between" style={{ marginBottom: "1rem" }}>
                Select Columns You Want To See:
                <Checkbox.Group
                  className={styles.column_option_checkbox}
                  options={skuFixTableColumnsCheckboxes}
                  defaultValue={multipleSkuFixTableDataIndexes}
                  onChange={(checkboxIndexes: any) => {
                    setMultipleSkuFixTableDataIndexes(checkboxIndexes);
                  }}
                />
              </Row>
              <Divider dashed style={{ borderColor: "white" }} />
              <Row justify="space-between">
                <Col
                  xs={
                    multipleSkuFixMetaData.length * 4 + 1 > 16
                      ? 16
                      : multipleSkuFixMetaData.length * 4 + 1
                  }
                >
                  <Table
                    columns={logBookService.decorateSkuLevelFixesColumn(
                      multipleSkuFixMetaData,
                      data,
                      comment,
                      setData,
                      setOtherDesc,
                      setComment,
                      true
                    )}
                    dataSource={modifySkuData(data)}
                    className={styles.osaTable}
                    rowClassName="edgieAllStarsTable"
                    style={{ marginTop: "1rem" }}
                    scroll={{ y: "300px" }}
                    rowSelection={{
                      selectedRowKeys: selectedRows,
                      onChange: (newlySelectedRowsKeys: any) => {
                        setSelectedRows(newlySelectedRowsKeys);
                      },
                    }}
                    pagination={false}
                  />
                </Col>
                <Col
                  offset={1}
                  xs={
                    multipleSkuFixMetaData.length * 4 + 1 > 16
                      ? 7
                      : 22 - multipleSkuFixMetaData.length * 4
                  }
                >
                  <Row justify="center" style={{ marginTop: "1.3rem" }}>
                    <Col xs={24}>
                      <Row justify="center" style={{ marginBottom: "1rem" }}>
                        Fix the SKUs Selected in Left Panel{" "}
                        {`(Selected: ${selectedRows.length} / ${
                          Object.keys(data.allSku).length
                        } )`}
                      </Row>
                      <Row style={{ marginBottom: "2rem" }} align="middle">
                        <Col xs={5}>
                          <label className={styles.drawer_label}>
                            Root Cause:
                          </label>
                        </Col>
                        <Col xs={19}>
                          <Select
                            disabled={bulkOpData.availabiltyStatus === 1}
                            showSearch
                            placeholder="Select Root Cause"
                            optionFilterProp="children"
                            onSelect={(value: string, option: any) => {
                              console.log("value", value, "option", option);
                              if (+option.key !== 4) {
                                setbulkOpData((prevData: any) => {
                                  return {
                                    ...prevData,
                                    rootCause: { desc: value, id: +option.key },
                                  };
                                });
                              } else {
                                setOtherDesc(true);
                              }
                            }}
                            style={{
                              width: "15rem",
                              opacity:
                                bulkOpData.availabiltyStatus === 1 ? 0.5 : 1,
                            }}
                            filterOption={(input, option: any) => {
                              return option!.children
                                .toLowerCase()
                                .includes(input.toLowerCase());
                            }}
                          >
                            {data.allRootCause.map((rootCause: any) => {
                              return (
                                <Select.Option
                                  key={rootCause.id}
                                  value={rootCause.type}
                                >
                                  {rootCause.type}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: "2rem" }}>
                        <Col xs={5}>
                          <label className={styles.drawer_label}>
                            Availability Status:
                          </label>
                        </Col>
                        <Col xs={19}>
                          <Radio.Group
                            onChange={(e) =>
                              setbulkOpData((prevData) => {
                                console.log(e.target.value);
                                return {
                                  ...prevData,
                                  availabiltyStatus: e.target.value,
                                };
                              })
                            }
                          >
                            <Space>
                              <Radio value={1} style={{ color: "green" }}>
                                {" "}
                                Available{" "}
                              </Radio>
                              <Radio value={0} style={{ color: "red" }}>
                                {" "}
                                Unavailable{" "}
                              </Radio>
                            </Space>
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: "2rem" }} align="middle">
                        <Col xs={5}>
                          <label className={styles.drawer_label}>
                            Comment:
                          </label>
                        </Col>
                        <Col xs={19}>
                          <Input.TextArea
                            className="dark_theme_textarea"
                            placeholder="Enter Comment (if any)..."
                            rows={4}
                            onChange={(e) => {
                              console.log(bulkOpData);
                              setbulkOpData((prevData: any) => {
                                return {
                                  ...prevData,
                                  comment: e.target.value,
                                };
                              });
                            }}
                          ></Input.TextArea>
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: "2rem" }} align="middle">
                        <Col xs={5}>
                          <label className={styles.drawer_label}>Image:</label>
                        </Col>
                        <Col xs={19}>
                          {bulkOpData.image ? (
                            <>
                              <Image
                                src={bulkOpData.image}
                                width={"8rem"}
                                height="8rem"
                              />
                              <DeleteOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setbulkOpData((prevData) => {
                                    return {
                                      ...prevData,
                                      image: null,
                                    };
                                  })
                                }
                              />
                            </>
                          ) : (
                            <Upload
                              accept="image/*"
                              style={{
                                color: "white",
                                border: "1px solid white !important",
                              }}
                              listType="picture-card"
                              beforeUpload={(file: UploadFile, fileList) => {
                                logBookService
                                  .getBase64(file as RcFile)
                                  .then((res: any) => {
                                    file.preview = res;
                                    setbulkOpData((prevData) => {
                                      return {
                                        ...prevData,
                                        image: res,
                                      };
                                    });
                                  });
                                return false;
                              }}
                            >
                              <div>
                                <PlusOutlined />
                                <div>Upload</div>
                              </div>
                            </Upload>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          )}
        </>
      </Modal>
      {otherDesc && (
        <Modal
          zIndex={4}
          className="sku_fix_modal"
          closeIcon={
            <CloseCircleOutlined
              style={{ color: "white" }}
              onClick={() => setOtherDesc(null)}
            />
          }
          title={<Row>{"Provide Details For Other's Root Cause"}</Row>}
          width={"50vw"}
          visible={otherDesc !== null}
          onOk={() => {
            if (true === otherDesc) {
              // true means being set from all sku at once
              setbulkOpData((prevData: any) => {
                return {
                  ...prevData,
                  rootCause: {
                    id: 4,
                    desc: detailedRootCause.trim(),
                  },
                };
              });
            } else {
              setData((prevData: any) => {
                return {
                  ...prevData,
                  allSku: {
                    ...prevData.allSku,
                    [otherDesc]: {
                      ...prevData.allSku[otherDesc],
                      rootCause: { id: 4, desc: detailedRootCause.trim() },
                    },
                  },
                };
              });
            }

            setOtherDesc(null);
          }}
          onCancel={() => {
            if (true === otherDesc) {
              message.error("failed setting Others as Root Cause");
              setbulkOpData((prevData: any) => {
                return {
                  ...prevData,
                  rootCause: {
                    desc: "Store has not received the stock",
                    id: 1,
                  },
                };
              });
              // true means being set from all sku at once
            } else {
              setData((prevData: any) => {
                return {
                  ...prevData,
                  allSku: {
                    ...prevData.allSku,
                    [otherDesc]: {
                      ...prevData.allSku[otherDesc],
                      rootCause:
                        initData.allSku[otherDesc].rootCause !== null
                          ? initData.allSku[otherDesc].rootCause
                          : data.allSku[otherDesc].rootCause !== null
                          ? data.allSku[otherDesc].rootCause
                          : {
                              id: 1,
                              desc: "Store has not received the stock",
                            },
                    },
                  },
                };
              });
            }
            setOtherDesc(null);
          }}
          destroyOnClose
        >
          <>
            <textarea
              autoFocus
              style={{
                width: "45vw",
                height: "10rem",
                marginTop: "1rem",
                backgroundColor: "#221F1F",
              }}
              onChange={(e) => {
                setDetailedrootCause(e.target.value);
              }}
            />
          </>
        </Modal>
      )}
    </>
  );
};
export default SkuLevelOSAFix;
