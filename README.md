# KhShop

A premium fashion e-commerce frontend built with **React**, **Vite**, **Tailwind CSS** and **React Router DOM**. The store sells **shoes**, **shirts** and **pants** with a modern, minimal, black-and-white aesthetic inspired by contemporary sports/fashion retail.

## Stack

- **React 18** + **Vite**
- **Tailwind CSS v3**
- **React Router DOM v6**
- **Axios** (API layer, prepared for a Laravel backend)
- **Lucide React** icons
- **Context API** for global state (Auth, Cart, Wishlist)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Project Structure

```
src/
├── components/   # Reusable UI, layout, home, product, cart, wishlist, checkout
├── pages/        # Route-level pages
├── context/      # Auth, Cart, Wishlist contexts
├── hooks/        # Custom hooks
├── services/     # Axios-based API services
├── routes/       # Route definitions
├── data/         # Mock data (products, categories, navigation)
└── utils/        # Helpers (price, date, validation, storage)
```

## API Setup

The frontend talks to a Laravel API through `src/services`. Set your backend base URL in `.env`:

```
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

While `VITE_USE_MOCK=true`, the app uses realistic local mock data so the UI works without a backend. Set it to `false` to use the live API.

## Features

- Responsive mobile-first layouts (desktop / tablet / mobile)
- Homepage with hero, categories, featured, new arrivals, promo, best sellers, newsletter
- Shop with filtering, sorting & view options
- Category, search & sale pages
- Product detail with gallery, size/color/quantity, reviews & related products
- Cart with mini-cart drawer
- Wishlist
- Auth (login, register, forgot password)
- User dashboard with profile, orders, order detail & addresses
- Multi-step checkout with order success page
- LocalStorage persistence for cart & wishlist
- Lazy-loaded routes, re-routed scroll-to-top and smooth animations
