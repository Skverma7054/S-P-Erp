import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DashCards } from "../../customComponent/Cards/DashCards";
import ProgressCard from "../../customComponent/Cards/ProgressCard";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../../api/apiServices";
type DashMetric = {
  id: string;
  title: string;
  value: string;
  gradient?: string;
  bgColor?: string;
  borderColor?: string;
  iconBg?: string;
  textColor?: string;
};

const cards = [
  {
    title: "Total Contract Value",
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    iconBg: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    title: "Total Paid",
    gradient: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    iconBg: "bg-purple-500",
    textColor: "text-purple-700",
  },
  {
    title: "Balance Due",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    iconBg: "bg-green-500",
    textColor: "text-green-700",
  },
];

export default function SubContractor() {
  const location = useLocation();
  const project = location.state?.row; // From previous page
  const subcontractorId = project?.id;

const [metrics, setMetrics] = useState<DashMetric[]>([]);

  // ---------------------------------------------------------------------
  // 🔥 API: Get subcontractor details
  // ---------------------------------------------------------------------
  const { data: apiResponse,isLoading  } = useQuery({
    queryKey: ["subContractor", subcontractorId],
    queryFn: () => axiosGet(`/sub-contractor/${subcontractorId}`),
    enabled: !!subcontractorId,
  });

  const subcontractor = apiResponse?.subContractor;
console.log(subcontractor,isLoading,"subcontractor")
  // ---------------------------------------------------------------------
  // 🔥 Transform Subcontractor → Cards
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!subcontractor) return;

    // Example assumption: (Paid = 80% of contract) -> OR update when API gives paid amount
    const totalValue = Number(subcontractor.contract_value || 0);
    const paid = totalValue * 0.8;
    const balance = totalValue - paid;

    const apiData = [
      {
        title: "Total Contract Value",
        value: `₹${(totalValue / 100000).toFixed(2)} L`,
      },
      {
        title: "Total Paid",
        value: `₹${(paid / 100000).toFixed(2)} L`,
      },
      {
        title: "Balance Due",
        value: `₹${(balance / 100000).toFixed(2)} L`,
      },
    ];

    const preparedCards = apiData.map((metric) => {
      const style = cards.find((c) => c.title === metric.title);
      return {
        ...metric,
        id: metric.title,
        gradient: style?.gradient,
        bgColor: style?.bgColor,
        borderColor: style?.borderColor,
        iconBg: style?.iconBg,
        textColor: style?.textColor,
      };
    });

    setMetrics(preparedCards);
  }, [subcontractor]);

  // ---------------------------------------------------------------------
  // 🔥 Convert subcontractor → ProgressCard format
  // ---------------------------------------------------------------------

  const subcontractorCardData = subcontractor
    ? [
        {
          title: subcontractor.name,
          subtitle: subcontractor.scope_of_work,
          chainage: `${subcontractor.chainage_start_km} - ${subcontractor.chainage_end_km}`,
          contractValue: `${(Number(subcontractor.contract_value) / 100000).toFixed(
            2
          )} L`,
          amountPaid: `${(
            Number(subcontractor.contract_value) * 0.8 / 100000
          ).toFixed(2)} L`,
          balance: `${(
            Number(subcontractor.contract_value) * 0.2 / 100000
          ).toFixed(2)} L`,
          duration: `${subcontractor.contract_start_date?.split("T")[0]} to ${
            subcontractor.contract_end_date?.split("T")[0]
          }`,
          progress: 80, // Can be dynamic later
        },
      ]
    : [];

  return (
    <>
      <PageBreadcrumb
        pageTitle="Subcontractor Details"
        subTitle={project?.projectName || "Project Details"}
      />

      {/* CARD SUMMARY */}
      <DashCards metrics={metrics} loading={isLoading} />

      {/* PROGRESS CARDS */}
      <div className="space-y-6 mt-6">

        {subcontractorCardData.length === 0 && isLoading && (
  <ProgressCard loading={false} />
)}

{subcontractorCardData.length > 0 &&
  subcontractorCardData.map((item, index) => (
    <ProgressCard key={index} {...item} />
  ))
}
        {/* {subcontractorCardData.map((item, index) => (
          <ProgressCard key={index} {...item} />
        ))} */}
      </div>
    </>
  );
}
