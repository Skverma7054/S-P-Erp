import { Link } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../customComponent/DropDown/Select";
import CustomSelect from "../../customComponent/DropDown/CustomDropdown";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../DropDown/Select";


interface BreadcrumbProps {
  pageTitle: string;
   subTitle: string;
}
const variantClasses: any = {
  primary: "bg-brand-500 hover:bg-brand-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  gray: "bg-gray-700 hover:bg-gray-600 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
};

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle ,subTitle,label, dropdownOptions , placeholder="Select Project",navItems, addButtons,onDropdownChange,selectedItem}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
     {/* LEFT SECTION — Back + Title + Subtitle */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
    {/* Back Button */}
   <button
  onClick={() => window.history.back()}
  className="flex items-center gap-2 text-gray-700 dark:text-white 
             text-sm font-medium hover:text-gray-900 
             transition-all"
>
  <span className="flex items-center justify-center w-7 h-7 
                   rounded-full bg-gray-100 dark:bg-gray-700 
                   hover:bg-gray-200 dark:hover:bg-gray-600 
                   transition">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  </span>
 
</button>

      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      </div>
      {subTitle && 
       <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            {subTitle}
          </span>}
          </div>
          {/* RIGHT SECTION — Dropdown / Nav / Add Buttons */}
  <div className="flex items-center gap-3">
      {dropdownOptions &&  
    //   (<div className="space-y-2 relative z-[9999]">
    //           {/* <label className="text-sm text-gray-700">State</label> */}
    //           <Select 
    //           // value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}
                
    //             >
    //             <SelectTrigger  className="group
    //       w-40 rounded-md border border-gray-300 bg-white 
    //       text-sm text-gray-700 dark:text-white dark:border-gray-700
    //       focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
    //       transition-all duration-200
    //        appearance-none
    //   [&>span]:pr-4                     
    // [&>svg:last-child]:hidden     
    //     ">
    //               <SelectValue placeholder={placeholder} />
    //               <svg
    //   className="
    //     w-4 h-4 text-gray-600 dark:text-gray-300
    //     transition-transform duration-200 
    //     group-data-[state=open]:rotate-180
    //   "
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 20 20"
    //   fill="none"
    // >
    //   <path
    //     d="M5.25 7.5L10 12.25L14.75 7.5"
    //     stroke="currentColor"
    //     strokeWidth="1.8"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>
    //             </SelectTrigger>
    //             <SelectContent  className="
    //       bg-white border border-gray-200 dark:border-gray-700
    //       shadow-lg rounded-lg z-[9999]
    //     ">
    //               {/* <SelectItem value=" ">All Cases</SelectItem> */}
    //               {dropdownOptions.map(state => (
    //                 <SelectItem  className="
    //           text-gray-700 dark:text-white
    //           hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer
    //           focus:bg-green-100
    //         " key={state.value} value={state.value}>{state.label}</SelectItem>
    //               ))}
    //             </SelectContent>
    //           </Select>
    //         </div>)
            <div className="space-y-2 relative z-[9999]">
            <CustomSelect
            label={label}
  placeholder={placeholder}
  options={dropdownOptions}
  value={selectedItem}
  onChange={onDropdownChange}
/>
</div>
            }
            
            
          {navItems &&  (
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>)
      }
      {addButtons && (
  <div className="flex items-center gap-2">
    {addButtons.map((btn, index) => {
      const Icon = btn.icon;
      return (
        <button
        variant={btn.variant}
          key={index}
          onClick={btn.onClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm 
                     bg-brand-500 text-white rounded-md hover:bg-brand-600 
                     transition-all duration-200 ${variantClasses[btn.variant] || "bg-gray-200"}`}
        >
          <Icon className="w-4 h-4" />
          {btn.label}
        </button>
      );
    })}
  </div>
)}
</div>
    </div>
  );
};

export default PageBreadcrumb;
