# SmartExam 🎓
### Exam Hall Seat Allocation System

**SmartExam** is a secure, interactive, and responsive web application designed for academic administrators to manage exam hall seating arrangements. It helps prevent student malpractice by randomly shuffling the seat distribution and generates sorted administration reference sheets for easy invigilation.

---

## 🚀 Key Features

*   **🔒 Secure Admin Authentication**: Built-in auth guard with token-like session handling (expires after 8 hours). Includes toggleable password visibility and smooth loading indicators.
*   **📊 Interactive Admin Dashboard**: High-level statistics tracking total students, seats allocated, active departments, and recent actions.
*   **➕ Student Management**:
    *   Add individual students using roll numbers and dropdown department selections.
    *   **CSV Import**: Upload students in bulk using a simple `ROLLNO,DEPT` format.
    *   Real-time validations for duplicate entry prevention.
*   **🎲 Randomized Seat Allocation**:
    *   Uses the mathematically rigorous **Fisher-Yates Shuffle Algorithm** to randomly assign seats.
    *   Ensures a random mix of departments to deter exam malpractice.
    *   Generates a visual seating arrangement grid.
*   **📋 Sorted Collection Sheets**:
    *   Generates a printed signature/collection sheet sorted numerically and alphabetically by roll number.
    *   Print-friendly layout style sheet optimization for physical administration.
*   **💾 Local Persistence**: Entire state is saved in the browser's `localStorage` to avoid data loss on page reload.
*   **⚡ Modern UI/UX**: Premium aesthetics featuring clean grid backgrounds, CSS variables, glassmorphism, responsive design, custom toast notifications, and particle-based background animations.

---

## 🛠️ Technology Stack

*   **HTML5 & CSS3**: Semantically structured layout with custom modern CSS styling (custom variables, responsive grids, transitions, and animations).
*   **JavaScript (ES6)**: Vanilla JS logic handling state management, shuffling, and file processing without heavy framework overhead.
*   **Canvas API**: Dynamic interactive particle rendering on the login screen.
*   **Local Storage**: Client-side database simulation for persistence.

---

## 🧩 Core Algorithm: Fisher-Yates Shuffle

To ensure fairness and prevent collusion, SmartExam utilizes the **Fisher-Yates (Knuth) Shuffle Algorithm**. 

### How it works:
1. It starts from the last student in the array and swaps it with a randomly selected student from the remaining pool (including itself).
2. It moves one step backward in the array and repeats the random swapping process.
3. This runs in $O(n)$ time complexity and guarantees that all permutations of seat configurations are equally likely.

---

## 👥 Admin Credentials (for Testing)

You can log in to the dashboard using any of the following pre-configured admin accounts:

| Username | Unique Admin ID (Password) | Role / Department |
| :--- | :--- | :--- |
| `admin` | `ADMIN2024` | General Administrator |
| `principal` | `PRIN@001` | Principal Portal |
| `examcell` | `EXAM#2024` | Exam Cell Controller |
| `dr.kumar` | `KUMAR@99` | Faculty Coordinator |

---

## 📦 Getting Started

To run this project locally, simply follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sarveshhhh2007-svg/Smart-Exam-Seat-Allocation-System.git
   cd Smart-Exam-Seat-Allocation-System
   ```

2. **Open the application:**
   Double-click `login.html` (or open it with any modern web browser) to launch the login portal. No local server installation or build steps are required!

---

*Developed for Academic Administration Support © 2024*
