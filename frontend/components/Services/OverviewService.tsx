import axios from "axios";
import { skuFixData } from "../../store/MockData/skuFixData";
export class Overviewservice {
  getRetailersAPI = (salesRepId: number, categoryId: string) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}globalFilters/get-retailers?salesRepId=${salesRepId}&categoryId=${categoryId}`
    );
  };

  getStoresAPI = (salesRepId: number, retailerId: string) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}globalFilters/get-stores?salesRepId=${salesRepId}&RetailerID=${retailerId}`
    );
  };

  getCategoryByGlobalDivisionAndCountry = (
    salesRepId: number,
    globalDivision: string,
    countryId: number
  ) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}globalFilters/get-categories-by-global-division?salesRepId=${salesRepId}&globalDivision=${globalDivision}&countryId=${countryId}`
    );
  };

  getKpiData = async (salesRepId: number,) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}KPI/get_kpi?SalesRepID=${salesRepId}
      `
      )
      .then((res: any) => {
        const data = res.data[0];
        const response = {
          numberOfRegions: data.Regions,
          numberOfRetailers: "33",
          numberOfBestPerformingStores: data.best_performing_stores,
          numberOfStoresWithLargestGrowthPotential:data.stores_with_growth_potential,
          netSalesIncrement: "50000",
          lastFiveVistsIncrement: "75000",
          numberOftargetSKUs: data.No_of_target_SKU,
          totalValueGaininEuros: Math.round(data.Total_Value_Gain),
          salesReprestative: data.Sales_Representative,
        };
        return response;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  getGrowthOpportunitiesTableData = async (
    currentPage: number,
    recordsPerPage: number,
    retailerId: number,
    salesRepId: number
  ) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}table/gettabledetails?page_num=${currentPage}&page_size=${recordsPerPage}&retailerId=${retailerId}&salesRepId=${salesRepId}`
      )
      .then((tableData) => {
        let response = tableData;
        response.data = tableData.data.map((item: any, index: any) => ({
          ...item,
          key: index + 1,
          CORE_OSA: Math.round(item.CORE_OSA * 100).toFixed(),
          Sales_Uplift: Math.round(item.Sales_Uplift).toFixed(),
          Full_OSA: Math.round(item.Full_OSA * 100).toFixed(),
          NPD_OSA: Math.round(item.NPD_OSA * 100).toFixed(),
          serialNumber: (currentPage - 1) * recordsPerPage + index + 1,
        }));
        return response;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  getTopRetailersData = async (
    salesRepId: number,
    globalDivision: string,
    countryId: number) => {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}salesRep/top_retailer?SalesRepID=${salesRepId}&GlobalDivision=${globalDivision}&CountryID=${countryId}`)
      .then((resp) => {
        return resp;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  static getOSAAreachartData = (type: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if ("weekly" === type) {
          resolve({
            target: 95,
            chartData: [
              {
                timeline: "20/2",
                "osa%": "70",
              },
              {
                timeline: "27/2",
                "osa%": "80",
              },
              {
                timeline: "6/3",
                "osa%": "90",
              },
              {
                timeline: "13/3",
                "osa%": "55",
              },
            ],
          });
        } else if ("monthly" === type) {
          resolve({
            target: 95,
            chartData: [
              {
                timeline: "feb 2022",
                "osa%": "71",
              },
              {
                timeline: "march 2022",
                "osa%": "60",
              },
              {
                timeline: "april 2022",
                "osa%": "88",
              },
              {
                timeline: "may 2022",
                "osa%": "55",
              },
            ],
          });
        } else {
          reject({});
        }
      });
    });
  };

  getDrawerData = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(skuFixData);
      }, 500);
    });
  };
  getRootCauseBreakUp = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            cause: "Store has not recieved the stock",
            valueInPercentage: 45,
          },
          {
            cause: "Product available in store, shelf not replenished",
            valueInPercentage: 22,
          },
          {
            cause: "PO not fulfilled due to logistics issue",
            valueInPercentage: 23,
          },
          {
            cause: "Others",
            valueInPercentage: 10,
          },
        ]);
      }, 500);
    });
  };
  getComplianceToAllKPIsData = async () => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}KPI/get_COMPLIANCE_TO_ALL_KPIS_DATA`
      )
      .then((resp: any) => {
        return resp;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  getEddgieStars = async (countryId: number, globalDivision: string) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}table/eddgie_all_star?CountryID=${countryId}&GlobalDivision=${globalDivision}`
      )
      .then((resp) => {
        let data = resp;

        data.data = resp.data.map((item: any) => ({
          ...item,
          OSAPercentage: Math.round(item.OSAPercentage * 100),
          lastCS: 50,
        }));
        return data;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  static getImageUrl = (accessToken: string) => {
    return axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer",
    });
  };

  getExecutiveSummary = async (salesRepId: number, categoryId: string) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}salesRep/get-summary?salesRepId=${salesRepId}&countryId=${categoryId}`
      )
      .then((resp) => {
        let summaryData = {};
        let data1 = resp.data.Current_OSA.map((item: any) => ({
          ...item,
          uv: Math.round(item.Current_OSA * 100),
          pv: `${Math.round(item.Current_OSA * 100)}%`,
          name: item.GlobalDivision,
        }));

        let data2 = resp.data.Target_OSA.map((item: any) => ({
          ...item,
          uv: Math.round(item.Target_OSA * 100),
          pv: `${Math.round(item.Target_OSA * 100)}%`,
          name: item.GlobalDivision,
        }));
        let data3 = resp.data.Delta_OSA.map((item: any) => ({
          ...item,
          uv: (Math.round(item.Delta_OSA * 100)) >0 ? (Math.round(item.Delta_OSA * 100)): 0,
         // pv: `((${Math.round(item.Delta_OSA * 100)}) >0 ? (${Math.round(item.Delta_OSA * 100)}): 0)`,
          pv: (Math.round(item.Delta_OSA * 100)) >0 ? `${Math.round(item.Delta_OSA * 100)}%`: "" ,
          
          name: item.GlobalDivision,
        }));

        summaryData = {
          0: data1,
          1: data2,
          2: data3,
        };
        return summaryData;
      })
      .catch((error: any) => {
        throw error;
      });
  };
  
}
