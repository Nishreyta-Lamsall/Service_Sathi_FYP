import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
  }
  return (
    <div className="flex items-center justify-center mt-14 mb-14">
      <div className="border font-primary border-gray-500 h-[30rem] w-[40rem] flex">
        {/*First child div*/}
        <div className="flex-1 bg-[#0A1F44] text-white text-5xl flex flex-col items-center justify-center">
          {/* Text Section */}
          <div className="flex-grow flex items-center justify-center">
            <p className="text-[2rem] -mt-20">
              Welcome <br />
              <span class="inline-block mt-3">to Service Sathi</span>
            </p>
          </div>
        </div>
        {/* Second child div */}
        <div className="flex-1 border">
          <div className="text-center mt-8">
            <p className="text-3xl font-medium">
              {state === "Sign Up" ? "Sign Up" : "Login"}
            </p>
          </div>
          <div className="text-sm ml-10 mt-5 text-slate-900">
            <form>
              <div className="">
                <p>Full Name</p>
                <input
                  className="border border-zinc-300 rounded  py-1 mt-1"
                  type="text"
                  onChange={(e) => setName(e.target.name)}
                  value={name}
                />
              </div>
              <div className="w-full">
                <p>Email</p>
                <input
                  className="border border-zinc-300 rounded py-1 mt-1"
                  type="email"
                  onChange={(e) => setEmail(e.target.name)}
                  value={name}
                />
              </div>
              <div className="">
                <p>Password</p>
                <input
                  className="border border-zinc-300 rounded py-1 mt-1"
                  type="password"
                  onChange={(e) => setPassword(e.target.name)}
                  value={name}
                />
              </div>
              <a
                href="#"
                className="text-red-500 block text-xs ml-[8.8rem] font-medium mt-4 underline"
              >
                Forget Password
              </a>
              <button
                type="button"
                className="px-5 py-1 mt-10 ml-20 border bg-[#2D64C5] rounded-3xl text-white"
              >
                {state === "Sign Up" ? "Sign Up" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login