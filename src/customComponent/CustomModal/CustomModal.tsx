import React from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import CustomSelect from "../DropDown/CustomDropdown";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";

export default function CustomModal({
  isOpen,
  closeModal,
  handleSave,
  title,
  subtitle,
  fields,
  formData,
  setFormData,
  saveText = "Save",
  closeText = "Close",
  loading = false,   // ⬅ NEW
}) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">

        {/* Title + Subtitle */}
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          {subtitle && (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {subtitle}
            </p>
          )}
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">

            {/* Loop all field groups */}
            {fields.map((group) => {

               if (group.showIf && !formData[group.showIf]) {
    return null;
  }
              return(<div key={group.heading || group.name} className="mb-7">

                {/* Section Heading */}
                {group.heading && (
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                    {group.heading}
                  </h5>
                )}

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  {/* Loop fields inside the group */}
                  {group.items.map((field) => {
if (field.showIf && !formData[field.showIf]) {
    return null;
  }
return (
                    <div key={field.name} className={field.fullWidth ? "col-span-2" : ""}>
                      <Label>{field.label}</Label>

                      {/* TEXT INPUT */}
                      {field.type === "text" && (
                        <Input
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                        />
                      )}

                      {/* NUMBER INPUT */}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                        />
                      )}

                      {/* SELECT DROPDOWN */}
                      {field.type === "select" && (
            <CustomSelect
            // label={field.label}
    placeholder={field.placeholder}
    options={field.options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    )}
    value={formData[field.name] || ""}
    onChange={(value) =>
      setFormData({ ...formData, [field.name]: value })
    }
    className="w-full"
  />

                        // <select
                        //   className="w-full p-2 border rounded-lg"
                        //   value={formData[field.name]}
                        //   onChange={(e) =>
                        //     setFormData({ ...formData, [field.name]: e.target.value })
                        //   }
                        // >
                        //   <option value="">{field.placeholder}</option>
                        //   {field.options?.map((opt) => (
                        //     <option key={opt} value={opt}>
                        //       {opt}
                        //     </option>
                        //   ))}
                        // </select>
                      )}

                      {/* DATE INPUT */}
{field.type === "date" && (
   <DatePicker
              id={field.name}
              // label={field.label}
              placeholder={field.placeholder}
              defaultDate={formData[field.name]}
              // placeholder="Select a date"
               onChange={(dates, currentDate) => {
    setFormData({ ...formData, [field.name]: currentDate });
  }}
 calendarStyle={{
    width: "220px",              // OUTER box width
    transform: "scale(0.8)",    // INNER shrink
    transformOrigin: "top right",
  }}
              // onChange={(dates, currentDateString) => {
              //   // Handle your logic
              //   console.log({ dates, currentDateString });
              // }}
            />
)}
{field.type === "switch" && (
  <Switch
    // label={field.label}
    defaultChecked={formData[field.name]}
    onChange={(checked) =>
      setFormData({ ...formData, [field.name]: checked })
    }
  />
)}

{field.type === "textarea" && (<>  
          {/* <Label>Description</Label> */}
          <TextArea
          value={formData[field.name] || ""}
            // value={"message"}
             onChange={(checked) =>
      setFormData({ ...formData, [field.name]: checked })
    }
            // onChange={(value) => setMessage(value)}
            rows={6}
          />
       
</>

)}
                    </div>)
})}
                </div>
              </div>)
})}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {closeText}
            </Button>
            <Button
  size="sm"
  onClick={handleSave}
  disabled={loading}
  className="flex items-center gap-2"
>
  {loading && (
    <span className="animate-spin">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          opacity="0.5"
          cx="10"
          cy="10"
          r="8.75"
          stroke="white"
          strokeWidth="2.5"
        ></circle>
        <path
          d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 
          20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 
          3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491
          C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187C10.1528 1.94226 10.7059 2.50202 
          11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 
          4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 
          17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506Z"
          stroke="white"
          strokeWidth="4"
        ></path>
      </svg>
    </span>
  )}
  {loading ? "Processing..." : saveText}
</Button>

          </div>
        </form>
      </div>
    </Modal>
  );
}
