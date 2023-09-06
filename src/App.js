import { useState, useEffect } from "react";

function App() {
  //User time
  const [userTime, setUserTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setUserTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timezone = userTime.getHours() - userTime.getUTCHours();

  const newYork = "9:30";

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
              <p className="text-sm">(UTC+{timezone})</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">16:30</h2>
            <h3 className="text-xl">NYSE</h3>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">10:30</h2>
            <h3 className="text-xl">LSE</h3>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl">03:00</h2>
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
