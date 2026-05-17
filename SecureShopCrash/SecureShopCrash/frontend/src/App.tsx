import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "./routes/index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "./stores/authSlice";
import ChatWidget from "./components/chat/ChatWidget";
import { GlobalComboPopup } from './components/GlobalComboPopup';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth() as any);
  }, [dispatch]);

  return (
    <Theme appearance="light" radius="large" scaling="100%" accentColor="crimson" grayColor="mauve">
      <RouterProvider 
        router={router} 
        future={{
          v7_startTransition: true,
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <ChatWidget />
      <GlobalComboPopup />
    </Theme>
  );
}
