import React, { useState } from "react";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Download, Edit, Package, Plus, Trash } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomSelectModal from "../../customComponent/CustomModal/CustomSelectModal";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch } from "../../api/apiServices";

const columns = [
  { key: "projectName", label: "Project Name" },
  { key: "projectType", label: "Type" , badge:true },
  { key: "code", label: "Code" },
  { key: "location", label: "Location" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "manager", label: "Manager" },
   { key: "progress", label: "Progress (%)" }, // ✅ ADD THIS
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: true, admin: true },
  },
];



const data = [
  {
    id: "1",
    projectName: "NH-44 Highway Extension",
    code: "PRJ-001",
    location: "Delhi-Chandigarh",
    chainage: "0 - 45.5 km",
    startDate: "2024-01-15",
    endDate: "2025-12-31",
    manager: "Rajesh Kumar",
    status: "Active",
  },
  {
    id: "2",
    projectName: "Metro Line 3 Construction",
    code: "PRJ-002",
    location: "Mumbai",
    chainage: "0 - 32.8 km",
    startDate: "2024-03-01",
    endDate: "2026-06-30",
    manager: "Priya Sharma",
    status: "Active",
  },
  {
    id: "3",
    projectName: "Coastal Road Project",
    code: "PRJ-003",
    location: "Chennai",
    chainage: "0 - 28.2 km",
    startDate: "2024-02-10",
    endDate: "2025-08-15",
    manager: "Amit Patel",
    status: "On Hold",
  },
];

const projectModalFields = [
  {
    heading: "Project Details",
    items: [
      {
      name: "projectType",
      label: "Project Type",
      type: "select",
      options: [
        { label: "HAM", value: "HAM" },
        { label: "EPC", value: "EPC" },
        { label: "BOT", value: "BOT" },
      ],
      required: true,
    },
      {
        name: "projectName",
        label: "Project Name",
        type: "text",
        placeholder: "Enter project name",
      },
      {
        name: "projectCode",
        label: "Project Code",
        type: "text",
        placeholder: "e.g., PRJ-001",
      },
      {
        name: "location",
        label: "Project Location",
        type: "text",
        placeholder: "Enter project location",
      },
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        placeholder: "Select a date",
      },
      {
        name: "endDate",
        label: "End Date",
        type: "date",
        placeholder: "dd-mm-yyyy",
      },
      {
      name: "budget",
      label: "Project Budget",
      type: "number",
    },
    {
      name: "client",
      label: "Client",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
    },
      // {
      //   name: "chainageStart",
      //   label: "Chainage Start (km)",
      //   type: "number",
      //   placeholder: "0",
      // },
      // {
      //   name: "chainageEnd",
      //   label: "Chainage End (km)",
      //   type: "number",
      //   placeholder: "45.5",
      // },
      {
        name: "manager",
        label: "Project Manager",
        type: "text",
        placeholder: "Enter PM name",
      },
    ],
  },

  {
  heading: "HAM Details",
  showIf: { field: "projectType", value: "HAM" },
  items: [
    { name: "annuityAmount", label: "Annuity Amount", type: "number" },
    { name: "annuityPeriod", label: "Annuity Period (Years)", type: "number" },
    { name: "constructionPeriod", label: "Construction Period (Months)", type: "number" },
    {
      name: "maintenanceResponsibility",
      label: "Maintenance Responsibility",
      type: "text",
      fullWidth: true,
    },
  ],
},
{
  heading: "EPC Details",
  showIf: { field: "projectType", value: "EPC" },
  items: [
    { name: "engineeringScope", label: "Engineering Scope", type: "text" },
    { name: "procurementBudget", label: "Procurement Budget", type: "number" },
    { name: "constructionTimeline", label: "Construction Timeline", type: "text" },
    { name: "performanceGuarantee", label: "Performance Guarantee", type: "text" },
  ],
},
{
  heading: "BOT Details",
  showIf: { field: "projectType", value: "BOT" },
  items: [
    { name: "concessionPeriod", label: "Concession Period (Years)", type: "number" },
    { name: "estimatedOperatingCost", label: "Estimated Operating Cost", type: "number" },
    {
      name: "tollRevenueEnabled",
      label: "Toll Revenue Collection Enabled",
      type: "switch",
      fullWidth: true,
    },
    {
      name: "transferCondition",
      label: "Transfer Condition",
      type: "text",
      fullWidth: true,
    },
  ],
},
// {
//     heading: "",        
//     items: [
//       {
//         name: "enableOutsource",
//         type: "switch",
//         label: "Enable Outsourcing?",
//         fullWidth: true,
//       },
//     ],
//   },
//   {
//     heading: "Outsourcing Details",
//      showIf: { field: "enableOutsource", value: true },
//     items: [
    
