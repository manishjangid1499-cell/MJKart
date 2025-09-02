🛒 MJKart — E-Commerce Product Catalog (HTML/CSS/JS)

📌 Project Overview
MJKart is a responsive Amazon/Flipkart-inspired storefront built using HTML, CSS, and JavaScript.
It provides a clean UI with 100+ products, advanced filters, cart system, and a product showcase — all running client-side with no backend required.

🚀 Features

📦 10 categories × 10 products (100+ items) auto-generated with images

🔍 Button-triggered search functionality

🏷️ Category pills with price, rating, and brand filters

↕️ Sorting & Pagination for easy browsing

🛍️ Product modal with Add to Cart / Buy Now

🛒 Cart drawer with quantity controls, totals, discounts (localStorage persistence)

🎠 Banner carousel & modern responsive UI

🛠 Tech Stack

HTML5

CSS3 (Responsive Design, Modern UI)

JavaScript (ES6)

📂 Project Structure
MJKart/
 ├── index.html         # Main entry point
 ├── styles.css         # Styling and layout
 ├── app.js             # Core functionality (products, cart, filters)
 ├── assets/            # (Optional) Images, icons, or custom media
 └── README.md          # Project documentation

⚙️ Setup Instructions
Run Locally

Unzip the project.

Open index.html in a modern browser (Chrome/Edge/Firefox).

👉 For best results, run on a local server:

VS Code → Install Live Server → Right-click index.html → Open with Live Server

Python (optional):

python -m http.server 8000


Open http://localhost:8000

💡 Everything is client-side; no backend required.

🎯 Usage

Browse products by category

Apply filters (price, rating, brand)

Search products (click "Search" to update results)

Open product details → Add to Cart / Buy Now

View cart with live totals, discounts, and persistence

🎨 Customization

🛍️ Products → Edit buildProducts() in app.js (brands, prices, categories)

🖼️ Images → Uses picsum.photos
; replace with your own CDN/product images

🎨 UI → Modify styles.css for colors, spacing, and layout

🔧 Extend Features → Add wishlists, login, order history, etc.

👤 Author

Developed by Manish Jangid 
