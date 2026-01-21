import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronRight, Database, FileBadge, FolderKanban, Route, Settings, ShieldUser, User } from 'lucide-react';
// Assume these icons are imported from an icon library
import {
  BoltIcon,
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { useAuth } from "../pages/AuthPages/AuthProvider";
import logo from "../assets/logo/S&plogo.jpg"
type NavItem = {
  name: string;
  icon: React.ReactNode;
   module?: string;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    //   subItems: [
    //   // { name: "Dashboard 1", path: "/", pro: false },
    //   // { name: "Dashboard 2", path: "/dash", pro: false },
    //    { name: "Dashboard 3", path: "/dash1", pro: false },
    
    // ],
    // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <Database />,
    name: "Master Creation",
       subItems: [
      // { name: "Material Inventory", path: "/master-creation", pro: false },
      { name: "Category", path: "/manage-category", pro: false },
       { name: "Unit", path: "/manage-unit", pro: false },],
    // path: "/calendar",
        // path: "/master-creation",

  },
  {
    icon: <Database />,
    name: "Inventory Management",
       subItems: [
      { name: "Material Master", path: "/master-creation", pro: false },
      { name: "Purchase Requisition (PR)", path: "/pr-create", pro: false },
       { name: "Purchase Order (PO)", path: "/purchase-order", pro: false },{ name: "GRN (Goods Receipt)", path: "/good-receipt", pro: false }],
    // path: "/calendar",
        // path: "/master-creation",

  },
  {
    icon: <FolderKanban />,
    name: "Project Management",
    path: "/project-creation",
  },
  {
    name: "Vendor Management",
    icon: <User />,
    path: "/vendor-management"
    // subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "DPR Module",
    icon: <FileBadge />,
    path: "/dpr-module"
    // subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Chainage Tracking",
    icon: <Route />,
    path: "/chainage-tracking"
    // subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    icon: <ShieldUser />,
    name: "Manage Role & Permission",
       subItems: [
        { name: "Manage Module", path: "/manage-module", pro: true },
                { name: "Manage Permission", path: "/manage-permission", pro: false },

        { name: "Manage Role", path: "/manage-role", pro: false },
        
      { name: "Manage User", path: "/manage-user", pro: false },
       { name: "Role & Permissions", path: "/role-permission", pro: false },],
    // path: "/calendar",
        // path: "/master-creation",

  },
  // {
  //   name: "Search",
  //   icon: <ListIcon />,
  //   path: "/form-elements"
  //   // subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Add Lawyers",
  //   icon: <TableIcon />,
  //    path: "/basic-tables"
  //   // subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Reports",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
  // {
  //   name: "Reports",
  //   icon: <PageIcon />,
  //   path: "/blank",
  //   // subItems: [
  //   //   { name: "Blank Page", path: "/blank", pro: false },
  //   //   { name: "404 Error", path: "/error-404", pro: false },
  //   // ],
  // },
  // {
  //   name: "Setting",
  //   icon: <Settings />,
  //    path: "/profile"
  //   // subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
const { hasModuleAccess } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
    <>
     

      {isActive(nav.path) && (
        <ChevronRight
          className="ml-auto w-5 h-5 text-white transition-transform duration-200"
        />
      )}
    </>
  )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
const filteredNavItems = navItems.filter(
  (item) => !item.name || hasModuleAccess(item.name)
);
console.log(hasModuleAccess("Inventory"));

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">

          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
           {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={logo}
                alt="Logo"
                width={40}
                height={20}
              />
             
              <img
                className="hidden dark:block"
               src={logo}
                alt="Logo"
                width={40}
                height={20}
              />
            </>
          ) : (
            <img
              src={logo}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div> */}
      <div
  className={`py-8 flex ${
    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
  }`}
>
  <Link to="/" className="flex items-center gap-3">
    {/* Logo Image */}
    <img
      src={logo}
      alt="S&P Logo"
      className="w-8 h-8 object-contain"
    />

    {/* Logo Text */}
    {(isExpanded || isHovered || isMobileOpen) && (<>
     <div className="flex flex-col leading-tight">
    <span className="text-xl font-semibold tracking-wide text-gray-900 dark:text-white">
      S&amp;P
    </span>
    <span className="text-xs text-gray-500">
      ERP Suite
    </span>
  </div>
</>
    )}
  </Link>
</div>

      <div className="flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
      {/* <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"> */}
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}

              {/* {renderMenuItems(navItems, "main")} */}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {/* {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )} */}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
      {/* 🔹 FIXED BOTTOM WIDGET */}
{(isExpanded || isHovered || isMobileOpen) && (
  <div className="px-3 pb-4">
    <SidebarWidget />
  </div>
)}
    </aside>
  );
};

export default AppSidebar;
