import { io } from "socket.io-client";
import store from "../app/store";
import { addAnComment, removeAnItem } from "../pages/video/videoSlice";
import { NotificationManager } from "react-notifications";
let socket;
export const initiateSocketConnection = (authState, videoId) => {
  socket = io(process.env.REACT_APP_BACKEND_URL, {
    auth: {
      token: `${authState.accessToken}`,
      videoId: videoId,
    },
  });
  console.log(`Connecting socket...`);
  socket.on("connect", () => {
    console.log("client connected", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.log("Error message from serve :", err.message);
    console.log("There are some error please try again latter");
    socket.close();
  });
  socket.on("responseMessageFromServe", (msg) => {
    store.dispatch(addAnComment(msg));
  });
  socket.on("responseDeleteMessageFromServe", (msg) => {
    store.dispatch(removeAnItem(msg));
  });
  socket.on("notifySuccessForClient", (msg) => {
    NotificationManager.success(msg.msg, msg.title);
  });
  socket.on("notifyErrorForClient", (msg) => {
    NotificationManager.error(msg.msg, msg.title);
  });
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const sendMessage = (comment) => {
  if (socket) socket.emit("saveMessageToServe", comment);
};

export const deleteMessage = (comment) => {
  if (socket) socket.emit("deleteCommentToServe", comment);
};
