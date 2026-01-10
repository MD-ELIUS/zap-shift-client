import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCamera } from "react-icons/fa";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL);

  // 🔹 get role
  const { data: roleData = {} } = useQuery({
    queryKey: ["my-role"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me/role");
      return res.data;
    }
  });

  // 🔹 image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 update profile
  const handleUpdate = async () => {
    try {
      let photoURL = user.photoURL;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        photoURL = data.data.url;
      }

      // ✅ firebase update (IMPORTANT FIX)
      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      await user.reload(); // 🔥 force refresh

      // ✅ database update
      await axiosSecure.patch("/users/me/profile", {
        displayName: name,
        photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsOpen(false);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className=" ">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-base-100 shadow rounded-2xl p-6 flex flex-col md:flex-row gap-6 border border-primary">
        <img
          src={user?.photoURL}
          className="w-32 h-32 rounded-full object-cover border"
        />

        <div className="space-y-2">
          <p><b>Name:</b> {user?.displayName}</p>
          <p><b>Email:</b> {user?.email}</p>

          <p>
            <b>Role:</b>{" "}
            <span className="badge badge-primary text-black">
              {roleData.role}
            </span>
          </p>

          <p>
            <b>Account Created:</b>{" "}
            {new Date(user?.metadata?.creationTime).toLocaleString()}
          </p>

          <p>
            <b>Last Login:</b>{" "}
            {new Date(user?.metadata?.lastSignInTime).toLocaleString()}
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-outline btn-sm mt-3"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box rounded-2xl">

            <h3 className="font-bold text-lg mb-4 text-center">
              Edit Profile
            </h3>

            {/* Avatar upload */}
            <div className="flex justify-center mb-4">
              <label className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer border">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <FaCamera className="text-white text-xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full mb-4"
              placeholder="Name"
            />

            <div className="modal-action">
              <button
                onClick={handleUpdate}
                className="btn btn-primary text-black"
              >
                Save
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyProfile;
