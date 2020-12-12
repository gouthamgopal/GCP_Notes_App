import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import Menu from "./Menu";
import "./styles/Home.css";

export default function Home() {
  let history = useHistory();
  const jwtToken = localStorage.getItem("user");
  const [isAuthenticated, setAuthentication] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (jwtToken && jwtToken !== undefined && jwtToken !== "") {
      setAuthentication(true);
      axios
        .get("https://notes-service-lb6yim52dq-uk.a.run.app/fetch", {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          console.log(response);
          setNotes(response.data);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        });
    } else {
      setAuthentication(false);
      if (!isAuthenticated) {
        history.push("/login");
      }
    }
  }, [jwtToken, setAuthentication, setNotes, history, isAuthenticated]);

  const deleteNote = (note) => {
    console.log(note);
    axios
      .get(
        "https://notes-service-lb6yim52dq-uk.a.run.app/delete?topic=" +
          note["topic"],
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setNotes(notes.filter((item) => item["topic"] !== note["topic"]));
        console.log(notes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // Create Menu component and add login logout.
    <div>
      {isAuthenticated && (
        <div className="home-title">
          <Menu />
          <div className="container">
            <h2 className="notes-header">All Notes</h2>
            <div className="notes-list">
              {notes &&
                notes.map((item, key) => {
                  return (
                    <Card key={key} className="noteCard">
                      <Card.Body>
                        <Card.Title className="noteTopic">
                          {item.topic}
                        </Card.Title>
                        <Card.Subtitle className="noteDate">
                          {item.date}
                        </Card.Subtitle>
                        <Card.Text className="noteText">
                          {item.content}
                        </Card.Text>
                        <div className="card-buttons">
                          <Link
                            to={{ pathname: "/edit", state: { note: item } }}
                            className="editButton"
                          >
                            Edit
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              deleteNote(item);
                            }}
                            className="deleteButton"
                          >
                            X
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              {notes.length === 0 && (
                <div>
                  <p>No notes available, add new note.</p>
                  <Link to="/add">Add note</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
