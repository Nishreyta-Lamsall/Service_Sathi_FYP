import React from 'react'
import { useContext } from 'react'
import {AppContext} from '../context/AppContext'

const MyBookings = () => {

  const {Services} = useContext(AppContext)
  return (
    <div className="ml-16 mr-16 mb-20">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Bookings
      </p>
      <div>
        {Services.slice(0, 3).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            key={index}
          >
            <div>
              <img className="w-32 rounded-lg" src={item.image} alt="" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-neutral-800 font-semibold text-base">
                {item.name}
              </p>
              <p>{item.category}</p>
              <p className="text-zinc-700 fon-medium mt-1">
                Order Status: <span className="text-green-700">Booked</span>
              </p>
              <p className="text-sm mt-1">
                <span className="text-sm mt-neutral-700 font-medium">
                  Date and Time:{" "}
                </span>
                25 July, 2025 | 9:00 PM
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-1 border rounded hover:bg-blue-800 hover:text-white transition-all duration-300">
                Pay Online
              </button>
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-1 border rounded  hover:bg-red-700 hover:text-white transition-all duration-300">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings