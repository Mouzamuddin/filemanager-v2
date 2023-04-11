import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

import { GoogleOAuthProvider } from "@react-oauth/google";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <GoogleOAuthProvider clientId="426135309410-n5nro7nt328qpaul4oiansfu441ckcl8.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
