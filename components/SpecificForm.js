import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { TeamContext } from "../pages";
const Index = ({ handleSpecificCrossButton, onSpecificSubmit }) => {
  const [state, setState] = useState({
    anonymous: false,
    firstName: "",
    lastName: "",
    mitzvah: "",
    campaign: 1,
    amount: 1,
    team: 1,
    email: "",
  });
  const { teamData } = React.useContext(TeamContext);

  const [teamid, setTeamid] = useState(teamData.id);

  const handleSpecificSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date();
    const formattedTime = currentTime.toISOString();
    const payload = {
      id: 1,
      first_name: state.firstName,
      last_name: state.lastName,
      anonymous: state.anonymous,
      mitzvah: state.mitzvah,
      campaign: Number(state.campaign),
      amount: Number(state.amount),
      team: Number(teamid),
      email: state.email,
      timestamp: formattedTime,
    };
    onSpecificSubmit(payload);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return (
    <>
      <div className=" justify-center items-center flex fixed inset-0 z-50 p-2">
        <form
          onSubmit={handleSpecificSubmit}
          className="bg-white md:p-5 p-5 rounded-lg md:w-[40%] w-[90%] text-black"
        >
          <div
            onClick={handleSpecificCrossButton}
            className="relative z-0 w-full mb-4 group  flex items-end justify-end"
          >
            <Image
              className="bg-contain cursor-pointer"
              src="/remove.png"
              height={25}
              width={25}
              alt="cross-button"
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-3 group">
              <input
                type="text"
                name="firstName"
                id="floating_first_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={state.firstName}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                First name
              </label>
            </div>
            <div className="relative z-0 w-full mb-3 group">
              <input
                type="text"
                name="lastName"
                id="floating_last_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={state.lastName}
                onChange={(e) => handleChange(e)}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Last name
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full  group">
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-600">
              Anonymous:
            </label>
            <input
              type="checkbox"
              name="anonymous"
              id="anonymous"
              checked={state.anonymous}
              onChange={(e) => handleChange(e, "checkbox")}
              className="form-checkbox h-4 w-4 text-blue-900 transition duration-150 ease-in-out"
            />
          </div>

          {/* Name Section End Here */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              name="email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={state.email}
              onChange={(e) => handleChange(e)}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="mitzvah"
              name="mitzvah"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={state.mitzvah}
              onChange={(e) => handleChange(e)}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Pledge
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="amount"
              id="floating_repeat_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={state.amount}
              onChange={(e) => handleChange(e)}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Amount
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <select
              type="number"
              name="team"
              id="floating_repeat_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option>{teamData.name}</option>
            </select>
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Team
            </label>
          </div>

          <div className="relative z-0 w-full  group  flex items-end justify-end">
            <button
              type="submit"
              className=" text-white bg-[#E97848] hover:bg-[#ed895e] focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
    </>
  );
};

export default Index;
