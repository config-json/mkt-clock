import { useState, useEffect } from "react";

import marketDataJSON from "./markets.json";
import bell from "./bell.mp3";

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

  //Timezone hours and minutes (displayed to the user)
  const timezoneHours = userTime.getHours() - userTime.getUTCHours();
  const timezoneMinutes = Math.abs(
    userTime.getMinutes() - userTime.getUTCMinutes()
  );

  //Format the displayed timezone
  const formattedTimezone = () => {
    if (timezone > 0 && timezoneMinutes !== 0) {
      return `+${timezoneHours}:${timezoneMinutes}`;
    }

    if (timezone > 0 && timezoneMinutes === 0) {
      return `+${timezoneHours}`;
    }

    if (timezone < 0 && timezoneMinutes !== 0) {
      return `${timezoneHours}:${timezoneMinutes}`;
    }

    return timezoneHours;
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

  //Format colors (that indicate market status)
  const marketStatus = () => {};

  //Play bell at NY open, once
  const [hasPlayedBell, setHasPlayedBell] = useState(false);

  useEffect(() => {
    if (!hasPlayedBell && decimalTime === 13.5 + timezone) {
      new Audio(bell).play();
      setHasPlayedBell(true);
    }

    if (decimalTime !== 13.5) {
      setHasPlayedBell(false);
    }
  });

  console.log(decimalTime);

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-between px-9 pt-6 items-center">
        <div className="flex gap-3">
          <img src="logo.png" width={32} height={30} alt="logo" />
          <h1 className="text-2xl hidden sm:block">MktClock</h1>
        </div>
        <div className="flex gap-9">
          <button>About</button>
          <a href="https://github.com/config-json/mkt-clock" target="_blank">
            GitHub
          </a>
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
                        decimalTime < convertTime(item.marketOpen)
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
