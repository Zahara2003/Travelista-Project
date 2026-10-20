import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Homepage from "./pages/Homepage";
import Explore from "./pages/Explore";
import PlaceDetails from "./pages/PlaceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateItinerary from "./pages/CreateItinerary";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";
import InteractiveMap from "./pages/InteractiveMap"; // புதிதாக சேர்த்தது

const App = () => {
  const [language, setLanguage] = useState("en");

  return (
    <BrowserRouter>
      <div className="app">
        <Header
          language={language}
          setLanguage={setLanguage}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                language={language}
              />
            }
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/interactive-map"
            element={<InteractiveMap />}
          />

          <Route
            path="/place/:id"
            element={<PlaceDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/plan"
            element={<CreateItinerary />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

         

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;