import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const url = "http://localhost:3000/api";

  const handlerequest = async () => {
    try {
      if (isLogin) {
        const response = await axios.post(`${url}/signin`, {
          email,
          password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);

        alert("Login successful!");
        navigate("/");
      } else {
        const response = await axios.post(`${url}/signup`, {
          email,
          password,
        });

        alert("Signup successful! Please login.");
        setIsLogin(true);
        setEmail("");       
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button  onClick={handlerequest}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  );
};



export default Auth;
