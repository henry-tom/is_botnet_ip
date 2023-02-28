import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import { Counter } from "./pages/counter/Counter";
import { Hooktest } from "./pages/hooklab/Hooktest";
import { VideoIndex } from "./pages/video/VideoIndex";
import { VideoShow } from "./pages/video/VideoShow";
import { VideoCreate } from "./pages/video/VideoCreate";
import { VideoEdit } from "./pages/video/VideoEdit";
import { AdminVideoEdit } from "./pages/video/AdminVideoEdit";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { TrackIpIndex } from "./pages/trackip/TrackIpIndex";
import { selectIsLogin, selectRole } from "./pages/auth/authSlice";

function App() {
  const isLogin = useSelector(selectIsLogin);
  const role = useSelector(selectRole);
  return (
    <Routes>
      <Route path="/" element={<VideoIndex />} />
      <Route path="/redux" element={<Counter />} />
      <Route path="/hook-test" element={<Hooktest />} />
      <Route path="/videos/:videoId" element={<VideoShow />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/ips" element={<TrackIpIndex />} />
      <Route
        path="/video-create"
        element={isLogin ? <VideoCreate /> : <Navigate to="/login" />}
      ></Route>
      <Route
        path="/video-edit"
        element={isLogin ? <VideoEdit /> : <Navigate to="/login" />}
      ></Route>
      <Route
        path="/admin-video"
        element={
          isLogin && role === "ADMIN" ? <AdminVideoEdit /> : <Navigate to="/login" />
        }
      ></Route>
    </Routes>
  );
}

export default App;
