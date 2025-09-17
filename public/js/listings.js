const endpoint = `http://localhost:3000`;
const listingsContainer = document.querySelector('#listingsContainer');

document.addEventListener('DOMContentLoaded', async (e) => {
    const navbarContainer = document.getElementById("navbar-container");
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login!");
        window.location.href = "../login.html";
        return;
    }
    if (navbarContainer) {
        try {
            const res = await fetch("navbar.html");
            const html = await res.text();
            navbarContainer.innerHTML = html;

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));

                const greetname = payload.name;
                const isPremium = payload.isPremium;

                if (isPremium) {
                    const showNearbyBtn = document.getElementById("showNearbyBtn");
                    const showAllBtn = document.getElementById("showAllBtn");

                    if (showNearbyBtn && showAllBtn) {
                        showNearbyBtn.classList.remove("d-none");

                        showNearbyBtn.addEventListener("click", () => {
                            navigator.geolocation.getCurrentPosition(async function (position) {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;
                                try {
                                    const res = await axios.post(`${endpoint}/listings/nearby`, {
                                        latitude: lat,
                                        longitude: lng,
                                        radius: 10
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });

                                    const listings = res.data.listings;
                                    listingsContainer.innerHTML = "";

                                    if (listings.length === 0) {
                                        listingsContainer.innerHTML = `<p>No nearby listings found!</p>`;
                                        document.querySelector('#pagination').innerHTML = "";
                                        return;
                                    }

                                    listings.forEach(listing => {
                                        const card = document.createElement("div");
                                        card.className = "col-md-4 mb-4";
                                        card.innerHTML = `
                            <div class='card h-100'>
                              ${listing.imageUrl ? `<img src="${listing.imageUrl}" class="card-img-top" alt="Room Image">` : ''}
                              <div class='card-body'>
                                <h5 class='card-title'>${listing.title}</h5>
                                <h6 class='card-subtitle text-muted'>${listing.city}</h6>
                                <p class='card-text'>${listing.description}</p>
                                <p><strong>Rent:</strong> ₹${listing.rent}</p>
                                <p><strong>Available from:</strong> ${new Date(listing.availableFrom).toLocaleDateString()}</p>
                                <p><strong>Preference:</strong> ${listing.genderPreference}, ${listing.roomType}</p>
                                ${isPremium && listing.userId?.phone
                                                ? `<p><strong>Contact:</strong> ${listing.userId.phone}</p>`
                                                : `<button class="btn btn-outline-secondary btn-sm mt-2 contact-btn" 
                                        data-owner="${listing.userId?.email}" 
                                        data-title="${listing.title}">
                                        Contact
                                       </button>`}
                              </div>
                            </div>`;
                                        listingsContainer.appendChild(card);
                                    });

                                    document.querySelector('#pagination').innerHTML = "";
                                    showAllBtn.classList.remove("d-none");
                                } catch (err) {
                                    console.error("Failed to fetch nearby listings", err);
                                    alert("Could not fetch nearby listings.");
                                }
                            });
                        });

                        showAllBtn.addEventListener("click", () => {
                            showAllBtn.classList.add("d-none");
                            loadListings(); 
                        });
                    }
                }

                const navbar = document.querySelector(".navbar");
                if (greetname && navbar) {
                    const greetings = document.createElement('span');
                    greetings.className = "me-3 fw-semibold";

                    greetings.innerHTML = isPremium
                        ? `Hi ${greetname} <span class="badge bg-warning text-dark">⭐ Premium</span>`
                        : `Hi ${greetname}`;

                    navbar.prepend(greetings);
                }


                if (!payload.isPremium) {
                    const premiumBtn = document.getElementById("buyPremiumBtn");
                    if (premiumBtn) {
                        premiumBtn.classList.remove("d-none");

                        premiumBtn.addEventListener("click", async () => {
                            try {
                                const res = await axios.get(`${endpoint}/purchase/buypremium`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });

                                const { order, key_id } = res.data;

                                const options = {
                                    key: key_id,
                                    amount: order.amount,
                                    currency: "INR",
                                    name: "RoomMate Finder",
                                    description: "Premium Membership",
                                    order_id: order.id,
                                    handler: async function (response) {
                                        const res = await axios.post(`${endpoint}/purchase/updatepremiummembers`, {
                                            payment_id: response.razorpay_payment_id,
                                            order_id: response.razorpay_order_id
                                        }, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        if (res.data.newToken) {
                                            localStorage.setItem("token", res.data.newToken);
                                            alert("You are now a Premium user!");
                                            window.location.reload();
                                        }
                                    },
                                    theme: { color: "#F37254" }
                                };

                                const rzp = new Razorpay(options);
                                rzp.open();

                                rzp.on("payment.failed", async function () {
                                    await axios.post(`${endpoint}/purchase/updatepremiumuseronfailure`, {
                                        order_id: order.id
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });

                                    alert(" Payment Failed!");
                                });

                            } catch (err) {
                                console.error("Payment error:", err);
                                alert("Something went wrong while processing payment.");
                            }
                        });
                    }
                }
            }
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                });
            }

        } catch (err) {
            console.error("Failed to load navbar or token error:", err);
        }
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

        const payload = JSON.parse(atob(token.split('.')[1]));
        const isPremium = payload.isPremium;

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
      <div class='card h-100'>
      ${listing.imageUrl ? `<img src="${listing.imageUrl}" class="card-img-top" alt="Room Image">` : ''}
        <div class='card-body'>
          <h5 class='card-title'>${listing.title}</h5>
          <h6 class='card-subtitle text-muted'>${listing.city}</h6>
          <p class='card-text'>${listing.description}</p>
          <p><strong>Rent:</strong> ₹${listing.rent}</p>
          <p><strong>Available from:</strong> ${new Date(listing.availableFrom).toLocaleDateString()}</p>
          <p><strong>Preference:</strong> ${listing.genderPreference}, ${listing.roomType}</p>
          ${isPremium && listing.userId?.phone
                    ? `<p><strong>Contact:</strong> ${listing.userId.phone}</p>`
                    : `<button class="btn btn-outline-secondary btn-sm mt-2 contact-btn"
                     data-owner="${listing.userId?.email}" 
                     data-title="${listing.title}">
              Contact
             </button>`
                }
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
