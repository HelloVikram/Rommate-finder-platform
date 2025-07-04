const endpoint = `http://localhost:3000`;
const listingsContainer = document.querySelector('#listingsContainer');

document.addEventListener('DOMContentLoaded', async (e) => {
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
        const base64 = token.split('.')[1];
        const text = atob(base64);
        const payload = JSON.parse(text);
        const greetname = payload.name;
        if (greetname) {
            const greetings = document.createElement('span');
            greetings.textContent = `Hi ${greetname}`;
            greetings.className = "me-3 fw-semibold";


            const navbar = document.querySelector(".navbar");
            if (navbar) {
                navbar.prepend(greetings);
            }
        }
    } catch (err) {
        console.error("Failed to parse token:", err);
    }

    loadListings();

    document.getElementById('applyFilters').addEventListener('click', () => {
        const city = document.getElementById('filterCity').value;
        const gender = document.getElementById('filterGender').value;
        const rent = document.getElementById('filterRent').value;
        const roomType = document.getElementById('roomType').value;
        const filters = {};
        if (city) filters.city = city;
        if (gender) filters.genderPreference = gender;
        if (rent) filters.maxRent = rent;
        if (roomType) filters.roomType = roomType;
        loadListings(filters, 1);
    });

    document.getElementById('limitApplyBtn').addEventListener('click', () => {
        loadListings();
    });
});

async function loadListings(filters = {}, page = 1) {
    const token = localStorage.getItem('token');
    const setLimit = document.getElementById('limitSelect').value;
    filters.page = page;
    filters.limit = setLimit;

    const query = new URLSearchParams(filters).toString();

    try {
        const response = await axios.get(`${endpoint}/listings?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const listings = response.data.data;
        const totalPages = response.data.totalPages;
        const currentPage = response.data.currentPage;

        listingsContainer.innerHTML = "";

        if (listings.length === 0) {
            listingsContainer.innerHTML = `<p>No listings found!</p>`;
            document.querySelector('#pagination').innerHTML = "";
            return;
        }

        listings.forEach(listing => {
            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
      <div class='card h-100'
        <div class='card-body'>
          <h5 class='card-title'>${listing.title}</h5>
          <h6 class='card-subtitle text-muted'>${listing.city}</h6>
          <p class='card-text'>${listing.description}</p>
          <p><strong>Rent:</strong> ₹${listing.rent}</p>
          <p><strong>Available from:</strong> ${new Date(listing.availableFrom).toLocaleDateString()}</p>
          <p><strong>Preference:</strong> ${listing.genderPreference}, ${listing.roomType}</p>
          <button class="btn btn-outline-secondary btn-sm mt-2 contact-btn" 
            data-owner="${listing.userId?.email}" 
            data-title="${listing.title}">
      Contact
    </button>
        </div>
        </div>
      `;
            listingsContainer.appendChild(card);
        });

        renderPagination(totalPages, currentPage, filters);
    } catch (err) {
        console.error("Error loading listings:", err);
    }
}

function renderPagination(totalPages, currentPage, filters) {
    const pagination = document.querySelector('#pagination');
    if (!pagination) return;
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} mx-1`;
        btn.addEventListener('click', () => {
            loadListings(filters, i);
        });
        pagination.appendChild(btn);
    }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('contact-btn')) {
    const button = e.target;
    const email = button.dataset.owner;
    const title = button.dataset.title;

    document.getElementById('contactToEmail').value = email;
    document.getElementById('contactModalLabel').textContent = `Contact Owner of: ${title}`;

    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
  }
});


document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const to = document.getElementById('contactToEmail').value;
  const senderName = document.getElementById('senderName').value;
  const senderEmail = document.getElementById('senderEmail').value;
  const message = document.getElementById('messageText').value;

  try {
    await axios.post(`${endpoint}/contact`, {
      to,
      senderName,
      senderEmail,
      message,
    });

    alert("Message sent successfully!");
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
    document.getElementById('contactForm').reset();
  } catch (err) {
    console.error("Failed to send message:", err);
    alert("Failed to send message. Please try again.");
  }
});
