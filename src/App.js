import { useState, useEffect } from "react";

function App() {
  //User time
  const [userTime, setUserTime] = useState(new Date());

  //Update user time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setUserTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //Timezone and convertTime
  const timezone =
    userTime.getHours() -
    userTime.getUTCHours() +
    (userTime.getMinutes() - userTime.getUTCMinutes()) / 60;

  const timezoneHours = userTime.getHours() - userTime.getUTCHours();
  const timezoneMinutes = userTime.getMinutes() - userTime.getUTCMinutes();

  const convertTime = (time) => {
    //Get minutes (if any) and add them up
    const timeMinutes = (time % 1) * 60;
    const timezoneMinutes = (timezone % 1) * 60;
    let totalMinutes = timeMinutes + timezoneMinutes;
    let extraHours = 0;

    //If totalMinutes added is 60 make a new hour
    if (totalMinutes >= 60) {
      totalMinutes = totalMinutes % 60;
      extraHours = Math.floor(totalMinutes / 60);
    }

    const formattedMinutes =
      totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;

    //Return HH:MM time
    return `${
      Math.floor(time) + Math.floor(timezone) + extraHours
    }:${formattedMinutes}`;
  };

  //Times in UTC for easier conversion
  const newYorkOpen = 13.5;
  const londonOpen = 7;
  const tokyoOpen = 0;

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-between px-9 pt-6 items-center">
        <div className="flex gap-3">
          <img src="logo.png" width={32} height={30} alt="logo" />
          <h1 className="text-2xl hidden sm:block">MktClock</h1>
        </div>
        <div className="flex gap-9">
          <p>About</p>
          <p>GitHub</p>
        </div>
      </div>

      <div className="w-full h-full px-9 flex flex-col gap-16 items-center justify-center">
        <div className="flex flex-wrap gap-16 items-center">
          <div className="flex flex-col items-center">
            <h2 className="text-7xl">
              {userTime.getHours()}:
              {userTime.getMinutes() < 10
                ? `0${userTime.getMinutes()}`
                : userTime.getMinutes()}
            </h2>
            <div className="flex gap-3 items-center">
              <h3 className="text-xl">Current Time</h3>
              <p className="text-sm">
                (UTC
                {timezone === 0
                  ? ""
                  : timezone > 0 && timezoneMinutes > 0
                  ? `+${timezoneHours}:${timezoneMinutes}`
                  : timezone > 0 && timezoneMinutes === 0
                  ? `+${timezoneHours}`
                  : timezone < 0 && timezoneMinutes > 0
                  ? `${timezoneHours}:${timezoneMinutes}`
                  : timezoneHours}
                )
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">{convertTime(newYorkOpen)}</h2>
            <h3 className="text-xl">NYSE</h3>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">{convertTime(londonOpen)}</h2>
            <h3 className="text-xl">LSE</h3>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">{convertTime(tokyoOpen)}</h2>
            <h3 className="text-xl">JSX</h3>
          </div>
        </div>

        <div className="flex gap-9">
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
