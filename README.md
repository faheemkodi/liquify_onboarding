# Liquify Onboarding

A modern onboarding platform for business accounts, built with **Django REST Framework** (backend) and **React + Vite + TailwindCSS** (frontend).

---

## Features
- User registration, login, and logout
- Application status dashboard
- Document re-upload on pushback
- Modular, maintainable codebase
- Accessible, minimal UI

---

## Tech Stack
| Layer      | Tech                               |
|------------|------------------------------------|
| Frontend   | React (Vite), TailwindCSS, Axios   |
| Backend    | Django REST Framework, SQLite      |
| Validation | OpenCV + PIL for image checks      |

---

## Project Structure
```
backend/   # Django backend (APIs, business logic)
frontend/  # React frontend (UI)
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd liquify_onboarding
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver localhost:8000
```
- Access API at: http://localhost:8000/

### 3. Frontend Setup (React)
```bash
cd ../frontend
npm install
npm run dev
```
- Access frontend at: http://localhost:5173/

---

## API Endpoints (Summary)
- `POST /api/users/signup/` – Register
- `POST /api/users/login/` – Login
- `POST /api/users/logout/` – Logout
- `GET /api/applications/me/` – Get application details
- `POST /api/applications/me/reupload/` – Re-upload documents
- `/admin/` – Django admin

---

## Admin Pushback Flow

- Visit [`/admin/`](http://localhost:8000/admin/) and login with your superuser credentials.
- Under **Applications**, review submitted applications. For each application, you’ll see:
  - A list of all uploaded documents, each with a link to view.
  - The overall application status (Pending, Approved, Rejected, Pushback).
  - Any pushback reasons set on individual documents.
- If the uploaded document is invalid:
  - Set **Status** to `Pushback`
  - Enter a clear **Pushback Reason**, e.g.:
    ```
    Please upload a valid Certificate of Incorporation. The current file is either unclear or does not meet requirements.
    ```
  - Save.

The user will then see this reason on their dashboard and will be prompted to upload a corrected document.

## Development Notes
- Uses Django’s built-in user model and authentication
- Email field has been added to the signup form to facilitate easy integration with the in-built Django User model
- Document uploads are validated for:
  - **File type** (PDF, JPG, PNG only)
  - **File size** (max 5MB)
  - **Image resolution** (min 100x100px)
  - **Image blurriness** (using OpenCV Laplacian variance; blurry images are rejected)
- <strong>Document Type Validation:</strong> To ensure only the correct document type is uploaded (e.g., incorporation certificate, not a bank statement), document classification logic such as filename checks, template/text matching, or ML-based document type detection can be implemented.
- <strong>Multi-Document Extensibility:</strong> The system is designed to easily support multiple document types in future onboarding flows.
  - Backend: Uses an ApplicationDocument model which allows adding new document types without changing core logic. Each document stores its type and file. An overall_status field on the Application model aggregates these to indicate the highest required user action (e.g., if any document is Pushback, the whole application shows as Pushback until resolved).
  - Frontend: The dashboard automatically loops over whatever documents the API sends. Each document gets its own upload box and status, so adding more document types is just a matter of adding them in the backend, and the frontend will show them without any extra code.


---

## License
MIT