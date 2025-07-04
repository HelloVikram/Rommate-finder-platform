🏠 Roommate Finder
A full-stack web app that helps users find roommates and room listings with filters and email contact features.
📌 Features
🔐 User authentication (Signup/Login using JWT)

🏘️ Create, view, update, delete own listings

🔎 Filter by city, rent, gender preference, room type

📄 Pagination with adjustable results per page

📬 Contact listing owner via email using Brevo (SendinBlue)

🖼️ Clean responsive UI with Bootstrap 5

🛠️ Tech Stack
Frontend:

HTML, CSS, Bootstrap 5

JavaScript (vanilla)

Axios for API calls

Backend:

Node.js, Express.js

MongoDB with Mongoose

JWT for Authentication

Brevo (SendinBlue) for email integration

🚀 Setup Instructions
Clone the repository

git clone https://github.com/your-username/roommate-finder.git
cd roommate-finder
Install dependencies


npm install
Set up environment variables
Create a .env file and add:

.env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
Start the server


node index.js
Visit in Browser
Go to http://localhost:3000/public/listings.html
