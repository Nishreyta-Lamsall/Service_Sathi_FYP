import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import {assets} from "../assets/assets"

const Sidebar = () => {

  const {aToken} = useContext(AdminContext)
  return (
    <div className="min-h-screen w-56 border-r shadow-lg p-4">
      {aToken && (
        <ul className="space-y-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" className="w-5" />
            <p className="text-sm font-medium">Dashboard</p>
          </NavLink>
          <hr />

          <NavLink
            to="/all-bookings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img src={assets.appointment_icon} alt="Bookings" className="w-5" />
            <p className="text-sm font-medium">Bookings</p>
          </NavLink>
          <hr />

          <NavLink
            to="/add-service"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img src={assets.add_icon} alt="Add Services" className="w-5" />
            <p className="text-sm font-medium">Add Services</p>
          </NavLink>
          <hr />

          <NavLink
            to="/add-provider"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img src={assets.add_icon} alt="Add Provider" className="w-5" />
            <p className="text-sm font-medium">Add Providers</p>
          </NavLink>
          <hr />

          <NavLink
            to="/service-list"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img
              src={assets.service_icon}
              alt="Services List"
              className="w-5"
            />
            <p className="text-sm font-medium">Services List</p>
          </NavLink>
          <hr />

          <NavLink
            to="/provider-list"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img
              src={assets.people_icon}
              alt="Providers List"
              className="w-5"
            />
            <p className="text-sm font-medium">Providers List</p>
          </NavLink>
          <hr />

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img
              src={assets.contact_icon}
              alt="Services List"
              className="w-5"
            />
            <p className="text-sm font-medium">Contact Information</p>
          </NavLink>
          <hr />
          <NavLink
            to="/testimonial"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
              }`
            }
          >
            <img
              src={assets.testimonial_icon}
              alt="Services List"
              className="w-5"
            />
            <p className="text-sm font-medium">User testimonials</p>
          </NavLink>
          <hr />
        </ul>
      )}
    </div>
  );
}

export default Sidebar