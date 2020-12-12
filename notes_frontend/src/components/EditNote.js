import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Menu from "./Menu";
import "./styles/EditNote.css";

export default function EditNote(props) {
  const history = useHistory();
  const note = props.location.state["note"];
  const jwtToken = localStorage.getItem("user");

  const [topic, setTopic] = useState(note["topic"]);
  const [text, setText] = useState(note["content"]);
  const [updateError, setUpdateError] = useState(false);

  const onSubmit = () => {
    // Do validation for topic and text
    if (topic !== note["topic"]) {
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
          setUpdateError(false);
        })
        .catch((err) => {
          console.log(err);
          setUpdateError(true);
          return;
        });
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    const payload = {
      topic: topic,
      content: text,
      date: today,
    };

    axios
      .put("https://notes-service-lb6yim52dq-uk.a.run.app/update", payload, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        console.log(response);
        setUpdateError(false);
        history.push("/home");
      })
      .catch((err) => {
        console.log(err);
        setUpdateError(true);
      });
  };

  return (
    <div>
      <Menu />
      <div className="container">
        <h2 className="header">Edit Note</h2>
        {updateError && <p>Update failed, try again</p>}
        <div className="topic">
          <div>
            <label>Topic</label>
          </div>
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
              }}
              style={{ width: 512 }}
            />
          </div>
        </div>
        <div className="content">
          <div>
            <label>Content</label>
          </div>
          <div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              rows={10}
              cols={70}
            />
          </div>
        </div>
        <div className="buttons">
          <Button variant="primary" onClick={() => onSubmit()}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => history.push("/home")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}


