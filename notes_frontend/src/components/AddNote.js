import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Menu from "./Menu";
import "./styles/EditNote.css";

export default function AddNote() {
  const jwtToken = localStorage.getItem("user");
  const history = useHistory();

  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [updateError, setUpdateError] = useState(false);
  const [topicError, setTopicError] = useState(false);

  const onSubmit = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    // TODO: do validations for topic and text

    const payload = {
      topic: topic,
      content: text,
      date: today,
    };

    axios
      .post("https://notes-service-lb6yim52dq-uk.a.run.app/add", payload, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 202) {
          setUpdateError(false);
          setTopicError(true);
        } else {
          setUpdateError(false);
          history.push("/home");
        }
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
        <h2 className="header">Add new note</h2>
        {updateError && <p>Add failed, try again</p>}
        {topicError && <p>Topic already exists, try a new one!</p>}
        <div className="topic">
          <div>
            <label>Topic</label>
          </div>
          <div>
            <input
              type="text"
              value={topic}
              placeholder="Add a topic"
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
              placeholder="Add the notes for the topic.."
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
            Add
          </Button>
          <Button variant="secondary" onClick={() => history.push("/home")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
