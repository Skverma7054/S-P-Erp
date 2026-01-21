import React from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import CustomSelect from "../DropDown/CustomDropdown";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";
import { Edit, Eye, Trash2 } from "lucide-react";
import CustomMultiSelect from "../DropDown/CustomMultiSelect";
import MultiSelect from "../../components/form/MultiSelect";
import TimePicker from "../../components/form/TimePicker";
import DateTimePicker from "../../components/form/DateTimePicker";
import FileInputExample from "../../components/form/form-elements/FileInputExample";
import FileUploadInput from "../FileUpload/FileUploadInput";
import Alert from "../../components/ui/alert/Alert";
import DropzoneComponent from "../FileUpload/DropzoneComponent";
interface CustomModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: () => void;
  title: string;
  subtitle?: string;
  fields: any[];

  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;

  saveText?: string;
  closeText?: string;
  loading?: boolean;
saveDisabled?: boolean; // ✅ ADD THIS
  handleInput?: (name: string, value: any) => void;
  onAddArrayItem?: (groupName: string) => void;
  onUpdateArrayItem?: (
    groupName: string,
    rowIndex: number,
    field: string,
    value: any
  ) => void;
  onRemoveArrayItem?: (groupName: string, rowIndex: number) => void;

  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
}


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
  saveDisabled = false,
  handleInput,
  onAddArrayItem,
  onUpdateArrayItem,
  onRemoveArrayItem,
}:CustomModalProps) {

  const internalHandleInput = (name: string, value: any) => {
    console.log(name,value,"--internalHandleInput");
    
  if (handleInput) {
    handleInput(name, value); // use parent handler if provided
  } else {
    setFormData((prev: any) => ({ ...prev, [name]: value })); // fallback
  }
};
const internalAddItem = (groupName: string) => {
  setFormData((prev: any) => ({
    ...prev,
    [groupName]: [
      ...(prev[groupName] || []),
      {},
    ],
  }));
};

const internalUpdateItem = ( groupName: string,
  rowIndex: number,
  fieldName: string,
  value: any) => {
  const rows = [...(formData[groupName] || [])];
  rows[rowIndex] = {
    ...rows[rowIndex],
    [fieldName]: value,
  };

  setFormData((prev: any) => ({
    ...prev,
    [groupName]: rows,
  }));
};

const internalRemoveItem = (groupName: string, rowIndex: number) => {
  const rows = [...(formData[groupName] || [])];
  rows.splice(rowIndex, 1);

  setFormData((prev: any) => ({
    ...prev,
    [groupName]: rows,
  }));
};

const shouldShow = ( showIf: string | { field: string; value: any } | undefined,
  formData: Record<string, any>) => {
  if (!showIf) return true;

  // Case 1: string-based condition
  if (typeof showIf === "string") {
    return Boolean(formData[showIf]);
  }

  // Case 2: object-based condition
  if (typeof showIf === "object") {
    const { field, value } = showIf;
    return formData[field] === value;
  }

  return true;
};
// const addMaterialItem = (groupName) => {
//   setFormData((prev) => ({
//     ...prev,
//     [groupName]: [
//       ...(prev[groupName] || []),
//       {
//         material_code: "",
//         material_name: "",
//         quantity: "",
//         unit: "",
//         required_date: "",
//       },
//     ],
//   }));
// };

// const updateMaterialItem = (groupName, rowIndex, fieldName, value) => {
//   console.log(groupName, rowIndex, fieldName, value,"---updateMaterialItem");
  
//   const rows = [...formData[groupName]];
//   rows[rowIndex][fieldName] = value;

//   setFormData((prev) => ({
//     ...prev,
//     [groupName]: rows,
//   }));
// };

// const removeMaterialItem = (groupName, rowIndex) => {
//   const rows = [...formData[groupName]];
//   rows.splice(rowIndex, 1);

//   setFormData((prev) => ({
//     ...prev,
//     [groupName]: rows,
//   }));
// };

const addMaterialItem = (groupName: string) => {
  if (onAddArrayItem) {
    onAddArrayItem(groupName);
  } else {
    internalAddItem(groupName);
  }
};

const updateMaterialItem = (groupName, rowIndex, fieldName, value) => {
  if (onUpdateArrayItem) {
    onUpdateArrayItem(groupName, rowIndex, fieldName, value);
  } else {
    internalUpdateItem(groupName, rowIndex, fieldName, value);
  }
};

const removeMaterialItem = (groupName, rowIndex) => {
  if (onRemoveArrayItem) {
    onRemoveArrayItem(groupName, rowIndex);
  } else {
    internalRemoveItem(groupName, rowIndex);
  }
};


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
            {fields.map((group: any) => {

              if (!shouldShow(group.showIf, formData)) return null;
              // ✅ HERE — extract action config ONCE per group
  const actionField = group.Subitems?.find(
    (item) => item.name === "action"
  );
              return(
                <div key={group.heading || group.name} className="mb-7">
              {/* <div  className="mb-7"> */}

                {/* Section Heading */}
                {group.heading && (
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                    {group.heading}
                  </h5>
                )}
 {group?.addButtonLabel && (
                 <button
      type="button"
     onClick={() => addMaterialItem(group.name)}
      className="text-sm font-medium text-orange-600 hover:underline"
    >
     + {group.addButtonLabel}
    </button>
                )}
{group.type !== "array" && 
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
 
                  {/* Loop fields inside the group */}
                  {group.items.map((field: any) => {
if (!shouldShow(field.showIf, formData)) return null;
return (
                    <div key={field.name} className={field.fullWidth ? "col-span-2" : ""}>
                      <Label>{field.label}</Label>

                      {/* TEXT INPUT */}
                      {field.type === "text" && (
                        <Input
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          readOnly={field.readOnly}
                          // onChange={(e) =>
                          //   setFormData({ ...formData, [field.name]: e.target.value })
                          // }
                          onChange={(e) => internalHandleInput(field.name, e.target.value)}
                        />
                      )}

                      {/* NUMBER INPUT */}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                            onChange={(e) => internalHandleInput(field.name, e.target.value)}

                          // onChange={(e) =>
                          //   setFormData({ ...formData, [field.name]: e.target.value })
                          // }
                        />
                      )}

                      {/* SELECT DROPDOWN */}
                      {field.type === "multiselect" && (
  <MultiSelect
    // label={field.label}
    options={field.options}
    value={formData[field.name] || []}
    onChange={(val) => internalHandleInput(field.name, val)}
    placeholder={field.placeholder}
  />
)}
                      {field.type === "select" && (
            <CustomSelect
             id={`${field.label}-${field.name}`}
             loading={field.loading}  
             emptyText={field.emptyText} 
             disabled={field.disabled}  
            // label={field.label}
    placeholder={field.placeholder}
    options={field.options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    )}
    multiple={field.multiple}    
    value={ formData[field.name] !== "" &&
    formData[field.name] !== null
      ? formData[field.name]
      : undefined}
    onChange={(value) => internalHandleInput(field.name, value)}
    // onChange={(value) =>
    //   setFormData({ ...formData, [field.name]: value })
    // }
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
              onChange={(dates, currentDate) => internalHandleInput(field.name, currentDate)}
  //              onChange={(dates, currentDate) => {
  //   setFormData({ ...formData, [field.name]: currentDate });
  // }}
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
{field.type === "time" && (
  <TimePicker
    id={field.name}
    placeholder={field.placeholder || "Select Time"}
    defaultTime={formData[field.name]}
    onChange={(dates, timeStr) =>
      internalHandleInput(field.name, timeStr)
    }
    calendarStyle={{
      width: "180px",
      transform: "scale(0.85)",
      transformOrigin: "top right",
    }}
  />
)}
{field.type === "datetime" && (
  <DateTimePicker
    id={field.name}
    placeholder={field.placeholder}
    defaultValue={formData[field.name]}
    onChange={(dates, dateTimeStr) =>
      internalHandleInput(field.name, dateTimeStr)
    }
    calendarStyle={{
      width: "260px",
      transform: "scale(0.85)",
      transformOrigin: "top right",
    }}
  />
)}

{field.type === "switch" && (
  <Switch
    // label={field.label}
    defaultChecked={formData[field.name]}
    onChange={(checked) => internalHandleInput(field.name, checked)}
    // onChange={(checked) =>
    //   setFormData({ ...formData, [field.name]: checked })
    // }
  />
)}

{field.type === "textarea" && (<>  
          {/* <Label>Description</Label> */}
          <TextArea
          value={formData[field.name] || ""}
          placeholder={field.placeholder}
            // value={"message"}
            onChange={(value) => internalHandleInput(field.name, value)}
    //          onChange={(checked) =>
    //   setFormData({ ...formData, [field.name]: checked })
    // }
            // onChange={(value) => setMessage(value)}
            rows={6}
          />
       
</>

)}
{field.type === "fileselect" && (
  <FileUploadInput
    label={field.label}
    accept={field.accept}
    value={formData[field.name] || null}
    onChange={(file) =>
      internalHandleInput(field.name, file)
    }
  />
)}


{field.type === "dropfileselect" && (
 
    <DropzoneComponent
      title={field.label}
      accept={field.accept}
      multiple={field.multiple ?? false}
     value={formData[field.name] || null}
      helperText={field.helperText}
      onFileSelect={(files) =>
        internalHandleInput(
          field.name,
          field.multiple ? files :  files?.[0] || null
        )
      }
    />
 
)}
{/* ALERT BOX */}
{field.type === "alert" && (
  
    <Alert
      variant={field.variant || "info"}
      title={field.title}
      message={field.message}
      showLink={field.showLink}
      linkHref={field.linkHref}
      linkText={field.linkText}
    />
 
)}


                    </div>)
})}
                </div>}
                {/* ---------- ARRAY TYPE (Material Items) ---------- */}
     {group.type === "array" && (
  <div>
    
    {formData[group.name]?.map((row: any, rowIndex: number) => (
      <div
        key={rowIndex}
        className="mb-4 rounded-xl bg-gray-50 p-3"
      >
        {/* 🔹 Header Row */}
        <div className="flex items-center justify-between mb-3">
          <h6 className="font-medium text-gray-700">
            Item #{rowIndex + 1}
          </h6>

          {/* 🔹 Action Buttons */}
          {actionField && (
          <div className="flex gap-2">
             {actionField.showIcon?.edit && (
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onEdit?.(row)}
            >
              <Edit size={16} />
            </button>)}
{actionField.showIcon?.delete && (
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => removeMaterialItem(group.name, rowIndex)}
            >
              <Trash2 size={16} />
            </button>)}
{actionField.showIcon?.view && (
            <button
              className="text-green-600 hover:text-green-800"
              onClick={() => onView?.(row)}
            >
              <Eye size={16} />
            </button>)}
          </div>)}
        </div>
        <div className="grid grid-cols-12 gap-3">
          {group.Subitems.filter((f) => f.name !== "action").map((field) => (
            <div
              key={field.name}
              className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-4"
            >
              <Label>{field.label}</Label>

              {field.type === "text" && (
                <Input
                  value={row[field.name]}
                  readOnly={field.readOnly}
                  onChange={(e) =>
                    updateMaterialItem(
                      group.name,
                      rowIndex,
                      field.name,
                      e.target.value
                    )
                  }
                />
              )}

              {field.type === "number" && (
                <Input
                  type="number"
                  value={row[field.name]}
                  readOnly={field.readOnly}
                  onChange={(e) =>
                    updateMaterialItem(
                      group.name,
                      rowIndex,
                      field.name,
                      e.target.value
                    )
                  }
                />
              )}

              {field.type === "select" && (
                <CustomSelect
                  value={row[field.name]}
                  loading={field.loading}  
                  disabled={field.disabled}  
                  options={field.options}
                  emptyText={field.emptyText}
                  onChange={(value) =>
                    updateMaterialItem(
                      group.name,
                      rowIndex,
                      field.name,
                      value
                    )
                  }
                />
              )}

              {field.type === "date" && (
                <DatePicker
                 id={`${group.name}-${rowIndex}-${field.name}`} // ✅ unique
                //  value={row[field.name]}
                  defaultDate={row[field.name]}
                  onChange={(d, dateStr) =>
                    updateMaterialItem(
                      group.name,
                      rowIndex,
                      field.name,
                      dateStr
                    )
                  }
                  calendarStyle={{
    width: "120px",              // OUTER box width
    transform: "scale(0.8)",    // INNER shrink
    transformOrigin: "top right",
  }}
                />
              )}
            </div>
          ))}

        
          {/* <div className="col-span-12 flex justify-end">
            <button
              type="button"
              className="text-red-500 text-xl"
              onClick={() =>
                removeMaterialItem(group.name, rowIndex)
              }
            >
              ×
            </button>
          </div> */}
        </div>
      </div>
    ))}
    {/* 🔹 TOTAL SECTION */}
    {group.total && (
      <div className="flex justify-end mt-4">
        <div className="rounded-lg bg-gray-100 px-6 py-3 text-right">
          <span className="text-sm text-gray-500">Total Amount</span>
          <div className="text-lg font-semibold">
            ₹{" "}
            {formData[group.name]
              ?.reduce(
                (sum, item) => sum + Number(item.amount || 0),
                0
              )
              .toFixed(2)}
          </div>
        </div>
      </div>
    )}
  </div>
)}
{/* {group.type === "array" && (
  <div className="mt-4 rounded-xl border border-gray-200 overflow-x-auto">
    
    
    <div className="overflow-x-auto">
     <table className="min-w-[900px] w-full text-sm table-fixed">

        <thead className="bg-gray-100 text-gray-600">
          <tr>
            {group.Subitems.map((field) => (
              <th
                key={field.name}
                className="px-3 py-2 text-left font-medium"
              >
                {field.label}
              </th>
            ))}
            
          </tr>
        </thead>

        <tbody>
          {formData[group.name]?.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {group.Subitems.map((field) => (
                <td key={field.name} className="px-3 py-2">
                  {field.type === "text" && (
                    <Input
                      value={row[field.name]}
                       readOnly={field.readOnly}
                      onChange={(e) =>
                        updateMaterialItem(
                          group.name,
                          rowIndex,
                          field.name,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      type="number"
                      value={row[field.name]}
                      onChange={(e) =>
                        updateMaterialItem(
                          group.name,
                          rowIndex,
                          field.name,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {field.type === "select" && (
                    <CustomSelect
                      value={row[field.name]}
                      options={field.options}
                      loading={field.loading}
                      onChange={(value) =>
                        updateMaterialItem(
                          group.name,
                          rowIndex,
                          field.name,
                          value
                        )
                      }
                    />
                  )}

                   {field.type === "date" && (
                <DatePicker
                 id={`${group.name}-${rowIndex}-${field.name}`} // ✅ unique
                //  value={row[field.name]}
                  defaultDate={row[field.name]}
                  onChange={(d, dateStr) =>
                    updateMaterialItem(
                      group.name,
                      rowIndex,
                      field.name,
                      dateStr
                    )
                  }
                  calendarStyle={{
    width: "120px",              // OUTER box width
    transform: "scale(0.8)",    // INNER shrink
    transformOrigin: "top right",
  }}
                />
              )}

               {field.name === "action" &&(
                       
                          <div className="flex gap-2">
                            {field.showIcon?.edit && (
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                                onClick={() => onEdit?.(row)}
                              >
                                <Edit size={16} />
                              </button>
                            )}
                            {field.showIcon?.delete && (
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                                onClick={() =>
                    removeMaterialItem(group.name, rowIndex)
                  }
                                // onClick={() => onDelete?.(row)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            
                            {field.showIcon?.view && (
                              <button
                                className="text-green-600 hover:text-green-800"
                                title="View"
                                onClick={() => onView?.(row)} // ✅ triggers view handler
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            
                          </div>
                        )}
                    
                     
                </td>
              ))}

              
            </tr>
          ))}

          
          {group.total && (
          <tr className="border-t bg-gray-50">
            <td
              colSpan={group.Subitems.length -1}
              className="px-3 py-2 text-right font-semibold"
            >
              Total Amount:
            </td>
            <td className="px-3 py-2 text-right font-semibold">
              ₹{" "}
              {formData[group.name]
                ?.reduce(
                  (sum, item) =>
                    sum + Number(item.amount || 0),
                  0
                )
                .toFixed(2)}
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)} */}

              </div>
              
            )
})}
          

</div>
          
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {closeText}
            </Button>
            <Button
  size="sm"
  onClick={handleSave}
  disabled={loading|| saveDisabled}
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
