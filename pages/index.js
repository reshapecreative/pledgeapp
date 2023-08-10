import React, { useState, useEffect } from "react";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Form from "../components/Form";
import SpecificForm from "../components/SpecificForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { headers } from "next/dist/client/components/headers";
export const TeamContext = React.createContext();

const Index = ({ getFirstAPI, isAPIFailed, pledgeApi, teamApi, ...props }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSpecificForm, setSpecificShowForm] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const [showLatest, setShowLatest] = useState(true);
  const [visiblePledgeCount, setVisiblePledgeCount] = useState(5);

  // Reverse the pledgeApi array if the showLatest state is false.
  const reversedPledgeApi = showLatest
    ? [...(pledgeApi || [])].reverse()
    : [...(pledgeApi || [])].reverse();

  // Slice the array based on the visiblePledgeCount.
  const pledgesToShow = reversedPledgeApi.slice(0, visiblePledgeCount);
  const handleLoadMore = () => {
    // If we are currently showing the latest pledges, we want to show the oldest ones on load more.
    // So we set the showLatest state to false.
    setShowLatest(!showLatest);

    // Increase the visiblePledgeCount to load more pledges.
    setVisiblePledgeCount(visiblePledgeCount + 5);
  };
  //  plege
  const [teamData, setTeamData] = useState({
    id: "",
    name: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  // console.log("pledge", pledgeApi);
  //for form button
  const handleButtonClick = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Adjust the width threshold as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const router = useRouter();

  //API CALL
  const handleApiCall = async (payload) => {
    const loadingToastId = toast.loading("Loading...");
    // console.log("THIS IS PAYLOAD ===>", payload);
    try {
      const apiBaseURL =
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/mitzvahthon";
      const queryParams = {
        id: payload.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        anonymous: payload.anonymous,
        email: payload.email,
        mitzvah: payload.mitzvah,
        campaign: payload.campaign,
        amount: payload.amount,
        team: payload.team,
        timestamp: payload.timestamp,
      };

      const response = await axios.get(`${apiBaseURL}/add`, {
        params: queryParams,
        headers: { "Content-Type": "application/json" },
      });

      // console.log("THIS IS API RESPONSE===>", response.data);

      // console.log(response.data);
      toast.success("Form Submitted Successfully");
      toast.success(
        "Submission will appear in the pledges list in a few minutes"
      );
      toast.dismiss(loadingToastId);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
      toast.dismiss(loadingToastId);
      setShowForm(false);
    }
  };

  //Specific Api call
  const handleSpecificApiCall = async (payload) => {
    const loadingToastId = toast.loading("Loading...");
    // console.log("THIS IS specific PAYLOAD ===>", payload);
    try {
      const apiBaseURL =
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/mitzvahthon";
      const queryParams = {
        id: payload.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        anonymous: payload.anonymous,
        email: payload.email,
        mitzvah: payload.mitzvah,
        campaign: payload.campaign,
        amount: payload.amount,
        team: payload.team,
        timestamp: payload.timestamp,
      };

      const response = await axios.get(`${apiBaseURL}/add`, {
        params: queryParams,
        headers: { "Content-Type": "application/json" },
      });

      // console.log(response.data);
      toast.success("Form Submitted Successfully");
      toast.success(
        "Submission will appear in the pledges list in a few minutes"
      );
      toast.dismiss(loadingToastId);
      setSpecificShowForm(false);
      setTeamData({
        id: "",
        name: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
      toast.dismiss(loadingToastId);
      setSpecificShowForm(false);
    }
  };

  //for form button
  const handleSpecificButtonClick = (value, event) => {
    event.stopPropagation();
    setTeamData({
      id: value.id,
      name: value.name,
    });
    setSpecificShowForm(true);
  };

  // FORMATTING TIME
  const TimeAgo = ({ time }) => {
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
      const updateTimeAgo = () => {
        const currentTime = new Date();
        const timestamp = new Date(time + " UTC"); // Append ' UTC' to ensure correct parsing
        const timeDiffInSeconds = Math.floor((currentTime - timestamp) / 1000);

        if (timeDiffInSeconds < 60) {
          setTimeAgo(
            `${timeDiffInSeconds} second${
              timeDiffInSeconds === 1 ? "" : "s"
            } ago`
          );
        } else if (timeDiffInSeconds < 3600) {
          const minutes = Math.floor(timeDiffInSeconds / 60);
          setTimeAgo(`${minutes} minute${minutes === 1 ? "" : "s"} ago`);
        } else if (timeDiffInSeconds < 86400) {
          const hours = Math.floor(timeDiffInSeconds / 3600);
          setTimeAgo(`${hours} hour${hours === 1 ? "" : "s"} ago`);
        } else if (timeDiffInSeconds < 604800) {
          const days = Math.floor(timeDiffInSeconds / 86400);
          setTimeAgo(`${days} day${days === 1 ? "" : "s"} ago`);
        } else if (timeDiffInSeconds < 2419200) {
          const weeks = Math.floor(timeDiffInSeconds / 604800);
          setTimeAgo(`${weeks} week${weeks === 1 ? "" : "s"} ago`);
        } else if (timeDiffInSeconds < 29030400) {
          const months = Math.floor(timeDiffInSeconds / 2419200);
          setTimeAgo(`${months} month${months === 1 ? "" : "s"} ago`);
        } else {
          const years = Math.floor(timeDiffInSeconds / 29030400);
          setTimeAgo(`${years} year${years === 1 ? "" : "s"} ago`);
        }
      };

      updateTimeAgo();
      const interval = setInterval(updateTimeAgo, 60000); // Update time every minute
      return () => clearInterval(interval);
    }, [time]);

    return <span>{timeAgo}</span>;
  };

  //BUTTONS DATA

  const buttonData = [
    {
      id: 1,
      name: "EVENT INFO",
      link: "https://register.walkwithfriendship.com/Static/event-info",
    },
    {
      id: 2,
      name: "REGISTER TO WALK",
      link: "https://register.walkwithfriendship.com/Account/Register",
    },
    {
      id: 3,
      name: "CREATE A TEAM",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfTxepm2_w62QVj_e6krltidlOrtytVUmfi777m-ULjoYAh9A/viewform?usp=sf_link",
    },
    {
      id: 4,
      name: "DONATE",
      link: "https://register.walkwithfriendship.com/Donate",
    },
    {
      id: 5,
      name: "KINDNESS IDEAS",
      link: "https://register.walkwithfriendship.com/Static/actsofkindness",
    },
  ];

  const handleRouteChange = (x, id) => {
    router.push({
      pathname: `/${x}-team`,
      query: { id: id },
    });
  };
  // TEAM NAME ACCORDING TO ID
  function getTeamNameById(id) {
    const team = teamApi?.find((team) => team.id === id);
    return team ? team.name : null;
  }
  return (
    <TeamContext.Provider value={{ teamApi, teamData }}>
      {/* Form  */}
      {showForm && (
        <Form
          handleCrossButton={() => setShowForm(false)}
          onSubmit={handleApiCall}
        />
      )}
      {showSpecificForm && (
        <SpecificForm
          handleSpecificCrossButton={() => setSpecificShowForm(false)}
          onSpecificSubmit={handleSpecificApiCall}
        />
      )}
      {/* Form  */}
      <title>Plegde App</title>
      <section>
        <div
          id="hero"
          className="md:h-[44vh] h-[50vh] md:px-0 px-8 w-full bg-[#E97848CC] m-auto flex justify-center items-center"
        >
          <Image
            src="/heading.png"
            className=""
            width={500}
            height={800}
            alt="heading"
          />
        </div>
        <div className="bar-wrapper bg-black">
          <div className="max-w-7xl m-auto flex  md:h-20 md:py-0 py-6 justify-center gap-6 text-white  items-center bar flex-col md:flex-row">
            <div className="flex items-center gap-4 ">
              <div>
                <p className="text-[40px] font-bold ">
                  {parseInt(getFirstAPI?.data?.mitzvahs_amount)}
                </p>
              </div>
              <div className=" flex flex-col text-[16px] leading-tight">
                <p>Kind Acts </p>
                <p>Pledged</p>
              </div>
            </div>
            {/* <HalfBackground
              width={getFirstAPI?.data?.precent_complete}
              className="half-background"
            ></HalfBackground> */}
            <div className="bg-[#FFFFFF] w-[40%]  rounded-2xl p-2 flex items-start justify-start ">
              <div
                className={`bg-[#E97848] rounded-md p-2 flex justify-start`}
                style={{
                  width: `${getFirstAPI?.data?.precent_complete}`,
                }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-[40px] font-bold">
                  {getFirstAPI?.data?.precent_complete}
                </p>
              </div>
              <div className=" flex flex-col text-[16px] leading-tight">
                <p>of</p>
                <p>{parseInt(getFirstAPI?.data?.goal)} Goal</p>
              </div>
            </div>
            <div>
              <button
                onClick={handleButtonClick}
                className="bg-[#E97848] hover:bg-[#eb6931] text-white p-1 py-2 px-6 rounded-full tracking-wider"
              >
                Pledge Now!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BUTTON SECTION */}
      <div className="bg-white flex flex-wrap items-center justify-center py-4 w-full gap-4 md:justify-center ">
        {buttonData.map((val) => (
          <div
            key={val.id}
            className="bg-[#E97848] rounded-md py-3 px-4 cursor-pointer hover:bg-[#FFA270] transition-colors duration-300  md:w-auto w-[90%]"
            onClick={() => window.open(val.link, "_blank")}
          >
            <p className="font-poppins text-[14px] text-white text-center">
              {val.name}
            </p>
          </div>
        ))}
      </div>
      {/* BUTTON SECTION */}

      <section className="bg-[#E9784836] text-[#B05C39]">
        <div className=" max-w-7xl m-auto text-center md:h-fit pt-20 mb-10 md:pb-16 pb-16">
          <h1 className="md:text-[38px] text-[38px] font-[700] font-poppins]">
            Be A Champion of Kindness!
          </h1>
          <p className="md:text-[18px] text-[19px] md:w-3/4 m-auto md:p-10 p-5 md:py-10 py-10  text-center ">
            Thank you for supporting our mission of friendship and inclusion
            through our Community Kindness Challenge. This year, rather than
            raising funds, we are raising Acts of Kindness (Mitzvahs!)
            throughout the community. Our Community Kindness Challenge
            culminates at the walk, where our Kindness Champions will receive
            recognition and celebration for their acts of kindness throughout
            the community! Check out our kindness ideas list for acts of
            kindness you can do. If you complete 5 acts of kindness within each
            category. you will receive a limited-edition kindness merit badge!
          </p>
          <p className="md:text-[28px] text-[28px] font-[600] ">
            Sunday, October 22nd, 2023
          </p>
          <h1 className="md:text-[28px] text-[28px] font-[600]">
            Lid Park, Mercer Island
          </h1>
        </div>
      </section>
      <section className="mb-24 mx-auto">
        {/* VIDEO SECTION */}
        <div className="video-container flex items-center justify-center w-full mb-10 mt-5">
          <iframe
            src="https://www.youtube.com/embed/Aa9OSCuqwHM"
            title="YouTube Video"
            allowFullScreen
            className="w-4/5 md:w-1/2 h-80"
          />
        </div>

        {/* VIDEO SECTION */}
        {/* left side bar start from here */}
        <div className="wrapper">
          <div className="container">
            <div className="main-content md:w-[100%] w-full flex justify-around relative pb-10">
              <div className=" w-full h-5 md:absolute lg:ml-16 mb-14">
                <h2 className="heading"> Teams</h2>
              </div>
              {teamApi?.map((value, id) => {
                const percentComplete = parseFloat(
                  value?.percent_complete.replace("%", "")
                );
                const fixedPercentComplete =
                  percentComplete > 100 ? 100 : percentComplete;
                const progressBarWidth = 100;
                let team_name = value.name;
                let first_part = team_name.split(" ")[0];
                return (
                  <div
                    onClick={() => handleRouteChange(first_part, value.id)}
                    key={id}
                    id="cards"
                    className="card md:w-[50%] md:mx-2 w-[95%] mx-auto lg:mt-24 mt-6 cursor-pointer"
                  >
                    <h2>{value?.name}</h2>
                    {/* <div class="half-background"></div> */}
                    <div className="bg-[#B05C39] w-[90%] rounded-2xl p-1 flex items-center justify-start m-auto mt-2 h-[20px] my-2">
                      <div
                        className={`bg-[#FBE2D8] rounded-full p-1 flex justify-start h-[12px]  items-center`}
                        style={{
                          width: `${
                            fixedPercentComplete * (progressBarWidth / 100)
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="mt-2">
                      {value?.mitzvah_amount} Pledges of {value?.goal} Pledge
                      Goal
                    </p>
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={(event) => {
                          // setTeamData({
                          //   id: value.id,
                          //   name: value.name,
                          // });
                          handleSpecificButtonClick(value, event);
                        }}
                        className="button"
                      >
                        Pledge Now!
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* left side bar start from here */}
            {/* right side bar start from here */}
            <div className="wrapper md:w-[45%]">
              <div className="sidebar h-[70vh] overflow-y-scroll md:w-[90%] w-full m-auto md:mb-2 mb-20">
                <h2 className="heading">Pledges</h2>
                {pledgesToShow.map((val, ind) => {
                  let teamName = getTeamNameById(val.team);
                  let firstName = teamName.split(" ")[0];

                  return (
                    <>
                      <div key={ind}>
                        <div className="card">
                          {val.anonymous !== true ? (
                            <h3 className=" font-bold text-[20px] text-[#B05C39]">
                              {val?.first_name} {val?.last_name}
                            </h3>
                          ) : (
                            <h3 className=" font-bold text-[20px] text-[#B05C39]">
                              {val.first_last_name}
                            </h3>
                          )}
                          <div className="flex">
                            <span className=" ">with</span>
                            <span
                              onClick={() => {
                                router.push({
                                  pathname: `/${firstName}-team`,
                                  query: { id: val.team },
                                });
                              }}
                              className="underline ml-1 cursor-pointer "
                            >
                              {getTeamNameById(val.team)}
                            </span>
                          </div>
                          <p className="mt-1">{val?.mitzvah}</p>
                          <TimeAgo time={val?.time} />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="flex justify-center items-center md:mb-0 md:mt-8 mb-16">
                {visiblePledgeCount < (pledgeApi || []).length && (
                  <button className="centered-btn" onClick={handleLoadMore}>
                    Load more
                  </button>
                )}
              </div>
            </div>
            {/* right side bar END from here */}
          </div>
        </div>
      </section>
      <section className="bg-[#E9784836] pb-14 ">
        <h1 className="text-3xl font-[700] text-[40px] text-[#B05C39] text-center py-14">
          Sponsors
        </h1>
        {isMobileView ? (
          <div className="flex justify-around items-center">
            <Carousel
              showThumbs={false}
              autoPlay={true}
              interval={2000}
              infiniteLoop={true}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              transitionTime={500}
              stopOnHover={false}
              emulateTouch={true}
              swipeable={true}
            >
              <div>
                <img src="/amazon.png" height={300} width={350} alt="Amazon" />
              </div>
              <div>
                <img
                  src="/deloitte.png"
                  height={260}
                  width={240}
                  alt="deloitte"
                />
              </div>
              <div>
                <img
                  src="/minuteman.png"
                  height={240}
                  width={220}
                  alt="minuteman"
                />
              </div>
              <div>
                <img
                  src="/swedish.png"
                  height={400}
                  width={270}
                  alt="swedish"
                />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="flex justify-around items-center">
            <img src="/amazon.png" height={300} width={350} alt="Amazon" />
            <img src="/deloitte.png" height={260} width={240} alt="deloitte" />
            <img
              src="/minuteman.png"
              height={240}
              width={220}
              alt="minuteman"
            />
            <img src="/swedish.png" height={400} width={270} alt="swedish" />
          </div>
        )}
        <div className="flex justify-center items-center">
          <button
            onClick={() => router.push("https://register.walkwithfriendship.com/Static/sponsors")}
            className="centered-btn"
          >
            Become a Sponsor
          </button>
        </div>
      </section>
      <footer className="text-left bg-[#E97848] text-white lg:text-left pt-14 md:pb-8 pb-4 pl-12 tracking-wide ">
        <div className="container px-6 mx-auto">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="mb-6 md:mb-0">
              <Image
                className="mb-8"
                src="/friendship.png"
                height={200}
                width={290}
                alt="logo"
              />
              <h1 className="font-[600] tracking-wider mb-1">
                The Friendship Circle of Washington
              </h1>
              <p className="mb-4">
                2737 77th Ave. SE, Suite 101, Mercer Island, WA 98040
              </p>
            </div>

            <div className="mb-6 md:mb-0 w-[60%] lg:mx-auto lg:pl-6">
              <h5 className="text-[19px] font-[600]">206-FRIENDS (374-3637)</h5>
              <h5 className="text-[19px] font-[600]">
                www.FriendshipCircleWA.org
              </h5>
              <p className="text-[14px] mt-3">
                The Friendship Circle of Washington is a 501(c)3 non-profit
                non-sectarian organization. Tax ID#: 91-2173196
              </p>
              <div className="flex flex-col md:mt-4  mt-2 md:flex-row md:space-x-2 tracking-wider">
                <p className="">
                  Powered by{" "}
                  <span
                    className="underline text-[17px] cursor-pointer"
                    onClick={() => router.push("https://www.google.com/")}
                  >
                    Mitzvahthon
                  </span>
                </p>
                <p className="">
                  by{" "}
                  <span
                    className="underline text-[17px] cursor-pointer"
                    onClick={() => router.push("https://www.google.com/")}
                  >
                    Reshape Creative
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </TeamContext.Provider>
  );
};

export async function getServerSideProps() {
  let getFirstAPI = {};
  let pledgeApi = [];
  let teamApi = {};
  let isAPIFailed = false;
  try {
    const response = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/campaign?id=1"
    );

    const response1 = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/mitzvahs?id=1"
    );

    const response2 = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/teams?id=1"
    );

    // console.log("THIS IS FIRST API ", response.data);
    // console.log("THIS IS Plegde API ", response1.data);
    // console.log("THIS IS Team API ", response2.data);
    getFirstAPI = response.data;
    pledgeApi = response1.data;
    teamApi = response2.data;
  } catch (err) {
    console.error(err);
    isAPIFailed = true;
  }

  return {
    props: {
      getFirstAPI,
      isAPIFailed,
      pledgeApi,
      teamApi,
    },
  };
}

export default Index;
