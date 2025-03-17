# TCSA Web Application

This is the web application for the Terfer Chinese Student Association. The project consists of a React frontend and Django backend.

## Setup Instructions

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

#### Key Frontend Dependencies
- React v19
- Material-UI (MUI) v6
  - @mui/material
  - @mui/icons-material
  - @emotion/react
  - @emotion/styled
- React Router v7
- Axios for API requests
- Vite as build tool

### Backend Setup (Django)

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

#### Key Backend Dependencies
- Django 5.0.2
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1
- PostgreSQL adapter (psycopg2-binary)
- Testing tools (pytest, pytest-django)

## Development

- Frontend code is in the `frontend/src` directory
  - React components in `src/components`
  - MUI theme customization in `src/theme`
  - Page components in `src/pages`
- Backend code is in the `backend` directory
  - API endpoints are defined in `backend/api`
  - Database models in `backend/models`

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

