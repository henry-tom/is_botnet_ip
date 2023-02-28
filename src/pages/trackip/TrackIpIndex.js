/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const { detect } = require("detect-browser");
const { UAParser } = require("ua-parser-js");
var mobile = require("is-mobile");
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function TrackIpIndex() {
  var parser = new UAParser();
  let resultDevice = parser.getResult();
  const browser = detect();
  const [ips, setIps] = useState([]);
  const [ip, setIp] = useState("");
  const [os, setOs] = useState("");
  const [browserName, setBrowser] = useState("");
  const { height, width } = useWindowDimensions();
  function createData(
    ID,
    Operation,
    Browser,
    TypeDevice,
    IPValue,
    City,
    Region,
    Country,
    ISP,
    Width,
    Height,
    UnderTunnel,
    Time
  ) {
    return {
      ID,
      Operation,
      Browser,
      TypeDevice,
      IPValue,
      City,
      Region,
      Country,
      ISP,
      Width,
      Height,
      UnderTunnel,
      Time,
    };
  }
  useEffect(() => {
    async function fetchIps() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ips/all-backdoor`
      );
      const json = await response.json();
      console.log("Response info is: ", json);
      let tmp_rows = [];
      await json.map((item, index) => {
        tmp_rows.push(
          createData(
            index,
            item.osName,
            item.browserName,
            JSON.stringify(item.mobileInfo),
            item.ipValue,
            item.city,
            item.region,
            item.country,
            item.isp,
            item.width,
            item.height,
            item.underTunnel,
            item.createdAt
          )
        );
        return item;
      });
      setIps(tmp_rows);
    }
    async function mobileInfo() {
      return mobile() === true
        ? resultDevice.device
        : { typeDevice: "Transistor computer" };
    }
    async function create() {
      if (browser) {
        let deviceInfo = await mobileInfo();
        setBrowser(browser.name);
        setOs(browser.os);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/ips/get-detail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nameOs: browser.os,
              nameBrowser: browser.name,
              screenWidth: width,
              screenHeight: height,
              mobileInfo: deviceInfo,
            }),
          }
        );
        const tmp = await response.json();
        await setIp(tmp);
      }
    }
    fetchIps();
    create();
  }, []);

  return (
    <div className="container mx-auto">
      <div style={{ color: "red", fontSize: "30px" }}>Your IP: {ip}</div>
      <div>OS: {os}</div>
      <div>Browser: {browserName}</div>
      <span style={{ color: "blue" }}>HISTORY IP ACCESS THIS SERVER</span>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Browser</TableCell>
              <TableCell>Type device</TableCell>
              <TableCell>IP Value</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>ISP</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Under tunnel</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ips.map((row) => (
              <TableRow
                key={row.ID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.ID}
                </TableCell>
                <TableCell>{row.Browser}</TableCell>
                <TableCell>{row.Operation}</TableCell>
                <TableCell>{row.IPValue}</TableCell>
                <TableCell>{row.TypeDevice}</TableCell>
                <TableCell>{row.City}</TableCell>
                <TableCell>{row.Region}</TableCell>
                <TableCell>{row.Country}</TableCell>
                <TableCell>{row.ISP}</TableCell>
                <TableCell>{row.Width}</TableCell>
                <TableCell>{row.Height}</TableCell>
                <TableCell>{row.UnderTunnel}</TableCell>
                <TableCell>{row.Time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
