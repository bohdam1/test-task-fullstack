import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import AdDetails from "./components/AdDetails";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ads/:id"
          element={
            <ProtectedRoute>
              <AdDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
