import React, { useEffect, useState } from "react";
import {
  Layers,
  Package,
  IndianRupee,
  Fuel,
  Route,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { InfoCard } from "../../customComponent/Cards/InfoCard";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DashCards } from "../../customComponent/Cards/DashCards";
import { useModal } from "../../hooks/useModal";
import ComponentCardWthBtns, {
  HeaderAction,
} from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { useQuery } from "@tanstack/react-query";
import {
  getChainageConsumption,
  uploadChainageConsumption,
} from "../../api/chainageServices";
import { axiosGet } from "../../api/apiServices";
import { useNavigate } from "react-router";
const chainageColumns = [
  { key: "chainage", label: "Chainage" },
  { key: "material", label: "Material" },
  { key: "planned", label: "Planned" },
  { key: "actual", label: "Actual" },
  { key: "consumed", label: "Consumed" },
  { key: "balance", label: "Balance" },
  { key: "cost", label: "Cost (₹)" },
  { key: "diesel", label: "Diesel (L)" },
  { key: "status", label: "Status" },
];
const uploadColumns = [
  { key: "id", label: "Upload ID" },
  { key: "project", label: "Project" },
  { key: "createdAt", label: "Uploaded On" },
  { key: "count", label: "Chainages" },
  { key: "action", label: "Action", showIcon: { 
      
      select:true },
  }, 
];
const chainageDetailColumns = [
  { key: "s_no", label: "S.No" },
  { key: "chainage", label: "Chainage" },
  { key: "length_m", label: "Length (m)" },
  { key: "wmm_cum", label: "WMM (cum)" },
  { key: "ctsb_cum", label: "CTSB (cum)" },
  { key: "dbm_cum", label: "DBM (cum)" },
  { key: "bc_cum", label: "BC (cum)" },
  { key: "tcs_type", label: "TCS Type" },
];

export default function ChainageTracking() {
  const uploadModal = useModal();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
const [selectedUpload, setSelectedUpload] = useState<any | null>(null);
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_id: "",
    excel_file: null,
  });
  useEffect(() => {
    console.log(formData, "---formData");
  }, [formData]);
  const isUploadDisabled =
    !formData.project_id || !formData.excel_file || uploading;

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => axiosGet("/project"),
  });
  const projectOptions =
    projectData?.data?.map((project) => ({
      label: project.project_name,
      value: String(project.id),
    })) || [];
    useEffect(() => {
  if (!selectedProject && projectOptions.length > 0) {
    setSelectedProject(projectOptions[0].value);
    setFormData((prev) => ({
      ...prev,
      project_id: projectOptions[0].value,
    }));
  }
}, [projectOptions, selectedProject]);

  const chainageUploadFields = [
    {
      heading: "Excel Upload Rules",
      items: [
        {
          type: "alert",
          variant: "info",
          title: "Excel File Format",
          message: [
            "Each sheet name should be the Material Code (e.g., CEM-001, STL-001)",
            "Required columns: Chainage, Planned Qty, Actual Qty, Consumed Qty, Unit, Cost, Diesel Used",
            "Date format must be YYYY-MM-DD",
            "All numeric fields should be numbers only (no currency symbols)",
          ],
          fullWidth: true,
        },
        {
          name: "project_id",
          label: "Project",
          type: "select",
          options: projectOptions,
          placeholder: projectLoading
            ? "Loading projects..."
            : "Select Project",
          loading: projectLoading,
        },
        {
          name: "excel_file",
          label: "Upload Excel File",
          type: "dropfileselect",
          multiple: false,
          fullWidth: true, // 🔥 THIS IS THE KEY
          accept: {
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          },
          helperText: "Supported formats: .xls, .xlsx (Max 10MB)",
        },
      ],
    },
  ];

  const {
    data: chainageRes,
    isLoading: chainageLoading,
    isError,
  } = useQuery({
    queryKey: ["chainage-consumption", 1],
    queryFn: () =>
      getChainageConsumption({
        project_id: selectedProject, // later you can pass selected project
        page: 1,
        limit: 10,
      }),
    enabled: !!selectedProject,
  });

  /* ---------------- HEADER BUTTON ---------------- */
  const actionButtons = [
    {
      label: "Upload Chainage Excel",
      icon: Upload,
      variant: "primary",
      onClick: () => uploadModal.openModal(),
    },
  ];
  const headerActions: HeaderAction[] = [
    {
      type: "select",
      key: "project",
      options: projectOptions,
      value: selectedProject,
      placeholder: "Select Project",
      disabled: projectLoading,
      onChange: setSelectedProject,
    },
    {
      type: "search",
      key: "search",
      placeholder: "Search chainage",
      onChange: (value) => {
        console.log("Search:", value);
        // setSearch(value) if needed
      },
    },
    {
      type: "button",
      key: "upload",
      label: "Upload Excel",
      icon: Upload,
      onClick: uploadModal.openModal,
    },
  ];

  /* ---------------- TABLE DATA (API READY) ---------------- */
  const uploadsTableData =
  chainageRes?.data?.data?.map((item: any) => ({
    id: item.id,
    project: item.project?.project_name || "-",
    createdAt: new Date(item.createdAt).toLocaleString(),
    count: item.chainage_data?.chainage?.length || 0,
    raw: item, // 🔥 keep full record for drill-down
  })) || [];
