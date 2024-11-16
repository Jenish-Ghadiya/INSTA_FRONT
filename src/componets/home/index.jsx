import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Menu from "../../common/menu";
import "./home.scss";

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="home-container">
                <div>
                    <div className="menu">
                        <Menu />
                    </div>
                </div>
                <div className="content-container">
                    <button onClick={() => navigate("/login")}>login</button>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
