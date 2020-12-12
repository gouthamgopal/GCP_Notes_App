import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [confirmPasswordError, setconfirmPasswordError] = useState(false);
  const [nameError, setnameError] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [registerServiceError, setRegisterServiceError] = useState(false);

  const history = useHistory();

  const validate = () => {
    // TODO: provide validations for name, email and password
    var re = /^(([^<>()\\[\]\\.,;:\s@”]+(\.[^<>()\\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let emailcheck = re.test(email);
    let email_error = !emailcheck;

    setemailError(email_error);

    re = /^([a-zA-Z0-9]{8,})$/;
    let passwordcheck = re.test(password);
    let password_error = !passwordcheck;
    setpasswordError(password_error);

    let confirmpassword_error = !(password === confirmPassword);
    setconfirmPasswordError(confirmpassword_error);

    let name_error = null;
    if (name === "") {
      name_error = true;
    } else {
      name_error = false;
    }
    setnameError(name_error);
    if (email_error || password_error || confirmpassword_error || name_error) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    console.log(name, email);

    if (validate()) {
      const payload = {
        name: name.trim(),
        email: email.toLowerCase(),
        password: password,
      };

      axios
        .post(
          "https://auth-service-lb6yim52dq-uk.a.run.app/register",
          payload,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Register response", response);
          if (response.status === 202) {
            setRegisterError(true);
          } else {
            setRegisterError(false);
            history.push("/login");
          }
        })
        .catch((error) => {
          console.log("Register error", error);
          setRegisterServiceError(true);
        });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3 className="header">Register</h3>
        {registerError && (
          <div>
            <p>User already exists, please login</p>
            <Link to="login">Click here</Link>
          </div>
        )}
        {registerServiceError && (
          <div>
            <p>Register service failed, please try again</p>
          </div>
        )}
        <div className="form-group">
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Name"
          />
          {nameError && <p className="inputError">Please enter a name.</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Email"
          />
          {emailError && (
            <p className="inputError">Please enter a valid email.</p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
          />
          {passwordError && (
            <p className="inputError">
              Please enter a valid password, 8 characters long.
            </p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
            placeholder="Confirm Password"
          />
          {confirmPasswordError && (
            <p className="inputError">Passwords do not match.</p>
          )}
        </div>
        <button
          type="submit"
          onClick={() => onSubmit()}
          className="btn btn-primary btn-block"
        >
          Register
        </button>
        <Link to="/login" className="btn btn-secondary btn-block">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
