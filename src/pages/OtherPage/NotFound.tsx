import { Link } from "react-router";
import GridShape from "../../components/common/GridShape";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden z-1 px-6 text-center dark:bg-gray-900">
{/* <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1"> */}
      {/* Background Grid */}
      <GridShape />

      {/* Crane Hook */}
      <img
        src="/images/error/crane.png"
        alt="Crane Hook"
        className="absolute left-10 top-0 h-44 object-contain"
      />

      {/* Main Content */}
      <div className="z-10 max-w-xl">
        {/* <h1 className="text-[120px] font-extrabold leading-none text-blue-900 dark:text-white">
          4<span className="text-orange-500">0</span>4
        </h1> */}
<video
          className="mx-auto mb-6 h-[240px] w-auto object-contain"
          src="/images/error/4041.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <h2 className="mt-4 text-2xl font-semibold text-blue-900 dark:text-gray-200">
          Oops! <span className="text-orange-500">Page not Found</span>
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The road you are trying to access is blocked or no longer exists.
          Please return to the main route and continue your work.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
        >
          Go To Home Page
        </Link>
      </div>

      {/* Excavator */}
      <img
        src="/images/error/excavator.png"
        alt="Excavator"
        className="absolute bottom-16 right-10 h-44 object-contain"
      />

      {/* Road Strip */}
      {/* <div className="absolute bottom-0 left-0 h-14 w-full bg-blue-900">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.15)_0,rgba(255,255,255,0.15)_10px,transparent_10px,transparent_20px)]" />
      </div> */}

      {/* Footer */}
       <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - S&amp;P ERP
        </p>
    </div>
  );
}
