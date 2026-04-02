# Buyer Portal



## 1. How to Run the App (Development Server)

To run the application locally without Docker, you will need Node.js and PostgreSQL installed on your machine.

### Prerequisites
- Node.js (v18+)
- PostgreSQL database running locally

### Environment Setup
Create a `.env` file in the `server` directory (`server/.env`) with the following credentials:

```bash
# server/.env
PORT=8000
DB_USER=postgres
DB_PASSWORD=your_local_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buyer_portal
JWT_SECRET=supersecretdevkey
```

*(You don't strictly need a `.env` file in the `frontend` directory for local dev because Vite automatically proxies `/api` requests to `http://localhost:8000`.)*

### Running the Servers

**1. Setup the Database**
Execute the SQL script located in `server/src/config/init.sql` to create the necessary tables and `server/src/config/seed.sql` to seed the database with sample data against your local PostgreSQL instance.

**2. Start the Backend**
```bash
cd server
npm install
npm run dev
```

**3. Start the Frontend**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 2. How to Run with Docker (Containers)

Deploying with Docker Compose encapsulates the database into neatly coordinated containers.

### Environment Setup
For Docker Compose, the database relies on a root environment file.

**1. Root Environment (`.env`)**
Create a `.env` file in the root directory to define the PostgreSQL credentials used by the `db` container in `compose.yml`.
```bash
# .env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=buyer_portal
```

**2. Server Environment (`server/.env`)**
This needs to point to the dockerized database service (named `db`).

```bash
# server/.env
PORT=8000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
DB_NAME=buyer_portal
JWT_SECRET=supersecretdockerkey
```

**2. Frontend Environment (`frontend/.env`)**
The multi-stage Docker build expects this variable to configure the API base URL. Because Nginx is configured to reverse-proxy `/api` to the `server` container, we just need to ensure the standard prefix is used.
```bash
# frontend/.env
VITE_API_URL_DOCKER=/api
```

### Running the Containers
From the root directory of the project, simply run:
```bash
docker compose up --build -d
```
Access the application at `http://localhost:3000`.

*(Note: On the very first run, you will still need to execute the `server/src/config/seed.sql` script inside the deployed Postgres container to seed the properties).*

---

## 3. Example Flows

### Flow 1: Account Creation & Onboarding
1. Navigate to the application (e.g. `http://localhost:3000`). You will be automatically redirected to the `/login` page.
2. Click **"Don't have an account? Register"** at the bottom of the form.
3. Fill out the "Full Name", "Email", and "Password" fields.
4. Click **Sign Up**. A success message will appear.
5. Click **"Already have an account? Login"** and enter your newly created credentials.
6. Click **Login**. You will be navigated to your Dashboard.

### Flow 2: Saving Favorites
1. Once on the **Dashboard**, scroll down to the **"Explore Property"** section.
2. Look through the available properties and find one you like.
3. Click the **Heart Icon (❤️)** on the bottom right of the property card. 
4. The heart will fill with color, and the property will instantly appear in the **"My Favourites"** section at the top of the page.
5. The application will quietly sync this change to the backend in the background so it is saved for your next visit.

### Flow 3: Returning User
1. Close the browser tab or refresh the page.
2. If your session is still valid (tokens last 3 days), you will bypass the login screen and go straight to the Dashboard.
3. Upon loading, your previously saved properties will automatically populate in the **"My Favourites"** section.
