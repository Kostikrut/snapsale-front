import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import MarqueeToEdit from "./MarqueeToEdit";
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
      <div className="marquee-items">
        {marquees &&
          marquees.map((marquee) => (
            <MarqueeToEdit
              key={marquee._id}
              marquee={marquee}
              setMarquees={setMarquees}
            />
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
