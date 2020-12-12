import axios from "axios";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [emailError, setEmailError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const validate = () => {
    var re = /^(([^<>()\\[\]\\.,;:\s@”]+(\.[^<>()\\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let emailcheck = re.test(email);
    let email_error = !emailcheck;

    setEmailError(email_error);

    if (email_error) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate()) {
      const payload = {
        email: email,
        password: password,
      };

      axios
        .post("https://auth-service-lb6yim52dq-uk.a.run.app/login", payload, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log("Login response", response);

          console.log("Login successful");
          setLoginError(false);
          localStorage.setItem("user", response.data["token"]);
          history.push("/home");
        })
        .catch((error) => {
          console.log("Login error", error);
          setLoginError(true);
        });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3 className="header">Login</h3>
        {loginError && <p>Invalid credentials, please try again!</p>}
        <div className="form-group">
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            className="form-control"
          />
          {emailError && <p>Enter a valid email.</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="password"
            className="form-control"
          />
        </div>
        <button
          type="submit"
          onClick={() => onSubmit()}
          className="btn btn-primary btn-block"
        >
          Login
        </button>
        <Link to="/register" className="btn btn-secondary btn-block">
          Register
        </Link>
      </div>
    </div>
  );
}