//     {
//       name: "subcontractor",
//       label: "Subcontractor Name",
//       type: "text",
//       showIf: "enableOutsource",   // 👈 Show only when switch is ON
//       placeholder: "Enter subcontractor name",
//     },
//     {
//       name: "scope",
//       label: "Scope of Work",
//       type: "textarea",
//       showIf: "enableOutsource",
//       placeholder: "Describe the scope of work",
//       fullWidth: true,
//     },
//     {
//       name: "contractValue",
//       label: "Contract Value",
//       type: "number",
//       showIf: "enableOutsource",
//       placeholder: "Enter amount",
//     },
//       {
//         name: "chainageOutsourceStart",
//         label: "Chainage Start",
//         type: "number",
//         showIf: "enableOutsource", 
//         placeholder: "0",
//       },
//       {
//         name: "chainageOutsourceEnd",
//         label: "Chainage End",
//         type: "number",
//         showIf: "enableOutsource", 
//         placeholder: "20",
//       },
//       {
//         name: "startOutsourceDate",
//         label: "Outsourcing Start Date",
//         type: "date",
//         showIf: "enableOutsource", 
//         placeholder: "dd-mm-yyyy",
//       },
//       {
//         name: "endOutsourceDate",
//         label: "Outsourcing End Date",
//         type: "date",
//         showIf: "enableOutsource", 
//         placeholder: "dd-mm-yyyy",
//       },
//     ],
//   },

];




