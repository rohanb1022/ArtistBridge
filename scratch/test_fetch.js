const jwt = require("jsonwebtoken");
const axios = require("axios");

// Generate a valid JWT for organizer "Reliance"
const token = jwt.sign(
  { id: "6a0df096121c54dc24e1db1b", role: "organizer" },
  "rohanbhangale101022",
  { expiresIn: "7d" }
);

async function testFetch() {
  console.log("Generated Token:", token);
  
  const payload = {
    artistId: "6a0de501b24aa7067a81e8a8", // rohan Bhangale
    eventName: "Integration Test Event",
    city: "Mumbai",
    price: 15000,
    date: "2026-12-25", // Make sure date is in the future
    time: "20:00"
  };

  try {
    console.log("Sending POST request to http://localhost:3000/api/booking/bookingRequest...");
    const res = await axios.post("http://localhost:3000/api/booking/bookingRequest", payload, {
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json"
      }
    });
    console.log("Success! Response status:", res.status);
    console.log("Response data:", res.data);
  } catch (err) {
    console.log("Failed! Response status:", err.response?.status);
    console.log("Response data:", err.response?.data);
  }
}

// Wait for dev server to start
setTimeout(testFetch, 4000);
