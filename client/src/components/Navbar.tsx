import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/userSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { accessToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  if (!accessToken) return null;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      style={{
        padding: 10,
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "10px",
      }}
    >
     
      <Link to="/profile" style={{ textDecoration: "none" ,width: 32, height: 32, }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Профіль"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
      </Link>

      
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e53935",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Вийти
      </button>
    </nav>
  );
};

export default Navbar;
