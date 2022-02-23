import React from "react";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import ChatWidget from "./ChatWidget";

export default {
  title: "ChatWidget",
  component: ChatWidget,
  decorators: [
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const USER_1 = {
  id: 1,
  userName: "User 1",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
};

const USER_2 = {
  id: 2,
  userName: "User 2",
  avatarUrl: "https://i.pravatar.cc/150?img=2",
};

const USER_3 = {
  id: 3,
  userName: "User 3",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
};

const FIRST_MSG = {
  ts: new Date("2022-01-01 12:00:00").getTime(),
  msg:
    "<h2>Hello world !</h2><p>Lorem Ipsum is simply dummy text of <button>CLICK ME</button> the printing and typesetting industry. Ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also </p>",
};

export const ChatRooms = () => {
  const openChatWidget = () => {
    const props = {
      scope: "EMAILING",
      roomId: "user-1_user-2",
      showRooms: true,
      firstMsg: {
        from: USER_2,
        ...FIRST_MSG,
      },
      currentUser: USER_1,
      users: [USER_1, USER_2],
    };
    window.postMessage({ type: "SHOW_CHAT_WIDGET", props }, "*");
  };
  return <ChatWidget onLoad={openChatWidget} env={"dev"} />;
};

export const GroupChat = () => {
  const openChatWidget = () => {
    const props = {
      scope: "EVENT",
      roomId: "user-1_partner_1",
      roomName: "Lorem Ipsum is simply dummy Ipsum is simply dummy",
      showRooms: true,
      firstMsg: {
        from: USER_2,
        ...FIRST_MSG,
      },
      currentUser: USER_1,
      users: [USER_1, USER_2, USER_3],
    };
    window.postMessage({ type: "SHOW_CHAT_WIDGET", props }, "*");
  };
  return <ChatWidget onLoad={openChatWidget} env={"dev"} />;
};

export const PublicChat = () => {
  const openChatWidget = () => {
    const props = {
      scope: "EVENT",
      roomId: "event-123",
      roomName: "Lorem Ipsum is simply dummy Ipsum",
      showRooms: false,
      currentUser: USER_1,
      users: [USER_1],
    };
    window.postMessage({ type: "SHOW_CHAT_WIDGET", props }, "*");
  };
  return <ChatWidget onLoad={openChatWidget} env={"dev"} />;
};
