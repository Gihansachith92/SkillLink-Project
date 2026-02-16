# 🎓 SkillLink - Student Peer-to-Peer Learning Platform

![Java](https://img.shields.io/badge/Java-17-orange) 
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green) 
![Angular](https://img.shields.io/badge/Angular-17-red) 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

**SkillLink** is a full-stack web application designed to solve the "Skill Gap" in universities. It connects students who want to learn a skill (e.g., *Java*) with peers who can teach it, facilitating a campus-wide knowledge exchange.

---

## 🚀 Key Features
* **Smart Matching Algorithm:** Automatically pairs users based on "Teach" vs. "Learn" tag compatibility using SQL relational queries.
* **Secure Authentication:** JWT (JSON Web Token) based login and signup system with BCrypt password hashing.
* **Real-time Dashboard:** Angular-based reactive UI showing live match recommendations.
* **Profile Management:** Students can manage their skill portfolio (Add/Remove tags).

## 🛠️ Tech Stack

### Backend (API)
* **Framework:** Spring Boot 3.2 (Java 17)
* **Database:** PostgreSQL (Relation mapping with Spring Data JPA)
* **Security:** Spring Security + JWT
* **Documentation:** Swagger / OpenAPI

### Frontend (Client)
* **Framework:** Angular 17+
* **Styling:** Angular Material & Tailwind CSS
* **State Management:** RxJS (Observables)
* **HTTP Client:** Angular Common HTTP

---

## ⚙️ Installation & Setup

### Prerequisites
* Java JDK 17+
* Node.js (v18+)
* PostgreSQL installed locally or a cloud instance (e.g., Neon.tech)

### 1. Clone the Repo
```bash
git clone [https://github.com/Gihansachith92/skill-link.git](https://github.com/Gihansachith92/skill-link.git)
cd skill-link
