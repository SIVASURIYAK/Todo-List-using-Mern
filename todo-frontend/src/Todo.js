import React, { useEffect, useState } from "react";
import "./Todo.css";

// Emoji helper for accessibility
const Emoji = ({ symbol, label }) => (
  <span role="img" aria-label={label}>
    {symbol}
  </span>
);

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editID, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiURL = "http://localhost:8000";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiURL + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res))
      .catch(() => setError("Failed to fetch items"));
  };

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (title.trim() && description.trim()) {
      fetch(`${apiURL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTitle("");
            setDescription("");
            setMessage("Item added successfully! 🎉");
            setTimeout(() => {
              const messageElement = document.querySelector('.success-message');
              if (messageElement) {
                messageElement.classList.add("fade-out");
              }
              setTimeout(() => setMessage(""), 1000);
            }, 3000);
            getItems();
          } else {
            setError("Unable to create todo item");
          }
        })
        .catch(() => setError("Error connecting to the server"));
    } else {
      setError("Both fields are required 🙃");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    if (editTitle.trim() && editDescription.trim()) {
      fetch(`${apiURL}/todos/${editID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            setEditId(null);
            setEditTitle("");
            setEditDescription("");
            setMessage("Task updated! 🧐");
            setTimeout(() => {
              const messageElement = document.querySelector('.success-message');
              if (messageElement) {
                messageElement.classList.add("fade-out");
              }
              setTimeout(() => setMessage(""), 1000);
            }, 3000);
            getItems();
          } else {
            alert("Failed to update");
          }
        })
        .catch(() => alert("Error updating item"));
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`${apiURL}/todos/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setMessage("Task deleted! 🤔");
            setTimeout(() => {
              const messageElement = document.querySelector('.success-message');
              if (messageElement) {
                messageElement.classList.add("fade-out");
              }
              setTimeout(() => setMessage(""), 1000);
            }, 3000);
            getItems();
          } else {
            alert("Failed to delete item.");
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Error deleting item");
        });
    }
  };

  return (
    <>
      <div className="header">
        <h1>
          <Emoji symbol="🎉" label="party popper" /> MERNify Todo App <Emoji symbol="🚀" label="rocket" />
        </h1>
      </div>

      <div className="todo-form">
        <h3>Add Task! <Emoji symbol="✨" label="sparkles" /></h3>
        {message && <p className="success-message">{message}</p>}
        <div className="input-group">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="input-field"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="input-field"
            type="text"
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Add Task <Emoji symbol="🚀" label="rocket" />
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="todo-list">
        <h3>Your Tasks <Emoji symbol="💼" label="briefcase" /></h3>
        <ul className="todo-items">
          {todos.map((item) => (
            <li key={item._id} className="todo-item">
              <div className="todo-content">
                {editID === item._id ? (
                  <>
                    <input
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      className="form-control"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h5>
                      {item.title} <Emoji symbol="🎯" label="direct hit" />
                    </h5>
                    <p>{item.description}</p>
                  </>
                )}
              </div>
              <div className="todo-actions">
                {editID === item._id ? (
                  <>
                    <button className="btn update-btn" onClick={handleUpdate}>
                      Update <Emoji symbol="✅" label="check mark" />
                    </button>
                    <button className="btn cancel-btn" onClick={handleEditCancel}>
                      Cancel <Emoji symbol="⛔" label="no entry" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn edit-btn" onClick={() => handleEdit(item)}>
                      Edit <Emoji symbol="✏️" label="pencil" />
                    </button>
                    <button className="btn delete-btn" onClick={() => handleDelete(item._id)}>
                      Delete <Emoji symbol="🗑️" label="trash can" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
