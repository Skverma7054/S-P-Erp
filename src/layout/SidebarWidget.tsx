
export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
       {/* <img
                  src="/public/images/logo/ehnovateImg.png"
                  alt="EHNOVATE TECHNOLOGIES"
                  style={{
                    width: "100px",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  }}
                /> */}
                <p
        className="mb-1 text-[11px] text-gray-600 font-semibold uppercase tracking-wide"
      >
        Sponsored By
      </p>

      <div className="flex justify-center">
        <img
          src="/images/logo/ehnovateImg.png"
          alt="EHNOVATE TECHNOLOGIES"
          className="w-[100px] object-contain opacity-90 hover:opacity-100 transition"
        />
      </div>
      {/* <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
       
        Need Help?
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        
        Contact our support team
      </p> */}
      {/* <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
      Get Support
      </a> */}
    </div>
  );
}