const chainageDetailData =
  selectedUpload?.chainage_data?.chainage?.map((row: any) => ({
    s_no: row.s_no,
    chainage: `${row.chainage_from} – ${row.chainage_to}`,
    length_m: row.length_m,
    wmm_cum: row.wmm_cum,
    ctsb_cum: row.ctsb_cum,
    dbm_cum: row.dbm_cum,
    bc_cum: row.bc_cum,
    tcs_type: row.tcs_type,
  })) || [];

  const tableData =
  chainageRes?.data?.data?.flatMap((record: any) =>
    record.chainage_data?.chainage?.map((row: any) => ({
      id: `${record.id}-${row.s_no}`,
      chainage: `CH ${row.chainage_from} – ${row.chainage_to}`,
      material: row.tcs_type || "-", // adjust if needed
      planned: row.wmm_cum || 0,
      actual: row.dbm_cum || 0,
      consumed: row.bc_cum || 0,
      balance: "-", // backend not providing
      cost: "-",    // backend not providing
      diesel: "-",  // backend not providing
      status: "Uploaded",
    })) || []
  ) || [];


  const metrics = [
    {
      id: 1,
      title: "Total Chainages",
      value: "3",
      percentage: "12%",
      isPositive: true,
      Icon: Route,
      gradient: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-200",
    },
    {
      id: 2,
      title: "Material Consumed",
      value: "864",
      percentage: "8%",
      isPositive: true,
      Icon: Package,
      gradient: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: 3,
      title: "Total Cost",
      value: "₹8.33 L",
      percentage: "5%",
      isPositive: false,
      Icon: IndianRupee,
      gradient: "from-rose-500 to-rose-600",
      borderColor: "border-rose-200",
    },
    {
      id: 4,
      title: "Diesel Used",
      value: "1800 L",
      Icon: Fuel,
      gradient: "from-orange-500 to-orange-600",
      borderColor: "border-orange-200",
    },
  ];
  /* ---------------- SAVE (UPLOAD) ---------------- */
  const handleSave = async () => {
    if (!formData.excel_file) {
      toast.error("Please upload Excel file");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await uploadChainageConsumption(formData.excel_file, formData.project_id);

      toast.success("Chainage Excel uploaded successfully");

      uploadModal.closeModal();
      setFormData({ excel_file: null });
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload Excel");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle="Chainage-Based Material Tracking"
        addButtons={actionButtons}
      />
      {/* Summary Cards */}
      <DashCards metrics={metrics} loading={uploading} />
      {/* TABLE + FILTER CARD */}
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Chainage-wise Material Consumption"
          desc="View material usage, cost and diesel consumption"
          actions={headerActions}
        >
          <CustomTable
            columns={uploadColumns}
            data={uploadsTableData}
            loading={chainageLoading}
            onEdit={(row) => navigate(`/chainage/${row.id}`)}
            // onEdit={(row) => setSelectedUpload(row.raw)}
          />
          {/* DETAIL TABLE */}
  {selectedUpload && (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">
        Chainage Details (Upload #{selectedUpload.id})
      </h4>

      <CustomTable
        columns={chainageDetailColumns}
        data={chainageDetailData}
        loading={false}
      />
    </div>
  )}
        </ComponentCardWthBtns>
      </div>
      {/* UPLOAD MODAL */}
      <CustomModal
        isOpen={uploadModal.isOpen}
        closeModal={uploadModal.closeModal}
        handleSave={handleSave}
        title="Upload Chainage Data (Excel)"
        subtitle="Upload Excel file with material consumption data per chainage"
        fields={chainageUploadFields}
        formData={formData}
        loading={uploading}
        saveDisabled={isUploadDisabled}
        // handleInput={handleInput}
        setFormData={setFormData}
        saveText="Upload & Process"
        closeText="Cancel"
      />
    </>
  );
}
