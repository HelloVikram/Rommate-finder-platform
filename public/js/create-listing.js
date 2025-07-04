const endpoint=`http://localhost:3000`
const listingform = document.querySelector('#listingForm');

listingform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const city = document.getElementById("city").value;
    const rent = document.getElementById("rent").value;
    const availableFrom = document.getElementById("availableFrom").value;
    const genderPreference = document.getElementById("genderPreference").value;
    const roomType = document.getElementById("roomType").value;
    
    try {
        const response = await axios.post(`${endpoint}/create/listing`, {
            title,
            description,
            city,
            rent,
            availableFrom,
            genderPreference,
            roomType
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        alert('Successfull!');
    } catch (err) {
        alert('Something went wrong!')
        console.log("Error in create listing!", err);
    }

})