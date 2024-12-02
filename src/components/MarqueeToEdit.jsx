import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import renderToast from "../utils/renderToast";

import { LoginContext } from "../contexts/LoginContext";
import { config } from "../config";

const apiUrl = config.API_URL;

function MarqueeToEdit({ marquee, setMarquees }) {
  const [toEdit, setToEdit] = useState(null);
  const { bearerToken } = useContext(LoginContext);

  const handleEdit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}/api/v1/marquees/${toEdit._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ marquee: toEdit }),
    });

    if (!res.ok) {
      throw new Error("Failed to edit marquee. relogin and try again.");
    }

    const { data } = await res.json();
    console.log(data);

    setToEdit(null);
    setMarquees((prev) => {
      return prev.map((m) => {
        if (m._id === data.marquee._id) {
          return data.marquee;
        }
        return m;
      });
    });
  };

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

      setMarquees((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      renderToast("error", "An error occurred while deleting marquee.");
    }
  };

  return (
    <div key={marquee._id} className="marquee-item">
      <>
        <h3>{marquee.title}</h3>
        <p>{marquee.content}</p>
        <Link to={marquee.link}>
          <span>{marquee.link}</span>
        </Link>
      </>
      <div className="button-group">
        {toEdit ? (
          <button onClick={() => setToEdit(null)} className="edit-button">
            Cancel Edit
          </button>
        ) : (
          <button onClick={() => setToEdit(marquee)} className="edit-button">
            Edit
          </button>
        )}
        <button
          onClick={() => handleDelete(marquee._id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
      {toEdit && (
        <>
          <form onSubmit={handleEdit} className="new-marquee-form">
            <input
              type="text"
              placeholder="Title"
              value={toEdit.title}
              onChange={(e) => setToEdit({ ...toEdit, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Content"
              value={toEdit.content}
              onChange={(e) =>
                setToEdit({ ...toEdit, content: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Link"
              value={toEdit.link}
              onChange={(e) => setToEdit({ ...toEdit, link: e.target.value })}
            />
            <button type="submit" className="add-button">
              Update Marquee
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default MarqueeToEdit;
