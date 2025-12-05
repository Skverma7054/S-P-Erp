import React from 'react'
import { Modal } from '../../components/ui/modal'

export default function CustomSelectModal({projects,isOpen,closeModal,onProjectClick}) {
  return (
    <>
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
         <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
    {/* PROJECT CARDS SECTION */}
{projects.length > 0 && (
  <div className="px-2 mb-8">
   {/* Title + Subtitle */}
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Select A Project
          </h4>

          {/* {subtitle && (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {subtitle}
            </p>
          )} */}
        </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick?.(project.id)}
          className="cursor-pointer border border-gray-200 dark:border-gray-700 p-4 rounded-xl 
                     bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 
                     hover:shadow-lg hover:border-brand-500 hover:bg-orange-50"
        >
          <div className="flex items-center gap-4">
            {/* Icon box */}
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l9-4 9 4m-9 13V3m0 17l-9-4m9 4l9-4"
                />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.description || "Click to view inventory"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
</div>
    </Modal>
    </>
  )
}
