import React, { useEffect, useState } from "react";
import { DashCards } from "../../customComponent/Cards/DashCards";
import {
  Briefcase,
  CaseSensitiveIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  PackageIcon,
  RefreshCwIcon,
  UsersIcon,
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CombinedRowCharts from "../../customComponent/Charts/CombinedRowCharts";
// --- Demo Data ---
const consumptionData = {
  all: [
    { project: "NH-44", cement: 450, steel: 280, bitumen: 320, aggregate: 510 },
    {
      project: "Metro L3",
      cement: 620,
      steel: 410,
      bitumen: 180,
      aggregate: 390,
    },
    {
      project: "Coastal",
      cement: 380,
      steel: 220,
      bitumen: 280,
      aggregate: 420,
    },
  ],
  p1: [
    { chainage: "CH 0-5", cement: 120, steel: 80, bitumen: 95, aggregate: 150 },
    {
      chainage: "CH 5-10",
      cement: 150,
      steel: 90,
      bitumen: 105,
      aggregate: 170,
    },
    {
      chainage: "CH 10-15",
      cement: 180,
      steel: 110,
      bitumen: 120,
      aggregate: 190,
    },
  ],
  p2: [
    {
      chainage: "CH 0-8",
      cement: 180,
      steel: 130,
      bitumen: 50,
      aggregate: 120,
    },
    {
      chainage: "CH 8-16",
      cement: 220,
      steel: 150,
      bitumen: 60,
      aggregate: 140,
    },
    {
      chainage: "CH 16-24",
      cement: 220,
      steel: 130,
      bitumen: 70,
      aggregate: 130,
    },
  ],
  p3: [
    { chainage: "CH 0-6", cement: 110, steel: 70, bitumen: 85, aggregate: 130 },
    {
      chainage: "CH 6-12",
      cement: 140,
      steel: 80,
      bitumen: 95,
      aggregate: 150,
    },
    {
      chainage: "CH 12-18",
      cement: 130,
      steel: 70,
      bitumen: 100,
      aggregate: 140,
    },
  ],
};

const expectedVsActualData = {
  all: [
    { month: "Jan", expected: 2400, actual: 2200 },
    { month: "Feb", expected: 2800, actual: 2600 },
    { month: "Mar", expected: 3200, actual: 3400 },
    { month: "Apr", expected: 3600, actual: 3300 },
    { month: "May", expected: 3800, actual: 3900 },
    { month: "Jun", expected: 4000, actual: 3800 },
  ],
  p1: [
    { month: "Jan", expected: 800, actual: 750 },
    { month: "Feb", expected: 950, actual: 900 },
    { month: "Mar", expected: 1100, actual: 1150 },
    { month: "Apr", expected: 1200, actual: 1100 },
    { month: "May", expected: 1300, actual: 1350 },
    { month: "Jun", expected: 1400, actual: 1300 },
  ],
  p2: [
    { month: "Jan", expected: 900, actual: 850 },
    { month: "Feb", expected: 1050, actual: 1000 },
    { month: "Mar", expected: 1200, actual: 1280 },
    { month: "Apr", expected: 1350, actual: 1250 },
    { month: "May", expected: 1450, actual: 1500 },
    { month: "Jun", expected: 1550, actual: 1450 },
  ],
  p3: [
    { month: "Jan", expected: 700, actual: 600 },
    { month: "Feb", expected: 800, actual: 700 },
    { month: "Mar", expected: 900, actual: 970 },
    { month: "Apr", expected: 1050, actual: 950 },
    { month: "May", expected: 1050, actual: 1050 },
    { month: "Jun", expected: 1050, actual: 1050 },
  ],
};
const cards = [
  {
    title: "Total Projects",
    icon: Briefcase,
    value: "12",
    percentage: "+2",
    isPositive: true,
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    iconBg: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    title: "Total Vendors",
    icon: UsersIcon,
    value: "48",
    percentage: "+5",
    isPositive: true,
    gradient: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    iconBg: "bg-purple-500",
    textColor: "text-purple-700",
  },
  {
    title: "Total Materials",
    icon: PackageIcon,
    value: "156",
    percentage: "+12",
    isPositive: true,
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    iconBg: "bg-green-500",
    textColor: "text-green-700",
  },
  {
    title: "Stock-out Alerts",
    icon: RefreshCwIcon,
    value: "8",
    percentage: "-3",
    isPositive: false,
    gradient: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    iconBg: "bg-red-500",
    textColor: "text-red-700",
  },
];

export default function Dashboard1() {
  const [metrics, setMetrics] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const dprColumns = [
    { key: "dprNo", label: "DPR No" },
    { key: "project", label: "Project" },
    { key: "chainage", label: "Chainage" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const dprData = [
    {
      id: 1,
      dprNo: "DPR-001",
      project: "NH-44 Highway",
      chainage: "CH 12.5-15.2",
      date: "2024-11-22",
      status: "Approved",
    },
    {
      id: 2,
      dprNo: "DPR-002",
      project: "Metro Line 3",
      chainage: "CH 8.0-12.5",
      date: "2024-11-22",
      status: "Pending",
    },
    {
      id: 3,
      dprNo: "DPR-003",
      project: "Coastal Road",
      chainage: "CH 5.5-8.2",
      date: "2024-11-21",
      status: "Approved",
    },
    {
      id: 4,
      dprNo: "DPR-004",
      project: "NH-44 Highway",
      chainage: "CH 8.0-12.0",
      date: "2024-11-21",
      status: "Rejected",
    },
    {
      id: 5,
      dprNo: "DPR-005",
      project: "Metro Line 3",
      chainage: "CH 4.2-8.0",
      date: "2024-11-20",
      status: "Approved",
    },
  ];

  const handleView = (row: any) => alert(`Viewing: ${row.user.name}`);
  const handleEdit = (row: any) => alert(`Editing: ${row.user.name}`);
  const handleDelete = (row: any) => alert(`Deleting: ${row.user.name}`);
  const handleExport = () => {
    alert(`Download: ${row.user.name}`);
  };

  useEffect(() => {
    // Simulate API call
    fetchDemoMetrics();
  }, []);
  const fetchDemoMetrics = async () => {
    // Example API response (replace with your actual API)
    const apiData = [
      {
        title: "Total Projects",
        value: "12",
        percentage: "+2",
        isPositive: true,
      },
      {
        title: "Total Vendors",
        value: "48",
        percentage: "+5",
        isPositive: true,
      },
      {
        title: "Total Materials",
        value: "156",
        percentage: "+12",
        isPositive: true,
      },
      {
        title: "Stock-out Alerts",
        value: "8",
        percentage: "-3",
        isPositive: false,
      },
    ];

    // Merge design info from `cards`
    const mergedData = apiData.map((metric) => {
      const cardStyle = cards.find((c) => c.title === metric.title);
      return {
        ...metric,
        Icon: cardStyle?.icon,
        gradient: cardStyle?.gradient,
        bgColor: cardStyle?.bgColor,
        borderColor: cardStyle?.borderColor,
        iconBg: cardStyle?.iconBg,
        textColor: cardStyle?.textColor,
      };
    });

    setMetrics(mergedData);
  };
  return (
    <>
    <PageBreadcrumb pageTitle="Admin Dashboard" dropdownOptions={[
    { label: "All Project", value: "all" },
    { label: "NH-44 Highway Extension", value: "p1" },
    { label: "Metro Line 3 Construction", value: "p2" },
    { label: "Coastal Road Project", value: "p3" },
  ]}
  placeholder="Select Project"
  // label="Project"
  selectedItem={selectedProject}
  onDropdownChange={(value) => {
    console.log("Selected project:", value);
    setSelectedProject(value);
  }} />
      <DashCards metrics={metrics} />
      

      <div className="space-y-6 mt-6">
        <CombinedRowCharts
          consumptionData={consumptionData.all}
          expectedVsActualData={expectedVsActualData.all}
        />
      </div>
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Recent DPR Submissions"
          // showSearch
          // showAddButton
          // onAddClick={() => console.log("Export DPR")}
          // showDropdown
          // dropdownOptions={[
          //   { label: "All Project", value: "all" },
          //   { label: "Ongoing", value: "ongoing" },
          //   { label: "Closed", value: "closed" },
          // ]}
          // onDropdownChange={(value) => console.log("Filter:", value)}
          // showDownload
          onExportClick={handleExport}
        >
          <CustomTable
            columns={dprColumns}
            data={dprData}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </ComponentCardWthBtns>
      </div>
    </>
  );
}
