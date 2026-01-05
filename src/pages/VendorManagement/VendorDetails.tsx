import React, { useEffect, useState } from 'react'
import { VendorInfoCard } from '../../customComponent/Cards/VendorInfoCard'
import { DashCards } from '../../customComponent/Cards/DashCards';
import ComponentCardWthBtns from '../../customComponent/common/ComponentCardWthBtns';
import CustomTable from '../../customComponent/tables/CustomTable';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useLocation } from 'react-router';
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

const columns = [
  { key: "transaction_id", label: "Transaction ID" },
  { key: "project", label: "Project" },
  { key: "material", label: "Material / Service" },
  { key: "quantity", label: "Quantity" },
  { key: "amount", label: "Amount" },
  { key: "paid", label: "Paid" },
  { key: "balance", label: "Balance" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];
const tableData = [
  {
    transaction_id: "T001",
    project: "NH-44 Highway",
    material: "Portland Cement",
    quantity: "5000 Bags",
    amount: "₹25.00L",
    paid: "₹25.00L",
    balance: "₹0.00L",
    date: "2024-11-15",
    status: "Paid",
  },
  {
    transaction_id: "T002",
    project: "Metro Line 3",
    material: "Portland Cement",
    quantity: "8000 Bags",
    amount: "₹42.00L",
    paid: "₹38.00L",
    balance: "₹4.00L",
    date: "2024-11-10",
    status: "Partial",
  },
  {
    transaction_id: "T003",
    project: "Coastal Road",
    material: "Portland Cement",
    quantity: "6000 Bags",
    amount: "₹31.00L",
    paid: "₹31.00L",
    balance: "₹0.00L",
    date: "2024-11-05",
    status: "Paid",
  },
  {
    transaction_id: "T004",
    project: "NH-44 Highway",
    material: "Ready Mix Concrete",
    quantity: "200 Cubic Meter",
    amount: "₹18.00L",
    paid: "₹0.00L",
    balance: "₹18.00L",
    date: "2024-11-01",
    status: "Pending",
  },
];

export default function VendorDetails() {
const location = useLocation();
console.log(location,"LOCATION---")
     const [metrics, setMetrics] = useState([]);

     useEffect(() => {
          
        
     
         const apiData = [
           {
           title: "Total Supplied",
           value:  "N/A",
         },
           {
           title: "Total Paid",
           value: 0
         },
           {
             title: "Balance Due",
             value:  "0",
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
       }, []);
  return (
    <>
     <PageBreadcrumb
        pageTitle={ "Supreme Cement Suppliers"}
        subTitle={`Type: Material Supplier`}
      />
    <VendorInfoCard
  vendor={{
    gst: "27AABCS1234F1Z5",
    contact: "+91 98765 43210",
    email: "info@supremecement.com",
    address: "Plot 45, Industrial Area, Phase-2, Delhi - 110020",
  }}
/>
 <div className="space-y-6 mt-6">
<DashCards metrics={metrics} />
    </div>

    <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Transaction Ledger">
          <CustomTable columns={columns} data={tableData} />
        </ComponentCardWthBtns>
      </div>
    </>
  )
}
