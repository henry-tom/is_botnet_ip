/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Pagination from "@mui/material/Pagination";
import { NotificationManager } from "react-notifications";
import TextField from "@mui/material/TextField";

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

const validateDates = (dateFrom, dateTo) => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
        NotificationManager.error(
            "The start date must be before the end date.",
            "Date Validation"
        );
        return false;
    }
    return true;
};

export function TrackIpIndex() {
    var parser = new UAParser();
    let resultDevice = parser.getResult();
    const browser = detect();
    const [ips, setIps] = useState([]);
    const [ip, setIp] = useState("");
    const [os, setOs] = useState("");
    const [browserName, setBrowser] = useState("");
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [count, setCount] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [ipValue, setIpValue] = useState(null);
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
        create();
    }, []);

    useEffect(() => {
        fetchIps();
    }, [page]);

    async function fetchIps() {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/ips/all-pagination`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: page,
                    ipValue: ipValue,
                    pageSize: pageSize,
                    dateFrom: dateFrom?.toString() ? new Date(dateFrom) : null,
                    dateTo: dateTo?.toString() ? new Date(dateTo) : null,
                }),
            }
        );

        const { ips: json, count: countRes } = await response.json();
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
        setTotalRows(countRes);
        setCount(Math.floor(countRes / pageSize + 1));
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

    async function onSearch() {
        if (validateDates(dateFrom, dateTo)) {
            setPage(1);
            fetchIps();
        }
    }

    function keyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            onSearch()
        }
    }

    return (
        <div className="container mx-auto">
            <img
                style={{ display: "inline-block" }}
                src='/android-chrome-512x512.png'
                alt='null'
                width='3%'
                height='auto'
            ></img>
            <div style={{ color: "red", fontSize: "30px" }}>Your IP: {ip}</div>
            <div>OS: {os}</div>
            <div>Browser: {browserName}</div>
            <span style={{ color: "blue" }}>HISTORY IP ACCESS THIS SERVER</span>
            <div className="ml-2" style={{ marginTop: "12px" }}>
                <span className="ml-2">
                    <TextField
                        id="outlined-basic"
                        label="IP value"
                        variant="outlined"
                        value={ipValue}
                        onChange={(event) => setIpValue(event.target.value)}
                        onKeyDown={(event) => keyDown(event)}
                        inputProps={{ style: { height: "8px" } }}
                        size="normal"
                    />
                </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <label className="ml-2" htmlFor="dateFrom">From:</label>
                    <span className="ml-2">
                        <DatePicker
                            id="dateFrom"
                            value={dateFrom}
                            variant="outlined"
                            onChange={(newValue) => setDateFrom(newValue)}
                            onKeyDown={(event) => keyDown(event)}
                            sx={{ "& .MuiInputBase-input": { height: "8px" } }}
                        />
                    </span>
                    <label className="ml-2" htmlFor="dateTo">To:</label>
                    <span className="ml-2">
                        <DatePicker
                            id="dateTo"
                            value={dateTo}
                            onKeyDown={(event) => keyDown(event)}
                            variant="outlined"
                            onChange={(newValue) => setDateTo(newValue)}
                            sx={{
                                "& .MuiInputBase-input": { height: "8px", marginLeft: "2px" },
                            }}
                        />
                    </span>
                </LocalizationProvider>
                <button
                    onClick={() => {
                        setDateFrom(null);
                        setDateTo(null);
                        setIpValue("");
                    }}
                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    <i className="fas fa-times-circle"></i> Clear
                </button>
                <button
                    onClick={onSearch}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    <i className="fas fa-search"></i> Search
                </button>
            </div>
            <div style={{ marginTop: "12px" }}>
                <TableContainer
                    component={Paper}
                    sx={{ width: "100%", overflowX: "auto" }}
                >
                    <Table size="small" aria-label="a dense table">
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
            <div style={{ marginTop: "12px" }}>
                <Pagination
                    count={count}
                    variant="outlined"
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    pageSize={pageSize}
                    onPageSizeChange={(event) => setPageSize(event.target.value)}
                />
            </div>
            <div style={{ marginTop: "12px" }}>Total Rows: {totalRows}</div>
        </div>
    );
}
