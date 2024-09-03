import "./App.css";

import { useEffect, useState, useRef } from "react";
import ROSLIB from "roslib";

import { Box, Paper, Typography, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import RedoIcon from "@mui/icons-material/Redo";

function App() {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const roslibConnector = useRef<ROSLIB.Ros | null>(null);
  const topicCmdVel = useRef<ROSLIB.Topic | null>(null);
  const topicPose = useRef<ROSLIB.Topic | null>(null);
  // カメの位置
  const [ROSX, setROSX] = useState(0);
  const [ROSY, setROSY] = useState(0);
  const [ROSTheta, setROSTheta] = useState(0);

  const max = 11.09;
  const max_qua = 3.14;
  const [UIX, setUIX] = useState(50);
  const [UIY, setUIY] = useState(50);
  const [UITheta, setUITheta] = useState(50);

  // const roslibConnector = useRef(
  //   new ROSLIB.Ros({
  //     url: "ws://localhost:9090",
  //   })
  // );
  // const topicCmdVel = useRef(
  //   new ROSLIB.Topic({
  //     ros: roslibConnector.current,
  //     name: "/turtle1/cmd_vel",
  //     messageType: "geometry_msgs/msg/Twist",
  //   })
  // );

  // const topicPose = useRef(
  //   new ROSLIB.Topic({
  //     ros: roslibConnector.current,
  //     name: "/turtle1/pose",
  //     messageType: "turtlesim/msg/Pose",
  //   })
  // );

  useEffect(() => {
    console.log("tes");
    if (!roslibConnector.current) {
      roslibConnector.current = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });

      roslibConnector.current.on("connection", function () {
        console.log("Connected to ROSBridge WebSocket server.");
        setConnectionStatus("Connected");
        initializeTopics();
      });

      roslibConnector.current.on("error", function (error) {
        console.log("Error connecting to ROSBridge WebSocket server: ", error);
        setConnectionStatus("Error");
      });

      roslibConnector.current.on("close", function () {
        console.log("Connection to ROSBridge WebSocket server closed.");
        setConnectionStatus("Disconnected");
      });
    }

    return () => {
      if (roslibConnector.current) {
        roslibConnector.current.close();
      }
    };
  }, []);

  const initializeTopics = () => {
    if (roslibConnector.current) {
      topicCmdVel.current = new ROSLIB.Topic({
        ros: roslibConnector.current,
        name: "/turtle1/cmd_vel",
        messageType: "geometry_msgs/msg/Twist",
      });

      topicPose.current = new ROSLIB.Topic({
        ros: roslibConnector.current,
        name: "/turtle1/pose",
        messageType: "turtlesim/msg/Pose",
      });

      topicCmdVel.current.subscribe((message: any) => {
        console.log(message.angular);
      });

      topicPose.current.subscribe((message: any) => {
        setROSX(message.x);
        setROSY(message.y);
        setROSTheta(message.theta);
        setUIX((message.x / max) * 100);
        setUIY((message.y / max) * 100);
        setUITheta(-(message.theta / max_qua) * 180.0 + 90);
        console.log(message);
      });
    }
  };

  // const debugFunction = () => {
  //   console.log("Debug information:", UITheta);
  // };

  const sendCommand = (linear: number, angular: number) => {
    const twist = new ROSLIB.Message({
      linear: { x: linear, y: 0, z: 0 },
      angular: { x: 0, y: 0, z: angular },
    });
    if (topicCmdVel.current) {
      topicCmdVel.current.publish(twist);
    } else {
      console.error("topicCmdVel is not initialized");
    }

    console.log("Sent command:", { linear, angular });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#D9D9D9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        {/* Bar */}
        <Box display="flex" flexDirection="row">
          <Typography fontSize="40px">Turtlesim Node UI</Typography>
        </Box>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="right"
          gap="8px"
        >
          <Typography>How to use</Typography>
          <HelpIcon></HelpIcon>
        </Box>

        <Box
          sx={{
            height: "80%",
            width: "80%",
            backgroundColor: "white",
            borderRadius: "80px",
            padding: "40px",
            gap: "40px",
          }}
          display="flex"
          flexDirection="column"
        >
          {/* 接続状況 */}
          <Typography
            sx={{ backgroundColor: "red", color: "white", borderRadius: "8px" }}
          >
            {connectionStatus}
          </Typography>

          <Box display="flex" flexDirection="row">
            {/* カメの位置 */}
            <Box>
              <Paper
                elevation={3}
                sx={{
                  width: "300px",
                  height: "300px",
                  position: "relative",
                  bgcolor: "#2196f3",
                  mb: 2,
                }}
              >
                <HelpIcon
                  sx={{
                    position: "absolute",
                    left: `${UIX}%`,
                    top: `${100 - UIY}%`,
                    transform: `translate(-50%, -50%) rotate(${UITheta}deg)`,
                    color: "white",
                  }}
                  // size={32}
                />
                {/* {x}
                {y} */}
              </Paper>
            </Box>

            {/* 右側 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // gap: "16px",
                // padding: "16px",
              }}
            >
              {/* カメの数値位置 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>x</Typography>
                  {ROSX.toFixed(2)}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>y</Typography>
                  {ROSY.toFixed(2)}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>θ</Typography>
                  {ROSTheta.toFixed(2)}
                </Box>
              </Box>

              {/* 操作ボタン */}
              <Box>
                <IconButton onClick={() => sendCommand(1, 0)}>
                  <NorthIcon />
                </IconButton>
                <Box>
                  <IconButton
                    sx={{ transform: "rotate(-90deg) " }}
                    onClick={() => sendCommand(0, -1)}
                  >
                    <RedoIcon></RedoIcon>
                  </IconButton>
                  <IconButton
                    sx={{ transform: "rotate(-90deg) scaleY(-1)" }}
                    onClick={() => sendCommand(0, 1)}
                  >
                    <RedoIcon></RedoIcon>
                  </IconButton>
                </Box>
                <IconButton onClick={() => sendCommand(-1, 0)}>
                  <SouthIcon></SouthIcon>
                </IconButton>
              </Box>
              {/* <Button onClick={debugFunction}>test</Button> */}
            </Box>
            {/*  */}
          </Box>
        </Box>
      </Box>
      {/* <p>ROS Connection Status: {connectionStatus}</p>
      <p>cmd_vel: {x}</p>

      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "400px",
            height: "400px",
            position: "relative",
            bgcolor: "#2196f3",
            mb: 2,
          }}
        >
          <Turtle
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              color: "green",
            }}
            size={32}
          />
          {x}
          {y}
        </Paper>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="X position (%)"
            type="number"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            sx={{ width: "120px" }}
          />
          <TextField
            label="Y position (%)"
            type="number"
            value={inputY}
            onChange={(e) => setInputY(e.target.value)}
            sx={{ width: "120px" }}
          />
          <Button variant="contained" onClick={handleMove}>
            Move
          </Button>
        </Box>
      </Box> */}
    </>
  );
}

export default App;
