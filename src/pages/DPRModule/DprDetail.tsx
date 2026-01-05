import React from 'react'
import { InfoCard } from '../../customComponent/Cards/InfoCard'
import { Calendar, CheckCircle, CloudSun, FileText, MapPin, User, Users } from 'lucide-react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCardWthBtns from '../../customComponent/common/ComponentCardWthBtns';
import CustomTable from '../../customComponent/tables/CustomTable';
import { UploadedImagesCard } from '../../customComponent/Cards/UploadedImagesCard';
const materialColumns = [
  { key: "material_name", label: "Material Name" },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
];
const materialData = [
  {
    material_name: "Portland Cement",
    quantity: 120,
    unit: "Bags",
  },
  {
    material_name: "TMT Steel",
    quantity: 8,
    unit: "Tons",
  },
  {
    material_name: "Aggregate",
    quantity: 50,
    unit: "Cubic Meter",
  },
];
const equipmentColumns = [
  { key: "equipment_name", label: "Equipment Name" },
  { key: "hours", label: "Hours" },
];
const equipmentData = [
  {
    equipment_name: "Excavator",
    hours: "8 hrs",
  },
  {
    equipment_name: "Concrete Mixer",
    hours: "6 hrs",
  },
  {
    equipment_name: "Compactor",
    hours: "5 hrs",
  },
];

export default function DprDetail() {

    const images = [
  { url: "/images/site/site1.jpg" },
  { url: "/images/site/site2.jpg" },
  { url: "/images/site/site3.jpg" },
  { url: "/images/site/site4.jpg" },
  { url: "/images/site/site5.jpg" },
  { url: "/images/site/site6.jpg" },
  { url: "/images/site/site7.jpg" },
  { url: "/images/site/site8.jpg" },
  { url: "/images/site/site9.jpg" },
  { url: "/images/site/site10.jpg" },
  { url: "/images/site/site11.jpg" },
  { url: "/images/site/site12.jpg" },
];
  return (
    <>
    <PageBreadcrumb pageTitle="DPR Module" subTitle="Review and approve Daily Progress Reports"  />
    <InfoCard
  title="DPR Summary"
  items={[
    { icon: FileText, label: "DPR No", value: "DPR-001" },
    { icon: MapPin, label: "Project", value: "NH-44 Highway Extension" },
    { icon: MapPin, label: "Chainage", value: "CH 12.5 – 15.2" },
    { icon: Calendar, label: "Date", value: "2024-11-22" },
    { icon: CloudSun, label: "Weather", value: "Clear" },
    { icon: Users, label: "Manpower", value: "45 Workers" },
    { icon: User, label: "Project Manager", value: "Rajesh Kumar" },
    { icon: CheckCircle, label: "Status", value: "Approved" },
  ]}
/>
 <div className="space-y-6 mt-6">
<ComponentCardWthBtns title="Materials Used">
  <CustomTable columns={materialColumns} data={materialData} />
</ComponentCardWthBtns>
</div>
 <div className="space-y-6 mt-6">
<ComponentCardWthBtns title="Equipment Used">
  <CustomTable columns={equipmentColumns} data={equipmentData} />
</ComponentCardWthBtns>
</div>
<div className="space-y-6 mt-6">
<UploadedImagesCard images={images} />
</div>
    </>
  )
}
