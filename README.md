# 🏥 PharmaCare - Pharmacy Record System

> A comprehensive, easy-to-use Pharmacy Record Management System designed to streamline store operations, inventory tracking, and sales.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [⚙️ Installation & Setup](#-installation--setup)
- [📖 Usage Guide](#-usage-guide)
- [📸 Screenshots](#-screenshots)
- [📂 Project Structure](#-project-structure)
- [🔌 API Documentation](#-api-documentation)
- [📄 License](#-license)

---

## 🔍 Overview

**PharmaCare** offers a complete solution for small to medium-sized pharmacies. It allows staff to manage medicines, track stock levels in real-time, process sales quickly, and generate insightful business reports—all from a single, intuitive dashboard.

---

## ✨ Key Features

### 📊 Dashboard
- **Real-time Overview**: Instantly view total medicines, low stock alerts, and daily sales stats.
- **Smart Alerts**: Visual indicators and notifications for expiring medicines and low inventory.

### 💊 Medicine Management
- **Centralized Inventory**: Create, read, update, and delete medicine records.
- **Advanced Search**: Filter by category (Tablet, Syrup, Injection) or search by name.
- **Detailed Tracking**: Keep tabs on batch numbers, prices, and expiry dates.

### 🛒 Sales Point (POS)
- **Fast Billing**: Integrated shopping cart for quick checkout.
- **Auto-Calculations**: Automatic tax, discount, and total amount calculations.
- **Stock Sync**: Inventory is automatically updated after every sale.

### 📈 Reports & Analytics
- **Sales Insights**: Generate reports for custom date ranges.
- **Expiry Tracking**: "First Expiring, First Out" alerts to reduce wastage.
- **Stock Levels**: Detailed reports on current inventory status.

### 👥 User Roles
- **Admin & Staff**: Secure login with Role-Based Access Control (RBAC).

---

## 🛠️ Technology Stack

Built with modern, lightweight, and efficient tools.

### Frontend
-   ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) **HTML5**: Semantic structure.
-   ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) **CSS3**: Responsive Flexbox/Grid layouts.
-   ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **Vanilla JS (ES6+)**: Modular application logic.
-   **Google Fonts**: *Inter* typeface for optimal readability.

### Backend
-   ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) **Node.js**: Runtime environment.
-   ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) **Express.js**: Web server framework.
-   **File System (FS)**: Custom JSON-based database engine (No SQL/NoSQL required).
-   **Bcrypt**: Security & password hashing.

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/pharmacare.git
    cd pharmacare
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Server**
    ```bash
    npm start
    # OR
    node server.js
    ```

4.  **Launch Application**
    Open your browser and visit: `http://localhost:3000`

---

## 📖 Usage Guide

### 🔐 Default Login
| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

### 🚀 Getting Started
1. **Log in** with the credentials above.
2. You will be directed to the **Dashboard** to see an overview of your store.

### 📦 Managing Inventory
1. Navigation: Go to **Medicines**.
2. **Add**: Click `+ Add Medicine`, fill in the form (Name, Batch, Expiry, etc.), and Save.
3. **Update Stock**: Use the **Stock** page to receive new shipments.

### 💸 Processing Sales
1. Navigation: Go to **Sales**.
2. Click `+ New Sale` or the **Cart Icon**.
3. Select items, adjust quantities, applies discounts, and click **Complete Sale**.

---

## 📸 Screenshots

To help you visualize the application, place your screenshots in the `images/screenshots/` folder with the filenames below.

| Dashboard | Medicine List |
|-----------|---------------|
| ![Dashboard](images/screenshots/dashboard.png) | ![Medicines](images/screenshots/medicines.png) |
| **Sales Interface** | **Reports** |
| ![Sales](images/screenshots/sales.png) | ![Reports](images/screenshots/reports.png) |

---

## 📂 Project Structure

```text
project/
├── 📁 css/                 # Global styles and themes
├── 📁 js/                  # Application modules (ES6)
│   ├── app.js              # Entry point
│   ├── auth.js             # Login/Logout handling
│   ├── db.js               # Data abstraction layer
│   └── ...                 # Feature-specific modules
├── 📁 images/              # Assets and icons
├── 📁 node_modules/        # Vendor dependencies
├── ⚙️ server.js            # Express application server
├── 🗄️ database.js          # Low-level file DB logic
├── 📄 pharmacy_data.json   # Actual data storage (JSON DB)
├── 📄 index.html           # Main SPA container
└── 📄 package.json         # Project manifests
```

---

## 🔌 API Documentation

The backend exposes a REST API at `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate user |
| `GET`  | `/api/medicines` | Retrieve medicine list |
| `POST` | `/api/sales` | Create a new transaction |
| `GET`  | `/api/reports/dashboard` | Fetch dashboard statistics |

---

## 📄 License

This project is open-source and available for educational purposes.
