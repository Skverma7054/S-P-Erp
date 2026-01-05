import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col lg:flex-row">

        {/* LEFT SIDE – AUTH FORM */}
        <div className="relative z-10 flex w-full flex-col justify-center p-6 sm:p-10 lg:w-1/2">
          {children}
        </div>

        {/* RIGHT SIDE – CONSTRUCTION VIDEO */}
        <div className="relative hidden h-full w-1/2 lg:block bg-brand-950 dark:bg-white/5">
          
          {/* Video */}
           <video
            src="/images/error/construction-road.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Grid + Branding */}
          <div className="relative z-10 flex h-full items-center justify-center">
            <GridShape />

            <div className="absolute bottom-16 left-16 max-w-md text-white">
              <h1 className="text-3xl font-bold">
                S&amp;P ERP
              </h1>
              <p className="mt-3 text-lg text-gray-200">
                Road Construction Management System
                <br />
                Projects • Inventory • DPR • Billing
              </p>
            </div>
          </div>
        </div>

        {/* THEME TOGGLER */}
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
