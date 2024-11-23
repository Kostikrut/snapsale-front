import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "../pages/styles/MenageMarquees.css";

const apiUrl = config.API_URL;

const MenageMarquees = () => {
  const { bearerToken } = useContext(LoginContext);
  const [marquees, setMarquees] = useState([]);
  const [newMarquee, setNewMarquee] = useState({
    title: "",
    content: "",
    link: "",
  });

  useEffect(() => {
    const fetchMarquees = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/marquees/`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
        });

        const { data } = await res.json();

        setMarquees(data.marquees);
      } catch (err) {
        renderToast("error", "An error occurred while fetching marquees.");
      }
    };
    fetchMarquees();
  }, [bearerToken]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/marquees/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete marquee. relogin and try again.");
      }

      setMarquees(marquees.filter((marquee) => marquee._id !== id));
    } catch (error) {
      renderToast("error", "An error occurred while deleting marquee.");
    }
  };

  const handleEdit = async (id) => {
    const marquee = marquees.find((marquee) => marquee._id === id);
    setNewMarquee(marquee);

    const res = await fetch(`${apiUrl}/api/v1/marquees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ marquee: newMarquee }),
    });
    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to edit marquee. relogin and try again.");
    }

    const data = await res.json();
    console.log(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/v1/marquees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ marquee: newMarquee }),
      });

      if (!res.ok) {
        throw new Error("Failed to create marquee. relogin and try again.");
      }

      const data = await res.json();

      setMarquees([...marquees, data.data.marquee]);
      setNewMarquee({ title: "", content: "", link: "" });
    } catch (err) {
      renderToast(
        "error",
        err.message || "An error occurred while creating marquee."
      );
    }
  };

  return (
    <div className="marquee-edit">
      <h2>Edit Marquees</h2>
      <div className="marquee-list">
        {marquees &&
          marquees.map((marquee) => (
            <div key={marquee._id} className="marquee-item">
              <h3>{marquee.title}</h3>
              <p>{marquee.content}</p>
              <Link to={marquee.link}>
                <span>{marquee.link}</span>
              </Link>
              <div className="button-group">
                <button
                  onClick={() => handleEdit(marquee._id)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(marquee._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      <h3>Create New Marquee</h3>
      <form onSubmit={handleCreate} className="new-marquee-form">
        <input
          type="text"
          placeholder="Title"
          value={newMarquee.title}
          onChange={(e) =>
            setNewMarquee({ ...newMarquee, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Content"
          value={newMarquee.content}
          onChange={(e) =>
            setNewMarquee({ ...newMarquee, content: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Link"
          value={newMarquee.link}
          onChange={(e) =>
            setNewMarquee({ ...newMarquee, link: e.target.value })
          }
        />
        <button type="submit" className="add-button">
          Add Marquee
        </button>
      </form>
    </div>
  );
};

export default MenageMarquees;
