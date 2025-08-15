import './styles/styles.scss';
import HomePage from "./page/home/HomePage";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React from "react";
import Login from "./page/login/login";
import {Routers} from "./utils/Constants";
import VerifyAccount from "./page/verify_account/VerifyAccount";
import Bot from "./components/bot/Bot";
import Knowledge from "./components/knowledge/Knowledge";
import Files from "./components/files/Files";
import FileDetail from "./components/file_detail/FileDetail";
import ChatPage from "./page/chat/ChatPage";
import {useDispatch, useSelector} from "react-redux";
import ChatWindow from "./components/chat_window/ChatWindow";
import HomeWelcome from "./components/HomeWelcome/HomeWelcome";
import MyInfo from "./components/my_info/MyInfo";
import ForgotPassword from "./page/forgot_password/ForgotPassword";
import VerifyForgotPassword from "./page/verify_forgot_password/VerifyForgotPassword";
import ChangePassword from "./page/change_password/ChangePassword";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.userReducer.accessToken);
  const router = createBrowserRouter(
      [
        {
          path: "/login",
          element: <Login/>,
        },
        {
          path: Routers.VerifyAccount,
          element: <VerifyAccount/>,
        },
          {
              path: Routers.VerifyForgotPass,
              element: <VerifyForgotPassword/>,
          },
          {
              path: Routers.ForgotPass,
              element: <ForgotPassword/>,
          },
          {
              path: Routers.ChangePassword,
              element: <ChangePassword/>,
          },
        {
          path: "/",
          element: <HomePage/>,
          children: [
              {
                  path: "",
                  element: <HomeWelcome/>,
              },
            {
              path: "/bots",
              element: <Bot/>,
            },
            {
              path: "knowledge",
              element: <Knowledge/>,
            },
              {
                  path: "myInfo",
                  element: <MyInfo/>,
              },
            {
              path: "/knowledge/:knowledgeId/files",
              element: <Files/>,
            },
            {
              path: "/knowledge/:knowledgeId/files/:fileId",
              element: <FileDetail/>,
            },
          ],
        },
        {
          path: "/bots/:botId",
          element: <ChatPage/>,
            children:[
                {
                    path: "chat/:chatId",
                    element: <ChatWindow/>,
                },
            ]
        },
      ]
  );
  return (
    // <><HomePage/></>
      <RouterProvider router={router}/>
  );
}

export default App;
