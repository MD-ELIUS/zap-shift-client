import { useQuery, useQueryClient } from "@tanstack/react-query";
import useTitle from "../../../hooks/useTitle";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect } from "react";

const MyProfile = () => {
  useTitle("My Profile");
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL);
  const [errors, setErrors] = useState({});

  // 🔹 get role using unified hook
  const { role, roleLoading } = useRole();

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
    // Manual Validation
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";

    if (role === 'rider') {
      if (!modalRiderInfo.riderContact?.trim()) newErrors.riderContact = "Contact is required";
      if (!modalRiderInfo.riderNID?.trim()) newErrors.riderNID = "NID is required";
      if (!modalRiderInfo.riderAge?.trim()) newErrors.riderAge = "Age is required";
      if (!modalRiderInfo.riderRegion?.trim()) newErrors.riderRegion = "Region is required";
      if (!modalRiderInfo.riderDistrict?.trim()) newErrors.riderDistrict = "District is required";
      if (!modalRiderInfo.riderLicense?.trim()) newErrors.riderLicense = "License is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

      // ✅ firebase update
      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      await user.reload();

      // ✅ database update (User collection)
      await axiosSecure.patch("/users/me/profile", {
        displayName: name,
        photoURL,
      });

      // ✅ database update (Rider collection - if rider)
      if (role === 'rider') {
        const riderUpdateInfo = {
          riderNID: modalRiderInfo.riderNID,
          riderContact: modalRiderInfo.riderContact,
          riderRegion: modalRiderInfo.riderRegion,
          riderDistrict: modalRiderInfo.riderDistrict,
          riderAge: modalRiderInfo.riderAge,
          riderLicense: modalRiderInfo.riderLicense,
        };
        await axiosSecure.patch("/riders/me", riderUpdateInfo);
        queryClient.invalidateQueries(["my-rider-info"]);
      }

      // Invalidate role query to ensure navigation/sidebar updates
      queryClient.invalidateQueries(['user-role', user?.email]);

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

  // 🔹 fetch service centers
  const { data: serviceCenters = [] } = useQuery({
    queryKey: ["service-centers"],
    queryFn: async () => {
      const res = await fetch("/serviceCenters.json");
      return res.json();
    }
  });

  const regions = [...new Set(serviceCenters.map(c => c.region))];

  const districtsByRegion = (region) => {
    return serviceCenters
      .filter(c => c.region === region)
      .map(d => d.district);
  };

  // 🔹 Rider specific info fetch
  const { data: riderInfo = {}, refetch: refetchRider } = useQuery({
    queryKey: ["my-rider-info"],
    enabled: role === 'rider',
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/me");
      return res.data || {};
    }
  });

  const handleRiderFieldChange = (field, value) => {
    // Note: Since name/email are in user, we handle specific rider fields separately
    // We can just update the local riderInfo if we use a state, but for simplicity
    // and since useQuery data should be immutable, we'll use a local state for the modal fields
  };

  // State for modal fields (to allow editing)
  const [modalRiderInfo, setModalRiderInfo] = useState({});

  const openModal = () => {
    setModalRiderInfo({ ...riderInfo });
    setErrors({});
    setIsOpen(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold mb-6 text-secondary">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-base-100 shadow rounded-2xl p-6 flex flex-col md:flex-row gap-8 border border-primary">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.photoURL}
            className="w-32 h-32 rounded-full object-cover border-2 border-primary"
          />
          <span className="badge badge-primary text-black font-bold uppercase py-3 px-4">
            {role}
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <p className="border-b border-base-200 pb-1"><b>Name:</b> {user?.displayName}</p>
          <p className="border-b border-base-200 pb-1"><b>Email:</b> {user?.email}</p>

          <p className="border-b border-base-200 pb-1">
            <b>Account Created:</b>{" "}
            {new Date(user?.metadata?.creationTime).toLocaleDateString()}
          </p>

          <p className="border-b border-base-200 pb-1">
            <b>Last Login:</b>{" "}
            {new Date(user?.metadata?.lastSignInTime).toLocaleDateString()}
          </p>

          {/* Rider Specific Fields */}
          {role === 'rider' && (
            <>
              <p className="border-b border-base-200 pb-1"><b>NID:</b> {riderInfo.riderNID || 'N/A'}</p>
              <p className="border-b border-base-200 pb-1"><b>Contact:</b> {riderInfo.riderContact || 'N/A'}</p>
              <p className="border-b border-base-200 pb-1"><b>Region:</b> {riderInfo.riderRegion || 'N/A'}</p>
              <p className="border-b border-base-200 pb-1"><b>District:</b> {riderInfo.riderDistrict || 'N/A'}</p>
              <p className="border-b border-base-200 pb-1"><b>Age:</b> {riderInfo.riderAge || 'N/A'}</p>
              <p className="border-b border-base-200 pb-1"><b>License:</b> {riderInfo.riderLicense || 'N/A'}</p>
            </>
          )}

          <div className="md:col-span-2 pt-4">
            <button
              onClick={openModal}
              className="btn btn-primary text-black px-8"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box rounded-2xl max-w-2xl">
            <h3 className="font-bold text-2xl mb-6 text-center text-secondary">
              Update Profile Details
            </h3>

            {/* Avatar upload */}
            <div className="flex justify-center mb-6">
              <label className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-primary group">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-2xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Display Name</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {role === 'rider' && (
                <>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Contact Number</span></label>
                    <input
                      type="text"
                      value={modalRiderInfo.riderContact || ""}
                      onChange={(e) => {
                        setModalRiderInfo({ ...modalRiderInfo, riderContact: e.target.value });
                        if (errors.riderContact) setErrors({ ...errors, riderContact: null });
                      }}
                      className={`input input-bordered w-full ${errors.riderContact ? 'border-red-500' : ''}`}
                    />
                    {errors.riderContact && <p className="text-red-500 text-xs mt-1">{errors.riderContact}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">NID</span></label>
                    <input
                      type="text"
                      value={modalRiderInfo.riderNID || ""}
                      onChange={(e) => {
                        setModalRiderInfo({ ...modalRiderInfo, riderNID: e.target.value });
                        if (errors.riderNID) setErrors({ ...errors, riderNID: null });
                      }}
                      className={`input input-bordered w-full ${errors.riderNID ? 'border-red-500' : ''}`}
                    />
                    {errors.riderNID && <p className="text-red-500 text-xs mt-1">{errors.riderNID}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Age</span></label>
                    <input
                      type="text"
                      value={modalRiderInfo.riderAge || ""}
                      onChange={(e) => {
                        setModalRiderInfo({ ...modalRiderInfo, riderAge: e.target.value });
                        if (errors.riderAge) setErrors({ ...errors, riderAge: null });
                      }}
                      className={`input input-bordered w-full ${errors.riderAge ? 'border-red-500' : ''}`}
                    />
                    {errors.riderAge && <p className="text-red-500 text-xs mt-1">{errors.riderAge}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Region</span></label>
                    <select
                      value={modalRiderInfo.riderRegion || ""}
                      onChange={(e) => {
                        const newRegion = e.target.value;
                        setModalRiderInfo({
                          ...modalRiderInfo,
                          riderRegion: newRegion,
                          riderDistrict: "" // Reset district when region changes
                        });
                        if (errors.riderRegion) setErrors({ ...errors, riderRegion: null, riderDistrict: null });
                      }}
                      className={`select select-bordered w-full ${errors.riderRegion ? 'border-red-500' : ''}`}
                    >
                      <option value="" disabled>Pick a region</option>
                      {regions.map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.riderRegion && <p className="text-red-500 text-xs mt-1">{errors.riderRegion}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">District</span></label>
                    <select
                      value={modalRiderInfo.riderDistrict || ""}
                      onChange={(e) => {
                        setModalRiderInfo({ ...modalRiderInfo, riderDistrict: e.target.value });
                        if (errors.riderDistrict) setErrors({ ...errors, riderDistrict: null });
                      }}
                      className={`select select-bordered w-full ${errors.riderDistrict ? 'border-red-500' : ''}`}
                      disabled={!modalRiderInfo.riderRegion}
                    >
                      <option value="" disabled>Pick a district</option>
                      {districtsByRegion(modalRiderInfo.riderRegion).map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.riderDistrict && <p className="text-red-500 text-xs mt-1">{errors.riderDistrict}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">License</span></label>
                    <input
                      type="text"
                      value={modalRiderInfo.riderLicense || ""}
                      onChange={(e) => {
                        setModalRiderInfo({ ...modalRiderInfo, riderLicense: e.target.value });
                        if (errors.riderLicense) setErrors({ ...errors, riderLicense: null });
                      }}
                      className={`input input-bordered w-full ${errors.riderLicense ? 'border-red-500' : ''}`}
                    />
                    {errors.riderLicense && <p className="text-red-500 text-xs mt-1">{errors.riderLicense}</p>}
                  </div>
                </>
              )}
            </div>

            <div className="modal-action mt-8">
              <button
                onClick={handleUpdate}
                className="btn btn-primary text-black px-8"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost"
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
