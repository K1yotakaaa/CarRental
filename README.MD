# CarRental Backend – Django REST API

This repository contains the backend API for the CarRental platform. The system provides a RESTful service for managing users, dealers, and cars, including authentication, authorization, and media uploads.

The backend is implemented using **Django**, **Django REST Framework**, and **JWT authentication** via `rest_framework_simplejwt`.

---

## ⭐ 1. Features Overview

- User registration, JWT login, token refresh
- Role-based permissions (basic, dealer, admin)
- Dealer management (CRUD – admin only)
- Car management (CRUD – dealers & admins; anyone can read)
- Search, filtering, and ordering for cars
- Image upload support (`ImageField`)
- Pagination, validation, and secure model permissions

---

## 🧰 2. Tech Stack

<p align="left"> 
  <img src="https://img.shields.io/badge/Python-3776AB?style=plastic&logo=python&logoColor=white"/> 
  <img src="https://img.shields.io/badge/Django-092E20?style=plastic&logo=django&logoColor=white"/> 
  <img src="https://img.shields.io/badge/Django_REST_Framework-ff1709?style=plastic&logo=django&logoColor=white"/> 
  <img src="https://img.shields.io/badge/JWT-black?style=plastic&logo=jsonwebtokens"/> 
  <img src="https://img.shields.io/badge/django--filter-0A7BBB?style=plastic&logo=django&logoColor=white"/> 
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=plastic&logo=postgresql&logoColor=white"/> 
</p>  

---

## 📁 3. Project Structure (Simplified)

CarRental/
├── cars/
├── dealers/
├── users/
├── CarRental/ (main project)
├── media/ (uploaded files)
└── requirements.txt

---

## ⚙️ 4. Installation & Setup

### Clone repository
```bash
git clone https://github.com/K1yotakaaa/CarRental.git
cd CarRental
```

### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate
```

### Install dependencies
```bash
pip install -r requirements.txt

```

### Apply migrations
```bash
python manage.py migrate

```

### Run development server
```bash
python manage.py runserver

```

---

## 🔐 5. Authentication Model

The backend uses JWT authentication, with endpoints for login and token refresh.

Tokens must be sent as:
```
Authorization: Bearer <access_token>
```

### 👥 User Roles
| Role   | Description                                 | Icon  |
| ------ | ------------------------------------------- | ----- |
| basic  | Regular user with read-only access          | 🙍    |
| dealer | Can create/update/delete **their own** cars | 🧑‍🔧 |
| admin  | Full access, including dealer management    | 👑    |

---

## 🔒 6. Permission Rules

**🏢 Dealers**

- Public read access
- Only admin users can create, update, or delete dealers

**🚘 Cars**

- Public read access
- Dealer users can create cars and edit/delete only the cars they created
- Admin users can modify any car

**👤 Users**

- Registration is open
- Only authenticated users can read/update their own profile or upload an avatar

---

## 7. API Endpoints

All backend APIs follow this base prefix:
```
/api/
```

### 7.1 Authentication Endpoints

| Method | Endpoint          | Description                      | Auth Required |
| ------ | ----------------- | -------------------------------- | ------------- |
| POST   | `/register/`      | Register new user (role = basic) | No            |
| POST   | `/login/`         | Obtain JWT tokens                | No            |
| POST   | `/token/refresh/` | Refresh access token             | No            |
| GET    | `/me/`            | Get authenticated user's profile | Yes           |
| PUT    | `/me/`            | Update profile                   | Yes           |
| PATCH  | `/me/`            | Upload/update avatar             | Yes           |

- Example: Login Request
```
{
  "email": "user@example.com",
  "password": "password123!"
}
```

### 7.2 Dealer Endpoints
- Base: /api/dealers/

| Method | Endpoint             | Description      | Permissions |
| ------ | -------------------- | ---------------- | ----------- |
| GET    | `/api/dealers/`      | List all dealers | Public      |
| POST   | `/api/dealers/`      | Create dealer    | Admin only  |
| GET    | `/api/dealers/{id}/` | Retrieve dealer  | Public      |
| PUT    | `/api/dealers/{id}/` | Update dealer    | Admin only  |
| PATCH  | `/api/dealers/{id}/` | Partial update   | Admin only  |
| DELETE | `/api/dealers/{id}/` | Delete dealer    | Admin only  |

### 7.3 Car Endpoints
- Base: /api/cars/

| Method | Endpoint          | Description    | Permissions           |
| ------ | ----------------- | -------------- | --------------------- |
| GET    | `/api/cars/`      | List all cars  | Public                |
| POST   | `/api/cars/`      | Create a car   | Dealer/Admin          |
| GET    | `/api/cars/{id}/` | Retrieve a car | Public                |
| PUT    | `/api/cars/{id}/` | Update a car   | Owner Dealer or Admin |
| PATCH  | `/api/cars/{id}/` | Partial update | Owner Dealer or Admin |
| DELETE | `/api/cars/{id}/` | Delete a car   | Owner Dealer or Admin |
