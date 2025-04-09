import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../Firebase";
import "./signup.css"

const auth = getAuth(app);
const db = getFirestore(app);

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    bloodGroup: "",
    city: "",
    state: "",
    contactNo: "",
    bloodDisease: 0,
    longitude: "",
    latitude: "",
  });

  // Automatically get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please allow location access to auto-fill coordinates.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userId = userCredential.user.uid;

      // Store userDetails
      await setDoc(doc(db, "userDetails", userId), {
        userId,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        state: formData.state,
        contactNo: formData.contactNo,
        bloodDisease: parseInt(formData.bloodDisease),
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
      });

      // Store userLocation
      await setDoc(doc(db, "userLocation", userId), {
        userId,
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
      });

      alert("User registered successfully!");

      // Optionally reset form
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        bloodGroup: "",
        city: "",
        state: "",
        contactNo: "",
        bloodDisease: 0,
        longitude: "",
        latitude: "",
      });

    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="border p-2 rounded" required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} className="border p-2 rounded col-span-2" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} className="border p-2 rounded col-span-2" required />
          <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} value={formData.bloodGroup} className="border p-2 rounded" required />
          <input name="city" placeholder="City" onChange={handleChange} value={formData.city} className="border p-2 rounded" required />
          <input name="state" placeholder="State" onChange={handleChange} value={formData.state} className="border p-2 rounded" required />
          <input name="contactNo" placeholder="Contact No" onChange={handleChange} value={formData.contactNo} className="border p-2 rounded" required />
          <select name="bloodDisease" onChange={handleChange} value={formData.bloodDisease} className="border p-2 rounded">
            <option value="0">No Disease</option>
            <option value="1">Has Disease</option>
          </select>
          <input name="longitude" placeholder="Longitude" value={formData.longitude} readOnly className="border p-2 rounded bg-gray-100" />
          <input name="latitude" placeholder="Latitude" value={formData.latitude} readOnly className="border p-2 rounded bg-gray-100" />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