export default function CreateProject() {
  const { isOpen, openModal, closeModal } = useModal();
const queryClient = useQueryClient();

  const materialModal = useModal();  // For Add / Edit material
const projectModal = useModal();   // For Material Inventory
const navigate = useNavigate();
const initialFormState = {
  projectType: "",
  projectName: "",
  projectCode: "",
  location: "",
  startDate: "",
  endDate: "",
  budget: "",
  client: "",
  description: "",
  status: "PLANNED",
  progress: 0,
  manager: "",

  enableOutsource: false,
  subcontractor: "",
  scope: "",
  contractValue: "",
  chainageOutsourceStart: "",
  chainageOutsourceEnd: "",
  startOutsourceDate: "",
  endOutsourceDate: "",

  annuityAmount: "",
  annuityPeriod: "",
  constructionPeriod: "",
  maintenanceResponsibility: "",

  engineeringScope: "",
  procurementBudget: "",
  constructionTimeline: "",
  performanceGuarantee: "",
  epcProgress: 0,

  concessionPeriod: "",
  estimatedOperatingCost: "",
  tollRevenueEnabled: false,
  transferCondition: "",
};

  const [formData, setFormData] = useState({
  projectType: "",

  projectName: "",
  projectCode: "",
  location: "",
  startDate: "",
  endDate: "",
  budget: "",
  client: "",
  description: "",
  status: "PLANNED",
  progress: 0,

  manager: "",

  enableOutsource: false,
  subcontractor: "",
  scope: "",
  contractValue: "",
  chainageOutsourceStart: "",
  chainageOutsourceEnd: "",
  startOutsourceDate: "",
  endOutsourceDate: "",

  // HAM
  annuityAmount: "",
  annuityPeriod: "",
  constructionPeriod: "",
  maintenanceResponsibility: "",

  // EPC
  engineeringScope: "",
  procurementBudget: "",
  constructionTimeline: "",
  performanceGuarantee: "",
  epcProgress: 0,

  // BOT
  concessionPeriod: "",
  estimatedOperatingCost: "",
  tollRevenueEnabled: false,
  transferCondition: "",
});


  const projects = [
    { id: "p1", name: "NH-44 Highway Extension" },
    { id: "p2", name: "Metro Line 3 Construction" },
    { id: "p3", name: "Coastal Road Project" },
  ];

  const handleMaterialInventory = () => {
    console.log("Material Inventory Clicked");
    projectModal.openModal();
    // openModal();
    // alert("Material Inventory clicked!");
  };
  const handleCreateProject = () => {
  setFormData(initialFormState);
  materialModal.openModal();
};

const createProject = useMutation({
  mutationFn: (payload) => postFetch("/project", payload),
  onSuccess: (data) => {
    console.log(data)
    alert("Project created successfully!");
     // 🔥 REFRESH TABLE DATA
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    materialModal.closeModal();
  },
  onError: (error) => {
        console.log(error)

    alert(error?.message || "Failed to create project");
  },
});

// --- React Query GET API ---
const { data: projectData, isLoading, isError } = useQuery({
  queryKey: ["projects"],
  queryFn: () => axiosGet("/project"),
});
console.log(projectData,"projectData------")
// --- Transform API Response ---
const getProjectProgress = (item) => {
  if (item.project_type === "HAM") {
    return item.ham_details?.progress ?? 0;
  }
  if (item.project_type === "EPC") {
    return item.epc_details?.progress ?? 0;
  }
  if (item.project_type === "BOT") {
    return item.bot_details?.progress ?? 0;
  }
  return 0;
};

const tableData =
  projectData?.data
?.map((item) => ({
   id: item.id,
    projectName: item.project_name,
    projectType: item.project_type,
    code: item.project_code,
    location: item.location,
    startDate: item.start_date?.split("T")[0],
    endDate: item.end_date?.split("T")[0],
    manager: item.project_manager,
    progress: getProjectProgress(item), // ✅ HERE
    status: item.status,
  })) || [];
const toISODate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

  const handleSave = () => {
  const payload: any = {
    project_type: formData.projectType,
    project_name: formData.projectName,
    project_code: formData.projectCode,
    location: formData.location,
    start_date: toISODate(formData.startDate),
    end_date: toISODate(formData.endDate),
    budget: formData.budget,
    status: formData.status,
    client: formData.client,
    project_manager: formData.manager,
    description: formData.description,
    progress: Number(formData.progress || 0),
  };

  if (formData.projectType === "HAM") {
    payload.ham_details = {
      annuity_amount: formData.annuityAmount,
      annuity_period: Number(formData.annuityPeriod),
      construction_period: Number(formData.constructionPeriod),
      maintenance_responsibility: formData.maintenanceResponsibility,
      progress: 0,
    };
  }

  if (formData.projectType === "EPC") {
    payload.epc_details = {
      engineering_scope: formData.engineeringScope,
      procurement_budget: formData.procurementBudget,
      construction_timeline: formData.constructionTimeline,
      performance_guarantee: formData.performanceGuarantee,
      progress: Number(formData.epcProgress || 0),
    };
  }

  if (formData.projectType === "BOT") {
    payload.bot_details = {
      concession_period: Number(formData.concessionPeriod),
      estimated_operating_cost: formData.estimatedOperatingCost,
      toll_revenue_collection_enabled: formData.tollRevenueEnabled,
      transfer_condition: formData.transferCondition,
    };
  }

   

  createProject.mutate(payload);
};


  const actionButtons = [
    // {
    //   label: "Material Inventory",
    //   icon: Package,
    //   variant: "gray",
    //   onClick: handleMaterialInventory,
    // },
    {
      label: "Create New Project",
      icon: Plus,
      variant: "primary",
      onClick: handleCreateProject,
    },
    // {
    //   label: "Download",
    //   icon: Download,
    //   variant: "warning",
    //   onClick: () => console.log("Download clicked"),
    // },

    // {
    //   label: "Delete",
    //   icon: Trash,
    //   variant: "danger",
    //   onClick: () => console.log("Delete clicked"),
    // },
  ];
  const handleView = (row: any) => {
// route to selected project
    console.log(row)
      navigate(`/project-detail/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };
  const handleAdminClick = (row:any)=>{
    console.log(row,"handleAdminClick")
     navigate(`/sub-contractor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  }
 const handleEdit = (row) => {
  setFormData({
    ...initialFormState,
    projectName: row.projectName,
    projectCode: row.code,
    location: row.location,
    startDate: row.startDate,
    endDate: row.endDate,
    manager: row.manager,
    projectType: row.project_type, // must come from API
  });

  materialModal.openModal();
};


  const handleDelete = (row: any) => alert(`Deleting: ${row.user.name}`);
  const handleExport = () => {
    alert(`Download: ${row.user.name}`);
  };
 const handleProject = (row) => {
    console.log(`handleProject: ${row}`);
    projectModal.closeModal();   // Close modal
  navigate(`/sub-vendor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Project Management" addButtons={actionButtons} />
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Manage construction projects"
          // showSearch
          // showAddButton
          // onAddClick={() => console.log("Add Case clicked")}
          // showDropdown
          // dropdownOptions={[
          //   { label: "All Cases", value: "all" },
          //   { label: "Ongoing", value: "ongoing" },
          //   { label: "Closed", value: "closed" },
          // ]}
          // onDropdownChange={(value) => console.log("Filter:", value)}
          // showDownload
          // onExportClick={handleExport}
        >
          <CustomTable
            columns={columns}
            data={tableData}
            loading={isLoading}
            onView={handleView}
onAdmin={handleAdminClick}
          />
        </ComponentCardWthBtns>
      </div>
      <CustomModal
  isOpen={materialModal.isOpen}
  closeModal={materialModal.closeModal}
  handleSave={handleSave}
  title={formData.projectName ? "Edit Project" : "Create New Project"}
  subtitle="Fill the details below to create a project"
  fields={projectModalFields}
  formData={formData}
  setFormData={setFormData}
  saveText={formData.projectName ? "Update Project" : "Create Project"}
  closeText="Cancel"
/>

      <CustomSelectModal
      
      projects={projects}
      isOpen={projectModal.isOpen}
      closeModal={projectModal.closeModal}
      onProjectClick={handleProject}
      />
    </>
  );
}
