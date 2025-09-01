# MJKart — E‑Commerce Product Catalog (HTML/CSS/JS)

A professional, responsive Amazon/Flipkart‑inspired storefront with:
- 10 categories × 10 products (100+ items) auto‑generated with images
- Button‑triggered Search (results update only after clicking **Search**)
- Category pills, price/rating/brand filters, sorting, pagination
- View product modal with **Add to Cart** / **Buy Now**
- Cart drawer with quantity controls, totals, discounts; persists via localStorage
- Banner carousel & modern UI

## Run locally
1. Unzip the project.
2. Open `index.html` directly in a modern browser (Chrome/Edge/Firefox).
   - For best results, run a simple local server:
     - **VS Code**: Install the “Live Server” extension, then “Open with Live Server” on `index.html`.
     - **Python** (optional): `python -m http.server 8000` and open `http://localhost:8000`.
3. Everything is client‑side; no backend required.

## Customize
- **Add/Change Products**: Edit the `buildProducts()` function in `app.js` (brands, price ranges, etc.).
- **Images**: Uses picsum.photos seeded URLs; replace with your own CDN/product images.
- **UI**: Tweak colors, spacing, and layout in `styles.css`.
- **Features**: Extend filters, add wishlists, login flows, order history, etc.

Enjoy building 🚀
