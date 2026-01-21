import { useState } from "react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import HeaderTabs from "../../customComponent/common/HeaderTabs";
import PendingGRNTab from "./PendingGRNTab";
import GRNListTab from "./GRNListTab";

export default function GoodsReceiptPage() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "ALL">("PENDING");

  const tabs = [
    { key: "PENDING", label: "Pending GRN" },
    { key: "ALL", label: "All GRN" },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Goods Receipt Note (GRN)" />

      <HeaderTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as "PENDING" | "ALL")}
      />

      <div className="mt-4">
        {activeTab === "PENDING" && <PendingGRNTab />}
        {activeTab === "ALL" && <GRNListTab />}
      </div>
    </>
  );
}
