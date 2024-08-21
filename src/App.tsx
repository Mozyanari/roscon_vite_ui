import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { useEffect, useState, useRef } from "react";
import ROSLIB from "roslib";

function App() {
  const [count, setCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  // const [cmdVel, setCmdVel] = useState("");
  const [x, setX] = useState("none");

  const roslibConnector = useRef(
    new ROSLIB.Ros({
      url: "ws://localhost:9090",
    })
  );
  const topicCmdVel = useRef(
    new ROSLIB.Topic({
      ros: roslibConnector.current,
      name: "/turtle1/cmd_vel",
      messageType: "geometry_msgs/msg/Twist",
    })
  );

  useEffect(() => {
    roslibConnector.current.on("connection", function () {
      console.log("Connected to ROSBridge WebSocket server.");
      setConnectionStatus("Connected");
    });

    roslibConnector.current.on("error", function (error) {
      console.log("Error connecting to ROSBridge WebSocket server: ", error);
      setConnectionStatus("Error");
    });

    roslibConnector.current.on("close", function () {
      console.log("Connection to ROSBridge WebSocket server closed.");
      setConnectionStatus("Disconnected");
    });
  }, []);

  useEffect(() => {
    topicCmdVel.current.subscribe((message: any) => {
      console.log(message.angular);
      console.log(message.angular);
      setX(message.linear.x);
    });
  }, [topicCmdVel]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>ROS Connection Status: {connectionStatus}</p>
      <p>cmd_vel: {x}</p>
    </>
  );
}

export default App;
