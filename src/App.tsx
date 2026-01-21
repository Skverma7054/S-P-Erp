import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Dashboard1 from "./pages/Dashboard/Dashboard1";
import Cases from "./pages/MasterCreation/MasterCreation";
import { LawyersSection } from "./pages/LawyerSection/LawyersSection";
import PrjMaterialInv from "./pages/ProjectMaterialInv/PrjMaterialInv";
import MasterCreation from "./pages/MasterCreation/MasterCreation";
import CreateProject from "./pages/CreateProject/CreateProject";
import SubVendor from "./pages/SubVendor/SubVendor";
import SubContractor from "./pages/SubContractor/SubContractor";
import ProjectDetails from "./pages/CreateProject/ProjectDetails";
import VendorManagement from "./pages/VendorManagement/VendorManagement";
import ManageCategory from "./pages/MasterCreation/ManageCategory";
import ManageUnit from "./pages/MasterCreation/ManageUnit";
import ManageRole from "./pages/ManageUserRole/ManageRole";
import ManageModule from "./pages/ManageUserRole/ManageModule";
import ManageUser from "./pages/ManageUserRole/ManageUser";
import ManagePermission from "./pages/ManageUserRole/ManagePermission";
import PermissionMatrix from "./pages/ManageUserRole/PermissionMatrix";
import DprModule from "./pages/DPRModule/DprModule";
import VendorDetails from "./pages/VendorManagement/VendorDetails";
import DprDetail from "./pages/DPRModule/DprDetail";
import PrCreate from "./pages/InventoryManagement/PrCreate";
import PurchaseOrder from "./pages/InventoryManagement/PurchaseOrder";
import GoodReceipt from "./pages/InventoryManagement/GoodReceipt";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import PurchaseOrderPage from "./pages/PurchaseOrderManage/PurchaseOrderPage";
import GoodsReceiptPage from "./pages/GoodRecieptNote/GoodsReceiptPage";
import ChainageTracking from "./pages/Chainage Tracking/ChainageTracking";
import ChainageUploadDetails from "./pages/Chainage Tracking/ChainageUploadDetails";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
           {/* 🔐 PROTECTED AREA */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Dashboard1/>} />
             <Route index path="/master-creation" element={<MasterCreation/>} />
             {/* <Route index path="/lawyersection" element={<LawyersSection/>} /> */}
                          <Route index path="/project-creation" element={<CreateProject/>} />
<Route index path="/vendor-management" element={<VendorManagement/>} />
<Route index path="/manage-category" element={<ManageCategory/>} />
<Route index path="/manage-unit" element={<ManageUnit/>} />
<Route index path="/manage-role" element={<ManageRole/>} />
<Route index path="/manage-module" element={<ManageModule/>} />
<Route index path="/manage-user" element={<ManageUser/>} />
<Route index path="/manage-permission" element={<ManagePermission/>} />
<Route index path="/role-permission" element={<PermissionMatrix/>} />
<Route index path="/dpr-module" element={<DprModule/>} />
<Route path="/vendor-detail/:id" element={<VendorDetails />} />
<Route path="/dpr-detail/:id" element={<DprDetail />} />
<Route index path="/pr-create" element={<PrCreate/>} />
<Route index path="/purchase-order" element={<PurchaseOrderPage/>} />
<Route index path="/good-receipt" element={<GoodsReceiptPage/>} />
<Route index path="/chainage-tracking" element={<ChainageTracking/>} />
<Route path="/chainage/:uploadId" element={<ChainageUploadDetails />} />
{/* <Route index path="/dash" element={<Home/>} /> */}
{/* <Route index path="/dash1" element={<Dashboard1/>} /> */}

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            
<Route path="/project-material/:id" element={<PrjMaterialInv />} />
<Route path="/project-detail/:id" element={<ProjectDetails />} />
<Route path="/sub-contractor/:id" element={<SubContractor />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
 </Route>

        {/* 🌐 PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
</Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
