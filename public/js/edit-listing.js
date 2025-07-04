const endpoint = "http://localhost:3000";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id || !token) {
    alert("Invalid access");
    window.location.href = "dashboard.html";
    return;
  }

  try {
    const res = await axios.get(`${endpoint}/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listing = res.data.data;
    
    document.getElementById("listingId").value = listing._id;
    document.getElementById("title").value = listing.title;
    document.getElementById("description").value = listing.description;
    document.getElementById("city").value = listing.city;
    document.getElementById("rent").value = listing.rent;
    document.getElementById("availableFrom").value = listing.availableFrom.split("T")[0];
    document.getElementById("genderPreference").value = listing.genderPreference;
    document.getElementById("roomType").value = listing.roomType;

  } catch (err) {
    console.error("Error fetching listing:", err);
    alert("Something went wrong");
  }
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("listingId").value;

  const updatedData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    city: document.getElementById("city").value,
    rent: document.getElementById("rent").value,
    availableFrom: document.getElementById("availableFrom").value,
    genderPreference: document.getElementById("genderPreference").value,
    roomType: document.getElementById("roomType").value
  };

  try {
    await axios.put(`${endpoint}/listings/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Listing updated!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update listing.");
  }
});