const endpoint = `http://localhost:3000`;
const myListingsContainer = document.querySelector('#myListingsContainer');

document.addEventListener('DOMContentLoaded', async () => {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        try {
            const res = await fetch("navbar.html");
            const html = await res.text();
            navbarContainer.innerHTML = html;

            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                });
            }

        } catch (err) {
            console.error("Failed to load navbar:", err);
        }
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login!");
        window.location.href = "../login.html";
        return;
    }

    try {
        const response = await axios.get(`${endpoint}/listings/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const listings = response.data.data;
        myListingsContainer.innerHTML = "";

        if (listings.length === 0) {
            myListingsContainer.innerHTML = "<p>You have not created any listings yet.</p>";
            return;
        }

        listings.forEach(listing => {
            const card = document.createElement("div");
            card.className = "card col-md-4 m-2";
            card.innerHTML = `
        <div class='card-body'>
          <h5 class='card-title'>${listing.title}</h5>
          <h6 class='card-subtitle text-muted'>${listing.city}</h6>
          <p class='card-text'>${listing.description}</p>
          <p><strong>Rent:</strong> ₹${listing.rent}</p>
          <p><strong>Available from:</strong> ${new Date(listing.availableFrom).toLocaleDateString()}</p>
          <p><strong>Preference:</strong> ${listing.genderPreference}, ${listing.roomType}</p>
          <a href="edit-listing.html?id=${listing._id}" class="btn btn-sm btn-primary">Edit</a>
          <button class="btn btn-sm btn-danger delete-btn ms-2" data-id="${listing._id}">Delete</button>
        </div>
      `;
            myListingsContainer.appendChild(card);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const listingId = button.dataset.id;
                const confirmDelete = confirm("Are you sure you want to delete this listing?");
                if (!confirmDelete) return;

                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`${endpoint}/listings/${listingId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    showAlert("Listing deleted successfully!", "success");
                    setTimeout(() => window.location.reload(), 1500);

                } catch (err) {
                    console.error("Delete failed:", err);
                    alert("Something went wrong while deleting.");
                }
            });
        });


    } catch (err) {
        console.error("Error loading your listings:", err);
    }
});

function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}
