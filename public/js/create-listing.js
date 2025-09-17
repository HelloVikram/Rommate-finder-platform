const endpoint = `http://localhost:3000`;
const listingform = document.querySelector('#listingForm');

listingform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const formData = new FormData();
        formData.append('title', document.getElementById("title").value);
        formData.append('description', document.getElementById("description").value);
        formData.append('city', document.getElementById("city").value);
        formData.append('rent', document.getElementById("rent").value);
        formData.append('availableFrom', document.getElementById("availableFrom").value);
        formData.append('genderPreference', document.getElementById("genderPreference").value);
        formData.append('roomType', document.getElementById("roomType").value);
        formData.append('latitude', lat);      
        formData.append('longitude', lng);      

        const imageUrl = document.getElementById('image');
        if (imageUrl.files.length > 0) {
            formData.append('image', imageUrl.files[0]);
        }

        try {
            const response = await axios.post(`${endpoint}/create/listing`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Listing created successfully!');
            window.location.href = "listings.html";
        } catch (err) {
            alert('Something went wrong!');
            console.log("Error in create listing!", err);
        }
    }, function (error) {
        console.error("Geolocation error:", error);
        alert("Could not fetch location. Please allow location access.");
    });
});
