import React, { useState, useEffect } from "react";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import NewPageForm from "../components/NewPageForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NewPage = React.createContext();

const Index = ({ getFirstAPI, isAPIFailed, pledgeApi, teamApi, ...props }) => {
  const [showForm, setShowForm] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);
  const [temPledgeData, setTempPledgeData] = useState([]);
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
    setTempPledgeData(pledgeApi);
  });

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
  const headingName = router?.query?.name.split("-");

  //Specific Api call

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
      link: "https://www.google.com",
    },
    {
      id: 2,
      name: "REGISTER TO WALK",
      link: "https://www.google.com",
    },
    {
      id: 3,
      name: "LOG YOUR KINDNESS",
      link: "https://www.google.com",
    },
    {
      id: 4,
      name: "DONATE",
      link: "https://www.google.com",
    },
    {
      id: 5,
      name: "KINDNESS IDEAS",
      link: "https://www.google.com",
    },
  ];

  const handleRouteChange = (x) => {
    router.push(`${x}-team`);
  };

  //FILTER PLEDGE API ACCORDING TO TEAMS
  function filterDataByTeam(data, teamId) {
    return data.filter((item) => item.team === teamId);
  }

  let teamId = router.query.id;
  let numTeamID = Number(teamId);

  const filteredData = filterDataByTeam(temPledgeData, numTeamID);
  // console.log("THIS IS SPERATE TEAM", filteredData);

  //FORM FUNCTIONS
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
        // team: payload.team,
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

  let teamName = router.query.name;

  return (
    <NewPage.Provider value={{ numTeamID, teamName }}>
      {/* Form  */}
      {showForm && (
        <NewPageForm
          handleCrossButton={() => setShowForm(false)}
          onSubmit={handleApiCall}
        />
      )}
      {/* Form  */}
      <title>Mitzvahs for Shaina</title>
      <section>
        <div className="flex flex-col relative">
          <div
            id="hero"
            className="md:h-[44vh] h-[50vh] md:px-0 px-8 w-full bg-[#008D05] m-auto flex justify-center items-center flex-col"
          >
            {/* <Image
              src="/heading.png"
              className=""
              width={500}
              height={800}
              alt="heading"
            /> */}
            <p className="text-white font-bold text-[25px] mt-5 font-poppins">
              {headingName[0]} Team
            </p>
            <div
              onClick={() => router.back()}
              className="flex bg-white px-8 py-2 items-center justify-evenly rounded-lg cursor-pointer absolute top-3 left-3"
            >
              <Image
                src={"/green-arrow.png"}
                width={10}
                height={10}
                alt="back"
              />
              <p className="text-[#008D05] text-[14px] font-poppins ml-3">
                Back to main page
              </p>
            </div>
          </div>
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
                className={`bg-[#008D05] rounded-md p-2 flex justify-start`}
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
                onClick={() => handleButtonClick()}
                className="bg-[#008D05]  text-white p-1 py-2 px-6 rounded-full tracking-wider font-bold"
              >
                Pledge Now!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BUTTON SECTION */}
      {/* <div className="bg-white flex flex-wrap items-center justify-center py-4 w-full gap-4 md:justify-center ">
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
      </div> */}
      {/* BUTTON SECTION */}

      <section className="bg-[#D4ECD5] text-[#005303]">
        <div className=" max-w-7xl m-auto text-center md:h-fit pt-20 mb-10 md:pb-16 pb-16">
          <h1 className="md:text-[38px] text-[38px] font-[700] font-poppins]">
            Mitzvahs for Shaina
          </h1>
          <p className="md:text-[18px] text-[35px] md:w-3/4 m-auto md:p-10 p-5 md:py-10 py-10  text-center ">
            A dear Ganeinu student Shaina bas Chana is dealing with a serious
            medical issue and we are determined to encourage the performance of
            thousands of Mitzvahs in the merit of a complete and speedy recovery
            for Shaina!
          </p>
          <p className="md:text-[28px] text-[28px] font-[600] ">
            Please pledge a Mitzvah today,
          </p>
          <h1 className="md:text-[28px] text-[28px] font-[600]">
            share with friends and then pledge another Mitzvah!
          </h1>
        </div>
      </section>
      <section className="mb-24 mx-auto">
        {/* VIDEO SECTION */}
        {/* <div className="video-container flex items-center justify-center w-full mb-24 mt-14">
          <iframe
            src="https://www.youtube.com/embed/NXkJ9eNpWNw"
            title="YouTube Video"
            allowFullScreen
            className="w-4/5 md:w-1/2 h-80"
          />
        </div> */}

        {/* VIDEO SECTION */}
        {/* left side bar start from here */}
        {/* New Work HERE */}
        <div class="flex flex-col items-center sm:flex-row sm:items-center">
          <p class="text-3xl text-[#005303] font-poppins font-bold sm:ml-28">
            {headingName[0]} Team Pledges
          </p>
          <div
            onClick={() => router.back()}
            class="bg-[#005303] text-white text-sm rounded-full flex items-center justify-center h-8 px-2 mt-3 sm:mt-0 sm:ml-5 cursor-pointer"
          >
            View all Pledges
          </div>
        </div>
        <div className="flex flex-wrap w-full gap-3 items-center justify-center mt-10 md:flex-row flex-col">
          {filteredData.reverse().map((val, id) => {
            return (
              <>
                <div
                  key={id}
                  className="bg-[#D4ECD5] flex flex-col p-2 w-[85%] md:w-[25%]"
                >
                  {val.anonymous !== true ? (
                    <p className="text-[#005303] font-bold font-poppins ml-2 text-[16px]">
                      {val.first_name} {val.last_name}
                    </p>
                  ) : (
                    <p className="text-[#005303] font-bold font-poppins ml-2 text-[16px]">
                      {val.first_last_name}
                    </p>
                  )}
                  <p className="text-[#005303] font-poppins w-[90%] text-[12px] ml-2 mt-1">
                    {val.mitzvah}
                  </p>
                  <p className="text-[#005303]  font-poppins text-[13px]  ml-2 mt-1">
                    <TimeAgo time={val?.time} />
                  </p>
                </div>
              </>
            );
          })}
        </div>
        {/* New Work HERE */}
      </section>
      {/* <section className="bg-[#E9784836] pb-14 ">
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
          <button className="centered-btn">Become a Sponsor</button>
        </div>
      </section> */}
      {/* <footer className="text-left bg-[#E97848] text-white lg:text-left pt-14 md:pb-8 pb-4 pl-12 tracking-wide ">
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
                  <span className="underline text-[17px]">Mitzvahthon</span>
                </p>
                <p className="">
                  by{" "}
                  <span className="underline text-[17px]">
                    Reshape Creative
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </NewPage.Provider>
  );
};

export async function getServerSideProps() {
  let getFirstAPI = {};
  let pledgeApi = {};
  let teamApi = {};
  let isAPIFailed = false;
  try {
    const response = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/campaign?id=2"
    );

    const response1 = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/mitzvahs?id=2"
    );

    const response2 = await axios.get(
      "https://api.reshapecreative.com/mitzvahthon/teams?id=2"
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
