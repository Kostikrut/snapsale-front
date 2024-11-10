import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { LoginContext } from "../contexts/LoginContext";
import { config } from "../config";
import renderToast from "../utils/renderToast";
import "../pages/styles/MenageUsers.css";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = config.API_URL;

function MenageUsers() {
  const [query, setQuery] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersFound, setUsersFound] = useState([]);
  const [updateUser, setUpdateUser] = useState({});
  const { bearerToken } = useContext(LoginContext);

  const handleChangeFind = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const findUsers = async () => {
    const filteredQuery = Object.entries(query).filter(
      ([key, value]) => value !== ""
    );

    const queryString = filteredQuery
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    try {
      const res = await fetch(`${apiUrl}/api/v1/users?${queryString}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      const data = await res.json();

      if (!res.ok) throw data;

      if (data.results === 0) return renderToast("info", "No users found");

      setUsersFound(data.data.users);
    } catch (err) {
      renderToast(
        "error",
        err.message || "Couldn't find users, please relogin and try again"
      );
    }
  };

  const handleSelectUser = (e) => {
    const user = usersFound.find((user) => user._id === e.target.value);
    setSelectedUser({ ...user });
    setUpdateUser({ ...user });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser({
      ...updateUser,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdateUser({
      ...updateUser,
      image: file,
    });
  };

  const handleUpdateUserInfo = async () => {
    const data = new FormData();
    data.append("fullName", updateUser.fullName);
    data.append("email", updateUser.email);
    data.append("phone", updateUser.phone);
    data.append("role", updateUser.role);
    if (updateUser.image) {
      data.append("image", updateUser.image);
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        body: data,
      });

      const resData = await res.json();

      if (!res.ok) throw resData;

      renderToast("success", "User information updated successfully");
    } catch (err) {
      renderToast(
        "error",
        err.message || "Couldn't update user information, please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="menage-users-container">
        <div className="search-users">
          <h1>Search For Users</h1>
          <input
            onChange={handleChangeFind}
            name="fullName"
            type="text"
            placeholder="Search by name"
          />
          <input
            onChange={handleChangeFind}
            name="email"
            type="text"
            placeholder="Search by email"
          />
          <input
            onChange={handleChangeFind}
            name="phone"
            type="text"
            placeholder="Search by phone number"
          />
          <select
            onChange={handleChangeFind}
            name="role"
            placeholder="Select by role"
          >
            <option value="">Select...</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button className="menage-users-btn" onClick={findUsers}>
            Search
          </button>
        </div>
        {usersFound.length > 0 && (
          <div className="select-user">
            <>
              <h1>Select User</h1>
              <select name="user" onChange={handleSelectUser}>
                <option value="">Select user</option>
                {usersFound.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </>
          </div>
        )}
        {selectedUser && (
          <div className="edit-selected-user">
            <h1>User Information</h1>
            <div className="user-id">
              <label>User Id:</label>
              <label>{updateUser._id}</label>
            </div>
            <div>
              <img
                className="user-profile-img"
                src={updateUser.image?.url}
                alt="user-profile"
              />
            </div>
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={updateUser.fullName || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={updateUser.email || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={updateUser.phone || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div>
              <label>Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
              ></input>
            </div>
            <div>
              <label>Role:</label>
              <select
                name="role"
                value={updateUser.role || ""}
                onChange={handleUpdateChange}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="edit-user">
              <button
                className="menage-users-btn"
                onClick={handleUpdateUserInfo}
              >
                Update User
              </button>
              <button className="menage-users-btn">Deactivate User</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MenageUsers;
