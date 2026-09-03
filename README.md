# 🏛️ E-CONNECT — E-Seva Digital Services Application & Facilitation Portal

A modern, full-stack, enterprise-grade E-Seva digital services application assistance desk portal built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **SQLite**.

![Portal Screenshot](https://econnect-portal.surge.sh/assets/banner.png)

## 🌟 Key Features

- 🆔 **Aadhaar Services Catalog (15 Sub-Services)**: Address update, Mobile linking, Name correction, PVC Smart Card, Photo/Biometric update, Document revalidation.
- 💳 **PAN Services Catalog (8 Core Services)**: Form 49A New PAN, Form 49AA Foreign PAN, Name/DOB Correction, PAN-Aadhaar Linking, Instant e-PAN PDF, Duplicate Physical Reprint, Minor to Major update, Active Status Verification.
- ⚡ **Full-Stack Monolith Server**: Single Express server (`server/index.js`) serving both REST API (`/api/*`) and static Vite React UI (`dist/`).
- 🛡️ **Protected Admin Cockpit**: Multi-tab management panel (`/admin`) for tracking citizen applications, status updates, remark notes, service categories, and platform settings.
- 🔍 **Real-Time Application Status Tracker**: Search applications by unique tracking ID (e.g., `ESV-2026-000001`) with timeline logs.
- 📜 **Legal Compliance Desk**: Section 272B PAN legal notice, Privacy Policy, Terms of Service, and Refund Policy.
- 📱 **100% Mobile Responsive**: Mobile navigation drawer, compact topbar, and flex-wrapped service cards for all screen sizes.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Unified Monolith Server (Frontend + Backend on Port 5000)
```bash
# Build React static bundle
npm run build

# Start Express Monolith Server
node server/index.js
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 🔑 Default Credentials

- **Admin Login**: `admin@eseva.gov.in` | Password: `AdminSecret123`
- **User Login**: `user@eseva.gov.in` | Password: `Password123`

---

## 🌐 Live Hosting Links

- 🏠 **Surge Portal**: [https://econnect-portal.surge.sh](https://econnect-portal.surge.sh)
- 🚀 **1-Click Vercel Deploy**: [Deploy on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuryasuryaa239%2Fecoonect)

---

## 📂 Project Structure

```text
econnect/
├── api/                  # Vercel Serverless Function entry point (api/index.js)
├── server/               # Express Node.js Server & Database Engine
│   ├── database/         # SQLite DB & initial seed data
│   ├── uploads/          # Uploaded document files
│   └── index.js          # Main Express server entry
├── src/                  # React Vite Frontend Application
│   ├── components/       # Reusable UI components (Navbar, TopBar, Footer, etc.)
│   ├── context/          # Auth & Toast context providers
│   ├── pages/            # Application routes & service catalogs
│   ├── App.jsx           # Main router & app container
│   └── index.css         # Tailwind & global design tokens
├── vercel.json           # Vercel SPA + API rewrites config
└── vite.config.js        # Vite build & proxy settings
```

---

## 📄 License
Licensed under the [MIT License](LICENSE).
