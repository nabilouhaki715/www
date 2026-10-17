# StickZone website

This is a self-contained responsive storefront. Open `index.html` in any modern browser; no installation is required.

## Editing the shop

- **Logo:** `assets/images/stickzone-logo.png` is shown in the header and footer. The category logos are in `assets/images/categories/`.
- **Products and photos:** all supplied models are already in `assets/images/products/`. The grouped product setup is at the top of `app.js`.
- **New models:** the latest Green Boys, Eagles, and Designed models are included with names beginning `new-` in their respective product folders.
- **Anime and Moto category logos:** `assets/images/categories/anime-logo.png` and `assets/images/categories/moto-logo.jpg` are used on the collection cards.
- **Landscape display:** product images use `object-fit: contain` in `custom.css`, so the whole model is visible on portrait and landscape screens.
- **Price:** every model is currently set to `price:15` in `app.js`.
- **Delivery:** Casablanca costs 10 DH; any other city costs 25 DH. Customers choose this directly in the cart, where the total updates before checkout.
- **Category cards:** the cards are in `index.html` under `collection-grid`. Each one has a `data-category` name that opens the right product models.
- **Business contact links:** WhatsApp, email and Instagram are already configured in `index.html`.
- **Orders:** submitted checkout orders are saved in the browser's local storage under `stickzone-orders`. This makes the prototype immediately usable, but a live shop needs a backend/database (or Shopify, WooCommerce, Supabase, etc.) to receive orders centrally.
- **Order dashboard:** open `admin.html` in the same browser to view locally saved orders and update their status. It is a frontend admin starting point, not a secure production admin system.

## Included flows

- Product filtering and add-to-cart
- Cart quantities, subtotal and persistence after browser refresh
- Cash-on-delivery checkout: name, phone, city, address, Google Maps location field, delivery date and time
- Personalized order file selector and notes form; custom requests now appear in `admin.html` with their file name and notes
- Responsive mobile menu and layout
