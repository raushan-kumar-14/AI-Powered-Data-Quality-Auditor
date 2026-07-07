import {
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaDatabase
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="
    hidden
    md:flex
    md:w-56
    lg:w-64
    shrink-0
    min-h-screen
    bg-[#0B1220]
    text-white
    flex-col
    justify-between
    transition-all
    duration-300
    ">

      <div>

        {/* Logo */}
        <div className="px-7 py-8 border-b border-slate-700">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">

              <FaDatabase className="text-white text-lg" />

            </div>

            <div>

              <h1 className="text-2xl font-bold">
                Data Auditor
              </h1>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="mt-8 px-4 space-y-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-full flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <FaHome />
            Home
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `w-full flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <FaChartBar />
            Analytics
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `w-full flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <FaFileAlt />
            Reports
          </NavLink>

        </nav>

      </div>

      {/* Footer */}

      <div className="border-t border-slate-700 px-6 py-6">

        <p className="text-gray-400">

          AI Auditor

        </p>

        <p className="text-gray-500 text-sm">

          v1.0.0

        </p>

      </div>

    </aside>
  );
}