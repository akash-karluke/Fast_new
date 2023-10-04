import {
  Button,
  Col,
  Dropdown,
  Menu,
  Radio,
  Row,
  Skeleton,
  Slider,
  Space,
  Tooltip,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.css";
import {
  DownOutlined,
  UpOutlined,
  CalendarOutlined,
  RightCircleOutlined,
  RightSquareFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  addFilter,
  deleteFilter,
  selectAllFilter,
  deleteAllFilter,
  fetchPartialFiters,
} from "../store/features/filters";
import { getFilterText } from "./Utils";
import { SliderMarks } from "antd/lib/slider";

const FilterSection = () => {
  const { allFilters, selectedFilters } = useSelector(
    (state: any) => state.filters
  );
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const getKey = (type: string) => {
    if (type == "category")
      return { name: "ProductCategory", id: "CategoryID" };
    if (type === "retailer") return { name: "RetailerName", id: "RetailerID" };
    if (type === "allStores") return { name: "StoreName", id: "StoreID" };
    if (type === "region") return { name: "RegionName", id: "RegionID" };
    if (type === "country") return { name: "CountryName", id: "CountryID" };
    return { name: "", id: "" };
  };

  const getClassName = (type: string) => {
    if (["category", "retailer", "country", "region"].includes(type)) {
      return `${styles.dropdown_scroll} ${styles.filter_width}
      ${
        selectedFilters[type].id
          ? styles.filter_active_dropdown
          : styles.filter_dropdown
      }`;
    }
    if ("globalDivision" === type) {
      return `${styles.dropdown_scroll} ${styles.filter_width}
      ${
        selectedFilters[type]
          ? styles.filter_active_dropdown
          : styles.filter_dropdown
      }`;
    }
    if ("allStores" === type) {
      return `${styles.dropdown_scroll} ${styles.filter_width}
      ${
        selectedFilters[type].length > 0
          ? styles.filter_active_dropdown
          : styles.filter_dropdown
      }`;
    }
    return "";
  };
  const [FilterOpened, setFilterOpened] = useState<
    | "globalDivision"
    | ""
    | "region"
    | "country"
    | "category"
    | "retailer"
    | "allStores"
  >("");

  const marks: SliderMarks = {
    "-52": {
      style: {
        color: "#fff",
      },
      label: <strong>-52</strong>,
    },
    "0": {
      style: {
        color: "#fff",
      },
      label: <strong>0</strong>,
    },
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <h4 style={{ color: "white" }}>Week Range</h4>
        <Slider
          marks={marks}
          // trackStyle={{ backgroundColor: "#2251ff" }}
          range
          defaultValue={[-52, 0]}
          min={-52}
          max={0}
        />
      </Menu.Item>
    </Menu>
  );

  const getMenu = (type = "globalDivision") => {
    const { name, id } = getKey(type);
    if (["category", "retailer", "region", "country"].includes(type)) {
      return (
        <Menu className={styles.filterScroll}>
          {allFilters[type].map((filterVal: any, index: number) => {
            return (
              <Menu.Item key={index}>
                <Radio
                  checked={selectedFilters[type].id === filterVal[id]}
                  // style={{background: `${selectedFilters[type][id] === filterVal[id] ? 'white' : 'black'}`, color: `${selectedFilters[type][id] === filterVal[id] ? 'black' : 'white'}`}}
                  value={
                    selectedFilters[type].id === filterVal[id]
                      ? "checked"
                      : "unchecked"
                  }
                  onClick={(e: any) => {
                    setFilterOpened("");
                    if (e.target.value === "checked") {
                      // already checked code to unselect filter
                      // dispatch(
                      //   deleteFilter({
                      //     filterType: type,
                      //     valueToRemove: filterVal,
                      //   })
                      // );
                      // e.target.value = "unchecked";
                    } else {
                      // code to select filter
                      dispatch(
                        addFilter({
                          filterType: type,
                          newValue: {
                            name: filterVal[name],
                            id: filterVal[id],
                          },
                        })
                      );
                      dispatch(
                        fetchPartialFiters({
                          user,
                          type,
                          newValue: {
                            name: filterVal[name],
                            id: filterVal[id],
                          },
                        })
                      );
                      e.target.value = "checked";
                    }
                  }}
                >
                  {filterVal[name]}
                </Radio>
              </Menu.Item>
            );
          })}
        </Menu>
      );
    }
    if ("globalDivision" === type) {
      return (
        <Menu>
          {allFilters[type].map((stringFilterVal: string, index: number) => {
            return (
              <Menu.Item key={index}>
                <Radio
                  checked={selectedFilters[type] === stringFilterVal}
                  value={
                    selectedFilters[type] === stringFilterVal
                      ? "checked"
                      : "unchecked"
                  }
                  onClick={(e: any) => {
                    setFilterOpened("");
                    if (e.target.value === "checked") {
                      // already checked code to unselect filter
                      // dispatch(
                      //   deleteFilter({
                      //     filterType: type,
                      //     valueToRemove: filterVal,
                      //   })
                      // );
                      e.target.value = "unchecked";
                    } else {
                      // code to select filter
                      dispatch(
                        addFilter({
                          filterType: type,
                          newValue: stringFilterVal,
                        })
                      );
                      dispatch(
                        fetchPartialFiters({
                          user,
                          type,
                          newValue: stringFilterVal,
                          countryId:
                            selectedFilters.country.id,
                        })
                      );
                      e.target.value = "checked";
                    }
                  }}
                >
                  {stringFilterVal}
                </Radio>
              </Menu.Item>
            );
          })}
        </Menu>
      );
    }
    if ("allStores" === type) {
      const selectedStoreIds = selectedFilters[type].map(
        (store: any) => store.StoreID
      );
      return (
        <Menu className={styles.filterScroll}>
          {allFilters[type].map((filterVal: any, index: number) => {
            return (
              <Menu.Item key={index}>
                <Radio
                  checked={selectedStoreIds.includes(filterVal[id])}
                  // style={{background: `${selectedFilters[type][id] === filterVal[id] ? 'white' : 'black'}`, color: `${selectedFilters[type][id] === filterVal[id] ? 'black' : 'white'}`}}
                  value={
                    selectedStoreIds.includes(filterVal[id])
                      ? "checked"
                      : "unchecked"
                  }
                  onClick={(e: any) => {
                    setFilterOpened("");
                    if (e.target.value === "checked") {
                      // already checked code to unselect filter
                      // dispatch(
                      //   deleteFilter({
                      //     filterType: type,
                      //     valueToRemove: filterVal,
                      //   })
                      // );
                      // e.target.value = "unchecked";
                    } else {
                      // code to select filter
                      dispatch(
                        addFilter({
                          filterType: type,
                          newValue: [{
                            name: filterVal[name],
                            id: filterVal[id],
                          }],
                        })
                      );
                      e.target.value = "checked";
                    }
                  }}
                >
                  {'store-'}{filterVal[id]}
                </Radio>
              </Menu.Item>
            );
          })}
        </Menu>
      );
    }
    return <Menu></Menu>;
  };
  return (
    <Row className={styles.filter_wrapper}>
      <Col xs={24}>
        <Row
          className={styles.filter_container}
          gutter={[16, 24]}
          justify="space-between"
        >
          {[
            "globalDivision",
            "region",
            "country",
            "category",
            "retailer",
            "allStores",
          ].map((type: any, index: number) => {
            if (allFilters[type] === "LOADING") {
              return (
                <Skeleton.Button
                  style={{ width: "10rem", height: "3rem" }}
                  active
                />
              );
            }
            if (allFilters[type] === 'NONE_FOUND') {
              console.log(type, 'in nonw')
              return;
            }
            return (
              <Dropdown
                placement="bottom"
                key={index + 1}
                className={getClassName(type)}
                overlay={getMenu(type)}
                trigger={["click"]}
                onVisibleChange={(visible) => {
                  if (visible) setFilterOpened(type);
                  else setFilterOpened("");
                }}
                overlayClassName={styles.filter_dropdown_plate}
              >
                <Tooltip
                  title={
                    "allStores" === type
                      ? getFilterText(selectedFilters[type])
                      : selectedFilters[type].name || selectedFilters[type]
                  }
                >
                  <Button>
                    {"allStores" === type
                      ? getFilterText(selectedFilters[type])
                      : selectedFilters[type].name || selectedFilters[type]}
                    {type === FilterOpened ? <UpOutlined /> : <DownOutlined />}
                  </Button>
                </Tooltip>
              </Dropdown>
            );
          })}
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            overlayClassName={`${styles.filter_dropdown_plate} ${styles.time_width}`}
          >
            <Button className={styles.filter_dropdown}>
              <CalendarOutlined />
            </Button>
          </Dropdown>
          {/* <RightCircleOutlined  style={{ fontSize: '40px'}} />
          <RightSquareFilled  style={{ fontSize: '40px'}} /> */}
          <Button
            style={{
              background: "black",
              color: "white",
              border: "none",
              height: "42px",
            }}
          >
            <ArrowRightOutlined style={{ fontSize: "2.5rem" }} />
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

export default FilterSection;
