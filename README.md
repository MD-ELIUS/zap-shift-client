# ZapShift 🚀
#### *Smart Logistics, Swift Delivery.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🎯 Project Overview
**ZapShift** is a high-performance, full-stack MERN parcel management system. It provides a seamless connection between users, delivery riders, and administrators to ensure that parcels are handled with care and delivered on time. The platform features real-time tracking, secure payments with Stripe, and distinct dashboards for different user roles.

**Live Demo:** [ZapShift Live](https://zap-shift-client-gamma.vercel.app)
**Client Repository:** [ZapShift Client](https://github.com/MD-ELIUS/zap-shift-client)
**Server Repository:** [ZapShift Server](https://github.com/MD-ELIUS/zap-shift-server)

## 🛠 Features

### General Features
- **Modern & Responsive UI:** Built with React, TailwindCSS, and DaisyUI for a premium aesthetic.
- **Robust Authentication:** Firebase-powered Auth supporting Email/Password and Google Social Login.
- **Role-Based Access (RBAC):** Distinct permissions and interfaces for Users, Riders, and Admins.
- **Secure Payments:** Integrated Stripe for safe and convenient delivery fee payments.
- **Dynamic Animations:** Interactive experience with Lottie animations and Framer Motion.
- **Smart Data Management:** Server-side search, filtering, and pagination using TanStack Query.
- **Real-Time Updates:** Profile and data synchronization across the entire application.

### User Dashboard
- **Parcel Booking:** Simple form to send parcels with automatic price calculation.
- **My Parcels:** Comprehensive list of booked parcels with status tracking.
- **Payment History:** Detailed log of all delivery transactions.
- **Profile Management:** Update personal information and profile picture instantly.

### Rider Dashboard
- **Delivery Management:** View and accept assigned deliveries.
- **Delivery Tracking:** Track parcels from pickup to delivery.
- **Performance Stats:** Monitor completed deliveries and earnings.
- **Profile Updates:** Manage rider-specific details and availability.

### Admin Dashboard
- **Analytics:** Data-rich statistics pages with Recharts (Bar/Pie charts).
- **User Management:** Promote/demote user roles and manage platform access.
- **Rider Approval:** Verify and approve new riders.
- **Parcel Overview:** Monitor all platform activities and assign riders to parcels.

## 💻 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, TailwindCSS, DaisyUI, Lottie |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | Firebase Auth (Email/Google) |
| **Payment** | Stripe API |
| **Deployment** | Vercel |

## 🗂 Database Schema (MongoDB)
### Users Collection
Stores user profiles, emails, photoURLs, and roles (`user`, `rider`, `admin`).
### Parcels Collection
Contains parcel details, sender/receiver info, pricing, status (`pending-pickup`, `driver_assigned`, `parcel_delivered`), and tracking IDs.
### Riders Collection
Stores rider-specific data, including regions, districts, and availability status.

## 🚀 NPM Packages Used
### Core
- `react-router`: For client-side navigation.
- `@tanstack/react-query`: For efficient server state management.
- `axios`: For making secure API requests.
- `firebase`: For authentication and real-time state.
- `stripe`: For handling secure payments.

### UI & UX
- `tailwindcss` & `daisyui`: For utility-first and component-based styling.
- `lottie-react`: For high-quality vector animations.
- `react-icons`: For a rich set of icons.
- `sweetalert2`: For professional dialogs and alerts.
- `recharts`: For interactive data visualization.
- `react-hook-form`: For performant and validated forms.

## ⚙️ Installation & Setup
### Backend
```bash
git clone https://github.com/MD-ELIUS/zap-shift-server.git
cd zap-shift-server
npm install
npm start
```
*Note: Ensure `.env` is configured with `DB_USER`, `DB_PASS`, `STRIPE_SECRET`, and `FIREBASE_ADMIN_CONFIG`.*

### Frontend
```bash
git clone https://github.com/MD-ELIUS/zap-shift-client.git
cd zap-shift-client
npm install
npm run dev
```
*Note: Ensure `.env` is configured with Firebase keys and `VITE_API_BASE_URL`.*

---
**ZapShift** – *Moving with Speed, Delivering with Care.*
