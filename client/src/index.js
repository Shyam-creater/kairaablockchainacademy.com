import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App";

import { PremiumToaster } from "./components/ui/PremiumToaster";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import { useLoadUserQuery } from "./redux/features/api/apiSlice";
import Loader from "../src/components/Loader/Loader.js"




 export const Custom=({children})=>{
  const {isLoading}=useLoadUserQuery({});
  return(
    <>
    {isLoading ?<Loader/>: <>{children}</>}
    </>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
   <GoogleOAuthProvider clientId="98843656318-na25g5igjo47ii7i8t8bs0a74gsabnah.apps.googleusercontent.com">
     <App/>
     <PremiumToaster />
   </GoogleOAuthProvider>
  </Provider>
);

