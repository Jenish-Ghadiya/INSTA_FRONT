import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <button onClick={() => navigate("/login")}>login</button>
            </div>
        </>
    );
}
