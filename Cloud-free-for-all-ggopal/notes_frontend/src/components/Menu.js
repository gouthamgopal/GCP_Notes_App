import React from "react";
import { Navbar, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./styles/Menu.css";
import jwt_decode from "jwt-decode";

export default function Menu() {
  const jwtToken = localStorage.getItem("user");
  const user = jwtToken !== null ? jwt_decode(jwtToken)["user"] : null;

  const history = useHistory();
  const logOut = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="menuNav"
    >
      <Navbar.Brand>Notes App</Navbar.Brand>
      <ul className="nav nav-pills" style={{ float: "right" }}>
        <li className="nav-item">
          <Link className="nav-link" to={`/home`}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/add`}>
            Add Note
          </Link>
        </li>
        {user != null && (
          <NavDropdown title={`Hello ${user["name"]}`} className="nav-item">
            <NavDropdown.Item onClick={() => logOut()}>Logout</NavDropdown.Item>
          </NavDropdown>
        )}
      </ul>
    </Navbar>
  );
}
