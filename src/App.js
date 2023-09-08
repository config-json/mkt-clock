import { useState, useEffect } from "react";
import marketDataJSON from "./markets.json";

function App() {
  //User time
  const [userTime, setUserTime] = useState(new Date());
  let decimalTime = userTime.getHours() + userTime.getMinutes() / 60;
  let dayOfWeek = userTime.getUTCDay();

  //Update user time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setUserTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //Timezone in decimals (UTC +5:30 becomes 5,5)
  const timezone =
    userTime.getHours() -
    userTime.getUTCHours() +
    (userTime.getMinutes() - userTime.getUTCMinutes()) / 60;

  var timezoneHours = userTime.getHours() - userTime.getUTCHours();
  const timezoneMinutes = Math.abs(
    userTime.getMinutes() - userTime.getUTCMinutes()
  );

  //Format the displayed timezone
  const formattedTimezone = () => {
    if (timezone > 12 && userTime.getUTCHours() < userTime.getHours()) {
      timezoneHours = userTime.getHours() - 24 - userTime.getUTCHours();
    }

    if (timezone > 12 && userTime.getUTCHours() > userTime.getHours()) {
      timezoneHours = userTime.getHours() + 24 - userTime.getUTCHours();
    }

    if (timezoneHours > 0 && timezoneMinutes !== 0) {
      return `+${timezoneHours}:${timezoneMinutes}`;
    }

    if (timezoneHours > 0 && timezoneMinutes === 0) {
      return `+${timezoneHours}`;
    }

    if (timezoneHours < 0 && timezoneMinutes !== 0) {
      return `${timezoneHours}:${timezoneMinutes}`;
    }

    if (timezoneHours < 0 && timezoneMinutes === 0) {
      return timezoneHours;
    }
  };

  const convertTime = (time) => {
    //Needs UTC decimal times to work
    return time + timezone;
  };

  const displayConvertedTime = (time) => {
    //Get minutes (if any) and add them up
    const timeMinutes = (time % 1) * 60;

    let totalMinutes = timeMinutes + timezoneMinutes;
    let extraHours = 0;

    //If totalMinutes added is 60 make a new hour
    if (totalMinutes >= 60) {
      totalMinutes = totalMinutes % 60;
      extraHours = Math.floor(totalMinutes / 60);
    }

    let hours = Math.floor(time) + Math.floor(timezone);

    if (hours < 0) {
      hours = hours + 24;
    }

    if (hours >= 24) {
      hours = hours - 24;
    }

    const formattedMinutes =
      totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;

    //Return HH:MM time
    return `${hours + extraHours}:${formattedMinutes}`;
  };

  //Times in UTC for easier conversion
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    try {
      const parsedMarketData = marketDataJSON;
      setMarketData(parsedMarketData);
    } catch (error) {
      console.log("Error parsing market data: ", error);
    }
  }, []);

  //Play bell at NY open, once
  const [hasPlayedBell, setHasPlayedBell] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    if (!hasPlayedBell && isSoundEnabled && decimalTime === 13.5 + timezone) {
      new Audio("bell.mp3").play();
      setHasPlayedBell(true);
    }

    if (decimalTime !== 13.5) {
      setHasPlayedBell(false);
    }
  });

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-between px-9 pt-6 items-center">
        <div className="flex gap-3">
          <img src="logo.png" width={32} height={30} alt="logo" />
          <h1 className="text-2xl hidden sm:block">MktClock</h1>
        </div>
        <div className="flex gap-9 items-center">
          <div className="flex gap-6">
            <a href="https://twitter.com/mktsuite" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7.55016 21.75C16.6045 21.75 21.5583 14.2468 21.5583 7.74192C21.5583 7.53098 21.5536 7.31536 21.5442 7.10442C22.5079 6.40752 23.3395 5.54432 24 4.55536C23.1025 4.95466 22.1496 5.21544 21.1739 5.3288C22.2013 4.71297 22.9705 3.74553 23.3391 2.60583C22.3726 3.17862 21.3156 3.58267 20.2134 3.80067C19.4708 3.01162 18.489 2.48918 17.4197 2.31411C16.3504 2.13905 15.2532 2.32111 14.2977 2.83216C13.3423 3.3432 12.5818 4.15477 12.1338 5.14137C11.6859 6.12798 11.5754 7.23468 11.8195 8.29036C9.86249 8.19215 7.94794 7.68377 6.19998 6.79816C4.45203 5.91255 2.90969 4.6695 1.67297 3.14958C1.0444 4.2333 0.852057 5.51571 1.13503 6.73615C1.418 7.9566 2.15506 9.02351 3.19641 9.72005C2.41463 9.69523 1.64998 9.48474 0.965625 9.10598V9.16692C0.964925 10.3042 1.3581 11.4066 2.07831 12.2868C2.79852 13.167 3.80132 13.7706 4.91625 13.995C4.19206 14.1932 3.43198 14.2221 2.69484 14.0794C3.00945 15.0575 3.62157 15.913 4.44577 16.5264C5.26997 17.1398 6.26512 17.4807 7.29234 17.5013C5.54842 18.8712 3.39417 19.6142 1.17656 19.6107C0.783287 19.6101 0.390399 19.586 0 19.5385C2.25286 20.9838 4.87353 21.7514 7.55016 21.75Z"
                  fill="white"
                />
              </svg>
            </a>
            <a href="https://github.com/config-json/mkt-clock" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g clipPath="url(#clip0_762_9)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.9642 0.244873C5.34833 0.244873 0 5.63263 0 12.298C0 17.626 3.42686 22.1361 8.18082 23.7323C8.77518 23.8523 8.9929 23.473 8.9929 23.1539C8.9929 22.8744 8.97331 21.9166 8.97331 20.9187C5.64514 21.6372 4.95208 19.4819 4.95208 19.4819C4.41722 18.085 3.62473 17.7259 3.62473 17.7259C2.53543 16.9876 3.70408 16.9876 3.70408 16.9876C4.91241 17.0674 5.54645 18.2248 5.54645 18.2248C6.61592 20.0605 8.33927 19.5419 9.03257 19.2225C9.13151 18.4442 9.44865 17.9054 9.78539 17.6062C7.13094 17.3268 4.33812 16.2891 4.33812 11.6593C4.33812 10.3423 4.81322 9.26471 5.56604 8.42667C5.44727 8.1274 5.03118 6.88993 5.68506 5.23369C5.68506 5.23369 6.69527 4.91434 8.97306 6.47091C9.94827 6.20708 10.954 6.07286 11.9642 6.07173C12.9744 6.07173 14.0042 6.21157 14.9552 6.47091C17.2332 4.91434 18.2434 5.23369 18.2434 5.23369C18.8973 6.88993 18.481 8.1274 18.3622 8.42667C19.1349 9.26471 19.5904 10.3423 19.5904 11.6593C19.5904 16.2891 16.7976 17.3067 14.1233 17.6062C14.5592 17.9853 14.9353 18.7036 14.9353 19.8411C14.9353 21.4574 14.9158 22.7547 14.9158 23.1536C14.9158 23.473 15.1337 23.8523 15.7278 23.7325C20.4818 22.1358 23.9087 17.626 23.9087 12.298C23.9282 5.63263 18.5603 0.244873 11.9642 0.244873Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_762_9">
                    <rect
                      width="24"
                      height="23.5102"
                      fill="white"
                      transform="translate(0 0.244873)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`w-32 py-2 border-2 border-white rounded-md transition duration-500 hover:bg-white hover:text-black ${
              isSoundEnabled && "bg-white text-black"
            }`}
          >
            {isSoundEnabled ? "Disable bell" : "Enable bell"}
          </button>
        </div>
      </div>

      <div className="w-full h-fit sm:h-full px-16 py-16 lg:py-0 flex flex-col gap-16 items-center justify-center">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex flex-col items-center">
            <h2 className="text-7xl">
              {userTime.getHours()}:
              {userTime.getMinutes() < 10
                ? `0${userTime.getMinutes()}`
                : userTime.getMinutes()}
            </h2>
            <div className="flex gap-3 items-center">
              <h3 className="text-xl">Current Time</h3>
              <p className="text-sm">(UTC {formattedTimezone()})</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-16">
            {marketData.map((item) => {
              return (
                <div
                  key={item.market}
                  className={`flex flex-col items-center ${
                    dayOfWeek === 6 || dayOfWeek === 0
                      ? "text-grey"
                      : decimalTime >= convertTime(item.preMarket) &&
                        decimalTime < convertTime(item.preMarketClose)
                      ? "text-yellow"
                      : decimalTime >= convertTime(item.marketOpen) &&
                        decimalTime < convertTime(item.marketClose)
                      ? "text-green"
                      : decimalTime >= convertTime(item.secondMarketOpen) &&
                        decimalTime < convertTime(item.secondMarketClose)
                      ? "text-green"
                      : decimalTime >= convertTime(item.marketClose) &&
                        decimalTime < convertTime(item.postMarketClose)
                      ? "text-blue"
                      : "text-grey"
                  }`}
                >
                  <h2 className="text-5xl">
                    {displayConvertedTime(item.marketOpen)}
                  </h2>
                  <h3 className="text-xl">{item.market}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* NYSE Market Open Bell */}
        {decimalTime === 13.3 + timezone && (
          <audio src={""} autoplay auto="true" />
        )}

        <div className="flex flex-wrap gap-9 w-full justify-center">
          <div className="flex gap-3">
            <div className="h-6 w-6 bg-grey" />
            <p>Market Closed</p>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 bg-yellow" />
            <p>Pre-market</p>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 bg-green" />
            <p>Market Open</p>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 bg-blue" />
            <p>Post-market</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
