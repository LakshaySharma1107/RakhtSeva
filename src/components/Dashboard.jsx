import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "requests"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const reqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(reqs);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in:", user.email);
        try {
          const snapshot = await getDocs(collection(db, "userDetails"));
          const current = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .find((u) => u.userId === user.uid); // Match by userId

          if (current) {
            console.log("Matched Firestore user:", current);
            setUserData(current);
          } else {
            console.warn("No matching user found in 'userDetails'");
          }
        } catch (error) {
          console.error("Error fetching userDetails:", error);
        }
      } else {
        console.log("User not signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendRequest = async () => {
    if (!userData) return alert("User data not loaded");
    if (!selectedBloodGroup) {
      return alert("Please select a blood group before sending request.");
    }

    const {
      FirstName,
      LastName,
      latitude,
      longitude,
      contactNo,
      userId,
    } = userData;

    const fullName = `${FirstName} ${LastName}`;

    try {
      const snapshot = await getDocs(collection(db, "userDetails"));
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchingUsers = users.filter((u) => {
        if (u.userId === userId) return false;
        if (!u.latitude || !u.longitude || !u.bloodGroup) return false;

        const dist = haversineDistance(
          latitude,
          longitude,
          u.latitude,
          u.longitude
        );
        return dist <= 10 && u.bloodGroup === selectedBloodGroup;
      });

      if (matchingUsers.length === 0) {
        return alert("No matching users found within 10 km");
      }

      for (let matched of matchingUsers) {
        await addDoc(collection(db, "requests"), {
          name: fullName,
          bloodGroup: selectedBloodGroup,
          location: `${latitude}, ${longitude}`,
          requestedUserName: `${matched.FirstName || ""} ${matched.LastName || ""}`,
          requestedUserContact: matched.contactNo || "Not provided",
          timestamp: new Date(),
        });
      }

      alert("Requests sent to nearby matching users.");
    } catch (err) {
      console.error("Error sending requests:", err);
      alert("Something went wrong while sending requests.");
    }
  };

  return (
    <div className="pt-24 text-white font-poppins flex flex-wrap">
      <div className="w-full md:w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4">Incoming Requests</h1>
        <label className="block mb-2 font-semibold">
          Select Blood Group:
        </label>
        <select
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
          className="mb-4 text-black p-2 rounded"
        >
          <option value="">-- Select --</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <button
          onClick={handleSendRequest}
          className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          Send Nearby Requests
        </button>

        {requests.length > 0 ? (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li
                key={req.id}
                className="p-4 bg-white text-black rounded shadow border"
              >
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
                <p><strong>Location:</strong> {req.location}</p>
                {req.requestedUserName && (
                  <>
                    <p><strong>Requested To:</strong> {req.requestedUserName}</p>
                    <p><strong>Contact:</strong> {req.requestedUserContact}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No requests yet.</p>
        )}
      </div>

      {/* Right side map */}
      <div className="w-full md:w-1/2 h-screen">
        <iframe
          title="Bing Map"
          width="100%"
          height="100%"
          src="https://www.bing.com/maps/embed?h=600&w=800&cp=20.5937~78.9629&lvl=5&typ=d&sty=r&src=SHELL&FORM=MBEDV8"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Dashboard;
