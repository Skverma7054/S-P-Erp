import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApprovedPRTab from "./ApprovedPRTab";
import PurchaseOrderListTab from "./PurchaseOrderListTab";
import { AxiosGetWithParams } from "../../api/apiServices";
import { useQuery } from "@tanstack/react-query";
import HeaderTabs from "../../customComponent/common/HeaderTabs";

export default function PurchaseOrderPage() {
  const [activeTab, setActiveTab] = useState<"PR" | "PO">("PR");
  const { data: approvedPrCountData } = useQuery({
  queryKey: ["approved-pr-count"],
  queryFn: () =>
    AxiosGetWithParams("/pr", { status: "APPROVED" }),
});
const { data: poCountData } = useQuery({
  queryKey: ["po-count"],
  queryFn: () =>
    AxiosGetWithParams("/po", { count_only: true }),
});
console.log(approvedPrCountData,"----approvedPrCountData");

const approvedPrCount = approvedPrCountData?.meta.total ?? 0;
const poCount = poCountData?.meta.total ?? 0;
 const tabs = [
    {
      key: "PR",
      label: "Approved PR",
      count: approvedPrCount
    },
    {
      key: "PO",
      label: "All PO",
      count: poCount
    },
  ];
  return (<>
    
        {/* Breadcrumb */}
        {/* <PageBreadcrumb pageTitle="Purchase Orders" /> */}

        {/* Tabs Container */}
        
          {/* Header Tabs */}
          <HeaderTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as "PR" | "PO")}
      />

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "PR" && <ApprovedPRTab />}
            {activeTab === "PO" && <PurchaseOrderListTab />}
          </div>
       
     </>
  );
}
