import _ from "lodash";
import { mockLogBookData } from "../../store/MockData/mocklogbookData";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeFilled,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Image,
  Input,
  message,
  Popover,
  Row,
  Select,
  Switch,
  Upload,
  UploadFile,
} from "antd";
import { skuFixData } from "../../store/MockData/skuFixData";
import { Option } from "antd/lib/mentions";
import { RcFile } from "antd/lib/upload";
import axios from "axios";

export class Logbookservice {
  getLogBookTableData = (currentPage: number, recordsPerPage: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newData = Object.assign({}, mockLogBookData);
        newData.data = mockLogBookData.data
          .slice(
            (currentPage - 1) * recordsPerPage,
            (currentPage - 1) * recordsPerPage + recordsPerPage
          )
          .map((item, index) => {
            return {
              ...item,
              serialNumber: (currentPage - 1) * recordsPerPage + index + 1,
            };
          });
        resolve({ data: newData });
      }, 1000);
    });
  };

  decorateColumns = (columns: any[] = []) => {
    const columnMeta = columns;
    const currentOSApercentageCol = _.find(columnMeta, {
      dataIndex: "currentOSAPercentage",
    });

    if (currentOSApercentageCol) {
      currentOSApercentageCol.render = (text: string, record: any) => {
        if (record.previousWeekOSAPercentage < record.currentOSAPercentage) {
          return (
            <span
              style={{
                color: "#07D34E",
                fontSize: "0.875rem",
                fontWeight: "900",
              }}
            >
              <Badge count={<ArrowUpOutlined style={{ color: "#07D34E" }} />} />
              {text}
            </span>
          );
        }
        return (
          <span
            style={{ color: "red", fontSize: "0.875rem", fontWeight: "900" }}
          >
            <Badge count={<ArrowDownOutlined style={{ color: "red" }} />} />
            {text}
          </span>
        );
      };
    }

    const actionPerformedCol = _.find(columnMeta, {
      dataIndex: "actionPerformed",
    });

    if (actionPerformedCol) {
      actionPerformedCol.render = (text: string) => {
        return <span style={{ fontSize: "0.75rem" }}>{text}</span>;
      };
    }
    return columnMeta;
  };

  rootCauseHandler = (
    sku: any,
    newRootCause: any,
    setData: any,
    setOtherDesc: any
  ) => {
    if ("Others" !== newRootCause.desc) {
      setData((prevData: any) => {
        return {
          ...prevData,
          allSku: {
            ...prevData.allSku,
            [sku]: {
              ...prevData.allSku[sku],
              rootCause: { ...newRootCause },
            },
          },
        };
      });
    } else {
      setOtherDesc(sku);
    }
  };

  decorateSkuLevelFixesColumn = (
    columns: any,
    skufixData: any,
    comment: any,
    setSkuFixData: any,
    setOtherDesc: any,
    setComment: any,
    isStatic: boolean = false
  ) => {
    const columnMeta = columns;
    const rootCauseColumn = _.find(columnMeta, {
      dataIndex: "rootCause",
    });
    if (rootCauseColumn) {
      rootCauseColumn.render = (text: string, record: any, index: number) => {
        if (isStatic) {
          if (!record.rootCause) {
            return <span>-</span>;
          }
          return (
            <span>
              {skufixData.allSku[record.ean].rootCause?.id === 4
                ? "Others"
                : record.rootCause}
              {skufixData.allSku[record.ean].rootCause?.id === 4 && (
                <Popover content={record.rootCause}>
                  <EyeFilled />
                </Popover>
              )}
            </span>
          );
        }
        return record.avaiabilityStatus === 0 ? (
          <>
            <Select
              value={
                skuFixData.allRootCause
                  .map((cause) => cause.type)
                  .includes(record.rootCause)
                  ? record.rootCause
                  : "Others"
              }
              className={"skufix_select"}
              onChange={(value: string, option: any) => {
                this.rootCauseHandler(
                  record.ean,
                  { id: parseInt(option.key), desc: value },
                  setSkuFixData,
                  setOtherDesc
                );
              }}
            >
              {skufixData.allRootCause.map((rootCause: any) => {
                return (
                  <Option key={rootCause.id} value={rootCause.type}>
                    {rootCause.id === 4 ? "Others" : rootCause.type}
                  </Option>
                );
              })}
            </Select>
            {skufixData.allSku[record.ean].rootCause.id === 4 && (
              <Popover content={record.rootCause}>
                <EyeFilled />
              </Popover>
            )}
          </>
        ) : (
          <Select
            className={"skufix_select skufix_select_disabled"}
            style={{ color: "white", opacity: `${0.5} !important` }}
            disabled
            defaultValue={skufixData.allRootCause[0].type}
          ></Select>
        );
      };
    }

    const availabilityColumn = _.find(columnMeta, {
      dataIndex: "avaiabilityStatus",
    });
    if (availabilityColumn) {
      availabilityColumn.render = (text: any, record: any) => {
        if (isStatic) {
          return (
            <span
              style={{
                color: `${record.avaiabilityStatus === 0 ? "red" : "green"}`,
              }}
            >
              {record.avaiabilityStatus === 0 ? "unavailable" : "available"}
            </span>
          );
        }
        return (
          <Switch
            className={`sku_switch ${
              0 === text
                ? "availiablilty_switch"
                : "availiablilty_switch_active"
            }`}
            checkedChildren="Available"
            unCheckedChildren="Unavailable"
            checked={1 == text}
            onChange={() => this.handleStatusChange(record.ean, setSkuFixData)}
          />
        );
      };
    }

    const userCommentColumn = _.find(columnMeta, {
      dataIndex: "comment",
    });
    if (userCommentColumn) {
      userCommentColumn.render = (text: any, record: any, index: any) => {
        if (isStatic) {
          if (!record.comment) {
            return <span>-</span>;
          }
          return <span>{record.comment}</span>;
        }
        return (
          <>
            <Input.TextArea
              disabled={record.avaiabilityStatus === 1}
              autoFocus={index === 0}
              className="dark_theme_textarea"
              style={{ height: "100px" }}
              //  value={comment[record.ean]}
              onChange={(e) =>
                setComment((prevState: any) => {
                  return {
                    ...prevState,
                    [record.ean]: e.target.value.trim(),
                  };
                })
              }
            />
            <Row justify="end">
              {/* {console.log(record.comment,'1' , comment[record.ean],2, record.ean)} */}
              {record.avaiabilityStatus === 0 &&
                comment[record.ean] !== record.comment && (
                  <SendOutlined
                    onClick={(e: any) =>
                      this.commentHandler(
                        record.ean,
                        comment[record.ean],
                        setSkuFixData
                      )
                    }
                  />
                )}
            </Row>
          </>
        );
      };
    }
    const imageColumn = _.find(columnMeta, {
      dataIndex: "image",
    });
    if (imageColumn) {
      imageColumn.render = (text: any, record: any) => {
        if (isStatic) {
          if (!record.image) {
            return <span>-</span>;
          }
          return <Image src={record.image} width={"8rem"} height="8rem" />;
        }
        return null === record.image ? (
          <Row>
            <Upload
              disabled={record.avaiabilityStatus === 1}
              accept="image/*"
              style={{ color: "white" }}
              listType="picture-card"
              beforeUpload={(file: UploadFile, fileList) => {
                this.getBase64(file as RcFile).then((res: any) => {
                  file.preview = res;
                  Logbookservice.handleImageUpload(
                    record.ean,
                    file.url || (file.preview as string),
                    setSkuFixData
                  );
                });

                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div>Upload</div>
              </div>
            </Upload>
          </Row>
        ) : (
          <Row justify="center">
            <Image src={record.image} width={"8rem"} height="8rem" />
            <DeleteOutlined
              style={{ cursor: "pointer" }}
              onClick={() =>
                setSkuFixData((prevData: any) => {
                  return {
                    ...prevData,
                    allSku: {
                      ...prevData.allSku,
                      [record.ean]: {
                        ...prevData.allSku[record.ean],
                        image: null,
                      },
                    },
                  };
                })
              }
            />
          </Row>
        );
      };
    }
    return columnMeta;
  };
  getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => {
        reject(error);
      };
    });
  commentHandler = (sku: any, newComment: any, setData: any) => {
    setData((prevData: any) => {
      return {
        ...prevData,
        allSku: {
          ...prevData.allSku,
          [sku]: {
            ...prevData.allSku[sku],
            comment: newComment,
          },
        },
      };
    });
    message.success("Saved your comment Successfully!! ");
  };
  static handleImageUpload = (sku: any, file: any, setData: any) => {
    setData((prevData: any) => {
      return {
        ...prevData,
        allSku: {
          ...prevData.allSku,
          [sku]: {
            ...prevData.allSku[sku],
            image: file,
          },
        },
      };
    });
  };
  handleStatusChange = (sku: any, setData: any) => {
    setData((prevData: any) => {
      const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      return {
        ...prevData,
        allSku: {
          ...prevData.allSku,
          [sku]: {
            ...prevData.allSku[sku],
            avaiabilityStatus:
              prevData.allSku[sku].avaiabilityStatus === 0 ? 1 : 0,
            rootCause:
              prevData.allSku[sku].avaiabilityStatus === 1
                ? {
                    id: 1,
                    desc: "Store has not received the stock",
                  }
                : null,
            dueDate:
              prevData.allSku[sku].avaiabilityStatus === 1
                ? "29 Sep 2022"
                : null,
          },
        },
      };
    });
  };

  handleSearch = (value: string, store: any, setList: any) => {
    value = value.trim();
    if (!value.length) {
      setList([]);
      return;
    }
    const [firstName, lastName, ...others] = value.split(" ");
    const firstNameletter = firstName.split("")[0];
    let lastNameLetter = "";
    if (lastName) {
      lastNameLetter = lastName.split("")[0];
    }
    let url = "";
    url = `${process.env.NEXT_PUBLIC_API_BASE_URL}salesRep/search-by-store?store_id=${store.id}&locationId=${store.locationId}&firstName=${firstNameletter}`;
    if (lastNameLetter) {
      url = `${url}$lastName${lastNameLetter}`;
    }
    axios
      .post(url)
      .then((res) => {
        setList(res.data);
      })
      .catch(() => setList([]));
  };
}
