# Online Examination System

Online Examination System is a web application developed using the MERN stack. 
The system allows students to take online exams and allows administrators to 
manage students, exams, questions and results.

The project also includes browser-based anti-cheating features to monitor 
suspicious activities during an exam.

## Features

### Student
- Student login
- View available exams
- Attend online exams
- Exam timer
- Previous and next question navigation
- Submit exam
- Automatic submission when time is completed
- View exam results

### Admin
- Admin login
- Admin dashboard
- Manage students
- Create and manage exams
- Manage questions
- View exam results
- View student violation records

### Anti-Cheating Features
- Tab switch detection
- Fullscreen monitoring
- Window minimize/blur detection
- Copy and paste restriction
- Right-click restriction
- Developer tool shortcut blocking
- Refresh warning
- Back button prevention
- Violation warnings
- Activity logging

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT
- bcryptjs

## Project Structure

```text
Online-Examination-System
│
├── client
│   └── React frontend
│
├── server
│   └── Node.js / Express backend
│
└── README.md
```

## Installation

Clone the repository and install the required dependencies.

### Client

```bash
cd client
npm install
npm start
```

### Server

```bash
cd server
npm install
npm start
```

Create a `.env` file inside the server folder and add the required environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Purpose

The main purpose of this project is to provide an online examination platform 
with lightweight browser-based anti-cheating techniques without requiring 
camera or microphone monitoring.

## Developer

Developed by **AneHitTech**