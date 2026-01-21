import React, { useEffect, useState } from "react";
import { DashCards } from "../../customComponent/Cards/DashCards";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../../api/apiServices";
import { useLocation } from "react-router";
type MetricCard = {
  id: string;
  title: string;
  value: string;
  loading?: boolean;
  [key: string]: any;
};

const cards = [
  {
    title: "Total Chainage",
    value: "45.5",
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    iconBg: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    title: "Project Duration",
    value: "2024-01-15 to 2025-12-31",
    gradient: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    iconBg: "bg-purple-500",
    textColor: "text-purple-700",
  },
  {
    title: "Total SubContractors",
    value: "156",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    iconBg: "bg-green-500",
    textColor: "text-green-700",
  },
];

// ---------- TABLE COLUMNS ----------
const columns = [
  { key: "chainage", label: "Chainage" },
  { key: "materials", label: "Materials" },
  { key: "labours", label: "Labour" },
  { key: "equipment", label: "Equipment" },
  { key: "sub_contractor", label: "Subcontractor" },
  { key: "total_cost", label: "Total Cost" },
];

export default function ProjectDetails() {
  const location = useLocation();
  const project = location.state?.row; // GET PROJECT SELECTED IN PREVIOUS SCREEN
  console.log(project)
  const projectId = project?.id;

  const [metrics, setMetrics] =  useState<MetricCard[]>([]);

  // ---------- METRICS (CARDS) ---------
  useEffect(() => {
     if (!project) return;
    const formattedStart = project.startDate?.split("T")[0];
  const formattedEnd = project.endDate?.split("T")[0];

    const apiData = [
      {
      title: "Total Chainage",
      value: project.chainage || "N/A",
    },
      {
      title: "Project Duration",
      value: `${formattedStart} to ${formattedEnd}`,
    },
      {
        title: "Total SubContractors",
        value: project?.subContractorCount || "0",
      },
    ];

    const merged = apiData.map((metric) => {
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

    setMetrics(merged);
  }, [project]);

  // --------- API CALL: CHAINAGE CONSUMPTION ----------
  const { data: consumptionAPI } = useQuery({
    queryKey: ["chainage-consumption", projectId],
    queryFn: () =>
      axiosGet(
        `/chainage-consumption?page=1&limit=10&projectId=${projectId}`
      ),
    enabled: !!projectId, // API only fires when projectId exists
  });

  // Transform API response for table
  const tableData =
    consumptionAPI?.chainageConsumptions?.map((item) => ({
      ...item,
      id: item.id,
      
      // materials: `₹${item.material_cost || 0}`,
      // labour: `₹${item.labour_cost || 0}`,
      // equipment: `₹${item.equipment_cost || 0}`,
      // subcontractor: `₹${item.subcontractor_cost || 0}`,
      // totalCost: `₹${item.total_cost || 0}`,
    })) || [];

  return (
    <>
      <PageBreadcrumb
        pageTitle={project?.projectName || "Project Details"}
        subTitle={`Project Code: ${project?.code} | Manager: ${project?.manager}`}
      />

      <DashCards metrics={metrics} />

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Consumption Ledger (Chainage-wise)">
          <CustomTable columns={columns} data={tableData} />
        </ComponentCardWthBtns>
      </div>
    </>
  );
}
