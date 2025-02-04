import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RelatedServices = ({category, serviceId}) => {

    const {Services} = useContext(AppContext)
    const navigate = useNavigate()

    const [relServices, setRelServices] = useState([])

    useEffect(()=>{
        if(Services.length > 0 && category){
            const ServicesData = Services.filter((Services)=> Services.category === category && Services._id !== serviceId)
            setRelServices(ServicesData)
        }

    }, [Services,category,serviceId])
  return (
    <div className="flex flex-col gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className='text-xl font-semibold ml-16'> Similar Services </h1>
      <div className="w-full ml-[4rem] grid grid-cols-4 gap-6 pt-5 gap-y-8 px-3 sm:px-0 ">
        {relServices.slice(0, 7).map((item, index) => (
          <div
            onClick={() => {navigate(`/bookings/${item._id}`); scrollTo(0,0)}}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mr-[4rem]"
            key={index}
          >
            <img
              className="w-full h-40 object-cover bg-blue-50"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-base font-medium">
                {" "}
                {item.name}
              </p>
              <p className="text-gray-600 text-sm">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedServices