# 🎫 Event Booking Microservices System

## 📘 Overview

The **Event System Application** is a microservices-based platform that enables users to **register, browse, and book events**, while providing **admins** full control to **create, modify, and manage** events and bookings. Each service is **modular**, **independently deployable**, and routed through a centralized **API Gateway**.

---

## 🚀 Features

- 🔐 **User Authentication** – Secure registration and login for users and admins using JWT.
- 📅 **Event Creation & Management** – Admins can create, update, and delete events.
- 🎟️ **Event Booking** – Users can register for events and view their bookings.
- 🛠️ **Admin Panel Access** – Admins can manage all bookings and events.
- 📡 **Microservices Architecture** – Decoupled services for scalability and maintainability.
- 🔄 **API Gateway** – Centralized routing, authentication, and role-based access control.

---

## 🧰 Tech Stack

| Layer         | Technology                            |
|---------------|----------------------------------------|
| Frontend      | Postman (for testing APIs)             |
| Backend       | Node.js, Express.js                    |
| Database      | MongoDB                                |
| Auth          | JWT (JSON Web Tokens)                  |
| DevOps/Infra  | Docker, AWS, Kubernetes (Minikube)     |

---
## 🧱 Microservices Architecture

![Microservices Architecture Diagram](/images/Diagram.png)

---

## 🛠️ Microservices Breakdown

### 🔐 Authentication Microservice

Handles login and registration for both users and admins.

| Endpoint         | Method | Description               |
|------------------|--------|---------------------------|
| `/auth/register` | POST   | Register a new user       |
| `/auth/login`    | POST   | Login for user or admin   |

> Distinguishes roles via JWT payload (`role: "admin"` or `"user"`)

---

### 🎟️ Booking Event Microservice

Allows users to book and view tickets, and admins to view all bookings.

| Endpoint                      | Method | Description                    |
|-------------------------------|--------|--------------------------------|
| `/booking/book`               | POST   | Book a ticket for an event     |
| `/booking/my-tickets`         | GET    | View user’s booked tickets     |
| `/booking/admin/all-bookings` | GET    | View all bookings (admin only) |

---

### ✏️ Modify & Delete Event Microservice

Allows admins to update or delete events.

| Endpoint                          | Method | Description         |
|-----------------------------------|--------|---------------------|
| `/event/manage/edit/:eventId`     | PUT    | Edit event details  |
| `/event/manage/delete/:eventId`   | DELETE | Delete an event     |

---

### 📢 Event Service

Admins can create events. All users can view listings and detailed info.

| Endpoint                       | Method | Description                           |
|--------------------------------|--------|---------------------------------------|
| `/events/create`               | POST   | Create a new event (admin only)       |
| `/events/all`                  | GET    | List all available events             |
| `/events/details/:eventId`     | GET    | Get detailed info (role-based view)   |

---

## 🌐 API Gateway

The API Gateway routes all HTTP requests to their corresponding microservices. It also handles:

- ✅ Token verification (JWT)
- 🛡️ Role-based access control
- 🔄 Centralized routing and reverse proxy
- 🚧 Centralized error and access logging

### 🔁 Gateway Route Mapping

| Route Prefix        | Microservice                  | Purpose                       |
|---------------------|-------------------------------|-------------------------------|
| `/auth/*`           | Authentication Service        | Login & Registration          |
| `/booking/*`        | Booking Service               | Ticket booking functionality  |
| `/event/manage/*`   | Modify/Delete Event Service   | Admin: Edit & delete events   |
| `/events/*`         | Event Service                 | View & create events          |
