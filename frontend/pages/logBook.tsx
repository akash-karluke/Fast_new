import type { NextPage } from "next";
import FilterSection from "../components/Filters";
import LogbookTable from "../components/LogbookTable";
import OsaGrowthOpportunities from "../components/OsaGrowthOpportunities";

const LogBook: NextPage = () => {
  return (
    <div className="page">
      {/* <FilterSection />
      <OsaGrowthOpportunities /> */}
      <LogbookTable />
    </div>
  );
};

export default LogBook;
