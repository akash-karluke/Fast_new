import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { filterProps } from "./filterSlice";
import _ from "lodash";
import axios from "axios";
import { Overviewservice } from "../../../components/Services/OverviewService";
import { message } from "antd";
const filterInitState: {
  loading: boolean;
  error: string;
  allFilters: filterProps;
  selectedFilters: any;
} = {
  loading: true,
  error: "",
  allFilters: {
    globalDivision: [],
    region: [],
    country: [],
    category: [],
    retailer: [],
    allStores: [],
    timeRange: {
      startDate: "",
      endDate: "",
    },
  },
  selectedFilters: {
    globalDivision: [],
    region: [],
    country: [],
    category: [],
    retailers: [],
    allStores: [],
    timeRange: {
      startDate: "",
      endDate: "",
    },
  },
};

export const fetchFilters: any = createAsyncThunk(
  "filters/getFilters",
  async (params: any) => {
    const filterData: any = await axios.get(
      // `${process.env.NEXT_PUBLIC_API_BASE_URL}globalFilters/${params.data.SalesRepID}`
      `${process.env.NEXT_PUBLIC_API_BASE_URL}globalFilters/3`
    );
    return filterData.data;
  }
);

export const fetchPartialFiters: any = createAsyncThunk(
  "filters/getPartialFilters",
  async ({ user, type, newValue, countryId }: any) => {
    console.log(type);
    // fetch retailer and store when category is changed
    if ("category" === type) {
      // return overviewService.getRetailersAPI(user.userId, newValue.id);
      return overviewService.getRetailersAPI(4, newValue.id);
    }
    if ("retailer" === type) {
      return overviewService.getStoresAPI(4, newValue.id);
      // return overviewService.getStoresAPI(user.userId, newValue.id);
    }
    if ("globalDivision" === type) {
      console.log("here");
      // return overviewService.getCategoryByGlobalDivisionAndCountry(
      //   user.userId,
      //   newValue,
      //   countryId
      // );
      return overviewService.getCategoryByGlobalDivisionAndCountry(
        4,
        newValue,
        countryId
      );
    }
  }
);
let TempFilters: any = {};
const overviewService = new Overviewservice();
export const filterSlice = createSlice({
  name: "filters",
  initialState: filterInitState,
  reducers: {
    addFilter: (state: any, action: any) => {
      const { filterType, newValue } = action.payload;
      if (["category", "retailer", "globalDivision", "allStores"].includes(filterType)) {
        state.selectedFilters[filterType] = newValue;
      }
    },
    deleteFilter: (state: any, action: any) => {
      _.remove(
        state.selectedFilters[action.payload.filterType],
        (filterVal) => {
          return filterVal === action.payload.valueToRemove;
        }
      );
    },
    selectAllFilter: (state: any, action: any) => {
      state.selectedFilters[action.payload.filterType] =
        state.allFilters[action.payload.filterType];
    },
    deleteAllFilter: (state: any, action: any) => {
      state.selectedFilters[action.payload.filterType] = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFilters.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.loading = false;
      const { GlobalDivision, Regions, Region, Country, Category, Retailer } =
        action.payload;
      state.allFilters = {
        ...action.payload,
        globalDivision: GlobalDivision,
        region: Regions,
        country: Region.Country,
        category: Country.Category,
        retailer: Category.Retailer,
        allStores: Retailer.Store,
      };
      state.selectedFilters = {
        globalDivision: GlobalDivision[0],
        region: { name: Regions[0].RegionName, id: Regions[0].RegionID },
        country: { name: Country.CountryName, id: Country.CountryID },
        category: { name: Category.CategoryName, id: Category.CategoryID },
        retailer: { name: Retailer.RetailerName, id: Retailer.RetailerID },
        allStores: [
          { name: Retailer.Store[0].StoreName, id: Retailer.Store[0].StoreID },
        ],
        timeRange: {
          startDate: "",
          endDate: "",
        },
      };
    });
    builder.addCase(fetchPartialFiters.rejected, (state, action) => {
      console.log("state", state, action);
    });
    builder.addCase(fetchPartialFiters.pending, (state, action) => {
      if ("category" === action.meta.arg.type) {
        TempFilters.allStores = state.allFilters.allStores;
        TempFilters.retailer = state.allFilters.retailer;
        state.allFilters.allStores = "LOADING";
        state.allFilters.retailer = "LOADING";
      }
      if ("retailer" === action.meta.arg.type) {
        TempFilters.allStores = state.allFilters.allStores;
        state.allFilters.allStores = "LOADING";
      }
      if ("globalDivision" === action.meta.arg.type) {
        TempFilters.category = state.allFilters.category;
        TempFilters.allStores = state.allFilters.allStores;
        TempFilters.retailer = state.allFilters.retailer;
        state.allFilters.category = "LOADING";
        state.allFilters.allStores = "LOADING";
        state.allFilters.retailer = "LOADING";
      }
    });
    builder.addCase(fetchPartialFiters.fulfilled, (state, action) => {
      console.log(action);
      if ("category" === action.meta.arg.type) {
        state.allFilters.retailer = action.payload.data.Category.Retailer;
        state.selectedFilters.retailer = {
          name: action.payload.data.Retailer.RetailerName,
          id: action.payload.data.Retailer.RetailerID,
        };
        state.selectedFilters.allStores = [
          {
            name: action.payload.data.Retailer.Store[0].StoreName,
            id: action.payload.data.Retailer.Store[0].StoreID,
          },
        ];
        state.allFilters.allStores = action.payload.data.Retailer.Store;
      }
      if ("retailer" === action.meta.arg.type) {
        state.selectedFilters.allStores = [
          {
            name: action.payload.data.Retailer.Store[0].StoreName,
            id: action.payload.data.Retailer.Store[0].StoreID,
          },
        ];
        state.allFilters.allStores = action.payload.data.Retailer.Store;
      }
      if ("globalDivision" === action.meta.arg.type) {
        if (action.payload.data.Country.Category.length > 0) {
          state.allFilters.category = action.payload.data.Country.Category;
          state.allFilters.retailer = action.payload.data.Category.Retailer;
          state.allFilters.allStores = action.payload.data.Retailer.Store;
          state.selectedFilters.category = {
            name: action.payload.data.Country.Category[0].ProductCategory,
            id: action.payload.data.Country.Category[0].CategoryId,
          };
          state.selectedFilters.retailer = {
            name: action.payload.data.Retailer.RetailerName,
            id: action.payload.data.Retailer.RetailerID,
          };
          state.selectedFilters.allStores = [
            {
              name: action.payload.data.Retailer.Store[0].StoreName,
              id: action.payload.data.Retailer.Store[0].StoreID,
            },
          ];
          state.allFilters.allStores = action.payload.data.Retailer.Store;
        } else {
          state.allFilters.category = "NONE_FOUND";
          state.allFilters.allStores = "NONE_FOUND";
          state.allFilters.retailer = "NONE_FOUND";
        }
      }
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      if ("category" === action.meta.arg.type) {
        state.allFilters.allStores = TempFilters.allStores;
        state.allFilters.retailer = TempFilters.retailer;
      }
      if ("retailer" === action.meta.arg.type) {
        state.allFilters.allStores = TempFilters.allStores;
      }
      if ("globalDivision" === action.meta.arg.type) {
        state.allFilters.category = TempFilters.category;
        state.allFilters.allStores = TempFilters.allStores;
        state.allFilters.retailer = TempFilters.retailer;
      }
      message.error("Failed fetching Filters");
    });
  },
});

export default filterSlice.reducer;
export const { addFilter, deleteFilter, selectAllFilter, deleteAllFilter } =
  filterSlice.actions;
