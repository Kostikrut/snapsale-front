import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/AccountSettings.css";
import "react-toastify/dist/ReactToastify.css";

function AccountSettings() {
  const { bearerToken, updateUserLoggedState, logOut } =
    useContext(LoginContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [address, setAddress] = useState({
    apartment: "",
    city: "",
    address: "",
    zipCode: "",
  });

  const apiUrl = config.API_URL;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/users/me`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
        });

        const { data } = await res.json();

        if (!res.ok) throw data;

        setUserData(data.user);
      } catch (err) {
        renderToast(
          err.message ||
            "Something went wrong, please try again later or relogin."
        );
      }
    };

    getUserData();
  }, [bearerToken, apiUrl]);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      let updateData = {};

      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;

      if (!updateData.fullName && !updateData.email && !updateData.phone)
        return renderToast(
          "error",
          "Update fields are empty, please fill the form and then update."
        );

      const res = await fetch(`${apiUrl}/api/v1/users/updateMe`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) throw data;

      return renderToast("success", "Data updated successfuly!");
    } catch (err) {
      renderToast(
        err.message ||
          "Somethong went wrong on updating data, please try again later."
      );
    } finally {
      setEmail("");
      setFullName("");
      setPhone("");
    }
  };

  const handleUpdatePicture = async (e) => {
    e.preventDefault();

    if (!profileImage)
      return renderToast(
        "error",
        "No selected image, please select an image and then submit."
      );

    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/updateMe`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw data;

      return renderToast("success", "Image uploaded and updates succeessfuly!");
    } catch (err) {
      renderToast(
        err.message ||
          "Somethong went wrong on updating image, please try again later."
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword && !passwordConfirm && !password)
      return renderToast("error", "One of the password fields is missing.");

    if (passwordConfirm !== password)
      return renderToast(
        "error",
        "New password fields do not match, please check the password fields and try again."
      );

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/updateMyPassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ currentPassword, password, passwordConfirm }),
      });

      if (res.status === 401)
        return renderToast(
          "error",
          "Your current password is not correct, please try again."
        );

      const data = await res.json();

      if (!res.ok) throw data;

      updateUserLoggedState(data);
      renderToast(
        "success",
        "Password updated successfuly and you are logged in."
      );
    } catch (err) {
      renderToast(
        err.message ||
          "Somethong went wrong on updating password, please try again later."
      );
    } finally {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(address).some((value) => !value.trim());
    if (isEmptyField) {
      return renderToast("error", "Please fill in all address fields.");
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/updateMe`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      renderToast("success", "Address updated successfully!");
    } catch (err) {
      renderToast(
        err.message || "Something went wrong, please try again later."
      );
    } finally {
      setAddress({
        apartment: "",
        city: "",
        address: "",
        zipCode: "",
      });
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();

    navigate("/");

    logOut();
  };

  return (
    <>
      <ToastContainer />
      <div className="account-settings">
        <div className="user-info">
          <div className="profile-image-container">
            <img
              src={userData?.image?.url || "/default-profile.png"}
              alt="User Profile"
              className="profile-image"
            />
          </div>
          <div className="user-details">
            <h2>{userData?.fullName || "User Name"}</h2>
            <p>{userData?.email || "user@example.com"}</p>
          </div>
        </div>

        <section>
          <h3>Update Account Information</h3>
          <form id="account-info-form" onSubmit={handleUpdateAccount}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit">Update Account</button>
          </form>
        </section>
        <section>
          <h3>Update Profile Photo</h3>
          <form
            id="photo-upload-form"
            encType="multipart/form-data"
            onSubmit={handleUpdatePicture}
          >
            <div>
              <label>Profile Photo:</label>
              <input
                type="file"
                name="image"
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                }}
              />
            </div>
            <button type="submit">Update Photo</button>
          </form>
        </section>
        <section>
          <h3>Update Address</h3>
          <form id="address-form" onSubmit={handleAddAddress}>
            <div>
              <label>City:</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                value={address.address}
                onChange={(e) =>
                  setAddress({ ...address, address: e.target.value })
                }
              />
            </div>
            <div>
              <label>Apartment/Suit:</label>
              <input
                type="text"
                value={address.apartment}
                onChange={(e) =>
                  setAddress({ ...address, apartment: e.target.value })
                }
              />
            </div>
            <div>
              <label>Zip Code:</label>
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) =>
                  setAddress({ ...address, zipCode: e.target.value })
                }
              />
            </div>

            <button type="submit">Save Address</button>
          </form>
        </section>
        <section>
          <h3>Change Password</h3>
          <form id="password-update-form" onSubmit={handleChangePassword}>
            <div>
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <button type="submit">Change Password</button>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default AccountSettings;
