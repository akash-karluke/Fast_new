

export interface osaGrowthOpportunitiesProps {
    key: number;
    serialNumber: number;
    CORE_OSA: number
    Full_OSA: number
    Location: string
    NPD_OSA: number
    Sales_Uplift: nmuber
    Store_ID: number
    store_chain: string
  }

  export interface osaGrowthOpportunitiesTableProps{
    code: number,
    status:string,
    data: osaGrowthOpportunitiesProps[]
    total_record: number,
    curent_page: number,
    total_record_per_page: number,
    total_pages: number,
    pagination: {
        previous: null,
        next:string
    }
}
export interface Eddgie_all_stars{
  Full_OSA:number,
  Sales_Representative: string,
  Store_ID: number,
  Region: string
}
export interface edggieAllStarsResponse{
  code: number,
  status: string,
  Eddgie_all_stars:Eddgie_all_stars[]
}
export interface osaComplianceToKPIs{
  compliancePercentage: string,
  prevWeekOSAPercenetage: number,
  currentWeekOSAValue: number,
  currency: string
}
export interface kpisComplianceData{
  coreOsa: osaComplianceToKPIs
  fullOsa: osaComplianceToKPIs
}
