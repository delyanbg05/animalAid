import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import CookieConsent, { Cookies } from "react-cookie-consent";
function App() {
  return (
    <Router>
      <Header></Header>
      <div>
        <Routes></Routes>
      </div>
      <CookieConsent
        disableStyles={true}
        buttonClasses="btn btn-primary"
        buttonText="Съгласявам се"
        containerClasses="alert alert-primary fixed-bottom d-flex justify-content-between mb-0"
        contentClasses="col"
      >
        <p>Този сайт използва бисквитки.</p>
      </CookieConsent>
    </Router>
  );
}

export default App;
