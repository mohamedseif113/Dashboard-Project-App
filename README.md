# Project Dashboard Web App

A **feature-rich Project Management Dashboard** built with **Next.js**, **TypeScript**, and **TailwindCSS**.  
This app allows teams to manage projects, tasks, and progress efficiently — featuring **real-time updates**, **role-based access**, and a modern responsive UI.

---

## Features Overview

### Authentication & Role Management
- Secure **JWT-based login system**.
- Supports multiple user roles:
  - **Admin** – Full access to all features.
  - **Project Manager** – Manage projects, tasks, and team members.
  - **Developer** – View assigned projects and update task progress.
- Role-based access control (RBAC) to ensure feature visibility per user role.

---

### Dashboard Page
- Displays all projects with:
  - **Pagination, sorting, and advanced filtering**
  - Columns: `Name`, `Status`, `Start Date`, `End Date`, `Progress`, `Budget`
- **Inline editing** for quick data updates directly in the table.

---

### Project Details Page
- View detailed information about a specific project.
- **Task list management**: add, edit, or bulk update tasks.
- **Real-time updates** via **WebSockets** or **SignalR**, ensuring all users see changes instantly.

---

### Search & Advanced Filtering
- Global search by project name.
- Advanced filtering by:
  - **Status**
  - **Priority**
  - **Assigned user**

---

### UI & Best Practices
- Fully **responsive** and **mobile-friendly** design.
- **Accessibility** (WCAG-compliant).
- **Form validation** with `react-hook-form` 
- Smooth **skeleton loaders** for better UX.
- **Optimistic updates** for instant UI feedback.

---

### Optional Bonus Features
- **PWA (Progressive Web App)** support with offline caching.
- **Interactive charts** using `Recharts` 

---

## Tech Stack

- **Next.js** (App Direct Folder)
- **React** (Latest)
- **TypeScript**
- **TailwindCSS + ShadCN UI**
- **SWR**
- **Redux Toolkit**
- **Socket.IO** (for real-time updates)
- **JWT Authentication**
