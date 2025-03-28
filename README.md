# Machine Test for MERN Stack Developer

This is a MERN stack project with full CRUD functionality and role-based authentication. It includes a backend built with Express.js, MongoDB for the database, and a frontend using React.js.

## Features
- **Role-based authentication** (Admin and Agent)
- **Agent management** (Create, update, delete)
- **Task distribution** (Create, assign tasks to agents)
- **CSV/XLSX file upload** for task distribution
- **Admin panel** with a user-friendly dashboard

## Prerequisites

Before running the application, ensure the following are installed:
- **Node.js** (>= 14.x)
- **MongoDB** (or use a cloud instance like MongoDB Atlas)

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/Shaikr786/Machine-Test-for-Mern-Stack.git
cd Machine-Test-for-Mern-Stack
```

### 2. Set up Environment Variables

Create a `.env` file in the `backend` folder with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Install dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### 4. Run the Application

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm start
```

## API Documentation

### Authentication
- **POST /api/auth/register**: Register a new user (Admin/Agent).
- **POST /api/auth/login**: Login with email and password.

### Agent Management
- **GET /api/agents**: Get all agents.
- **POST /api/agents**: Create a new agent.
- **PUT /api/agents/:id**: Update agent details.
- **DELETE /api/agents/:id**: Delete an agent.

### Task Management
- **GET /api/tasks**: Get all tasks.
- **POST /api/tasks**: Create a new task.
- **PUT /api/tasks/:id**: Update task details.
- **DELETE /api/tasks/:id**: Delete a task.

## Demo Video & Deployment

- **Demo Video:** [Watch here](https://youtu.be/MujxtF0s--M)
- **Live Deployment:** [View here](https://machine-test-for-mern-stack.vercel.app/)

## Conclusion

By implementing a clean and scalable codebase, the goal was to ensure maintainability and flexibility for future enhancements. The use of Vite for the frontend optimizes the development process, providing faster performance and a better development experience. Overall, the project exemplifies a practical approach to full-stack development with a focus on clear architecture and efficient workflows.


