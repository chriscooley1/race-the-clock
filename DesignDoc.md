# Race The Clock - Design Document

## 1. Project Overview

Race The Clock is an innovative, web-based learning tool designed to help students of all ages improve their recognition and recall skills across various subjects. The project originated as a solution for kindergarten teachers to help students achieve the goal of reading 60 letters per minute. However, it has evolved into a versatile platform catering to learners of all ages and subjects.

Key Features:
- Custom collection creation for teachers and learners
- Adjustable speed settings for personalized learning experiences
- Fullscreen, timed practice sessions
- Sharing capabilities for collections
- Themes and color customization options, including options for different age groups
- Support for various content types: letters, numbers, words, images, and more
- Flashcards creation and study
- Stages for mastery: beginner, intermediate, and advanced levels
- Interactive elements such as animations, sounds, and feedback to reinforce learning
- Image verification to maintain a safe learning environment
- Matching games for enhanced engagement
- Session reports that can be attached to individual students
- Potential for gamification and competitive features (badges, achievements)

Tech Stack:
- Backend: Python with FastAPI, SQLModel, and Alembic
- Frontend: React with TypeScript
- Database: PostgreSQL
- Authentication: Auth0
- Deployment: Railway for production variables

Target Audience:
- Primary: Kindergarten teachers and students
- Secondary: Students of all ages, adult learners, and professionals in specialized fields

## 2. User Stories

- As a kindergarten teacher, I want to create custom letter collections for my students to practice reading quickly.
- As a teacher, I want to adjust the display speed of items to match my students' current skill levels.
- As a student, I want to practice recognizing items in a timed, fullscreen mode to improve my speed and accuracy.
- As an adult learner, I want to create and practice with specialized collections for my field of study (e.g., nursing terms, periodic table elements).
- As a user, I want to customize the appearance of the app with different themes and colors to make it more engaging.
- As a teacher, I want to share my collections with other teachers to collaborate and save time.
- As a student, I want to create flashcards with images to study number sense and object recognition.
- As a competitive learner, I want to compare my performance with friends to motivate myself to improve.
- As a teacher, I want to assign stages of mastery (beginner, intermediate, advanced) to collections based on student progress.
- As a user, I want to experience interactive elements such as animations, sounds, and visual feedback to make learning more engaging.
- As a teacher, I want to verify user-uploaded images to ensure they are appropriate for a learning environment.
- As a student, I want to play matching games that associate words, letters, or images.
- As a user, I want detailed session reports, including the ability to attach reports to individual students.

[Add more user stories as needed]

## 3. System Architecture

- Frontend: React with TypeScript
  - Responsible for user interface, collection management, and practice sessions
  - Communicates with backend via RESTful API calls

- Backend: Python with FastAPI
  - Handles API requests, business logic, and database interactions
  - Uses SQLModel for ORM and Alembic for database migrations

- Database: PostgreSQL
  - Stores user data, collections, and session results

- Authentication: Auth0
  - Manages user authentication and authorization

- Deployment: Railway
  - Hosts the application and manages production environment variables

[Add a system architecture diagram if possible]

## 4. Database Schema

- Users
  - id (PK)
  - email
  - name
  - role (teacher/student)

- Collections
  - id (PK)
  - user_id (FK to Users)
  - name
  - description
  - is_public
  - stage (beginner/intermediate/advanced)

- Items
  - id (PK)
  - collection_id (FK to Collections)
  - content
  - type (letter/number/word/image)
  - order

- PracticeSessions
  - id (PK)
  - user_id (FK to Users)
  - collection_id (FK to Collections)
  - start_time
  - end_time
  - items_completed
  - speed_setting
  - report_id (optional reference to specific student ID)

[Add more tables and relationships as needed]

## 5. API Endpoints

- POST /api/collections - Create a new collection
- GET /api/collections - Retrieve user's collections
- PUT /api/collections/{id} - Update a collection
- DELETE /api/collections/{id} - Delete a collection
- POST /api/collections/{id}/items - Add items to a collection
- GET /api/collections/{id}/items - Retrieve items in a collection
- POST /api/practice-sessions - Start a new practice session
- PUT /api/practice-sessions/{id} - Update practice session results
- GET /api/practice-sessions/{id}/report - Retrieve session report

[Add more endpoints as needed]

## 6. UI/UX Design

- Home Dashboard: Overview of user's collections, recent practice sessions, and mastery levels.
- Collection Creator: Interface for creating, editing, and customizing collections. Allows for flashcards creation and assigning stages.
- Practice Mode: Fullscreen interface for timed practice sessions with interactive elements (animations, sounds, etc.).
- Results Screen: Display of practice session results, progress over time, and session reports attached to individual students.
- Matching Game Interface: Provides a fun matching game to reinforce learning.
- Settings Page: Customization options for themes, colors, and user preferences, including options for age-based themes (kid, teen, adult).

[Consider adding wireframes or mockups for key screens]

## 7. Security Considerations

- Auth0 for user authentication and authorization
- Secure storage of sensitive information (e.g., Auth0 credentials, database connection strings) using Railway's environment variables
- Image verification to ensure appropriateness of user-uploaded content

## 8. Testing Strategy

- Unit Tests: Test individual components and functions
- Integration Tests: Ensure proper interaction between different parts of the system
- End-to-End Tests: Simulate user interactions to test complete workflows
- User Acceptance Testing: Involve teachers and students in beta testing to gather feedback

## 9. Deployment Plan

- Use Railway for hosting and managing production environment
- Set up CI/CD pipeline for automated testing and deployment
- Implement database migration strategy using Alembic
- Plan for regular backups and disaster recovery

## 10. Future Enhancements

- Gamification features (badges, achievements, leaderboards)
- Advanced analytics for teachers to track student progress
- Mobile app version for on-the-go practice
- Integration with learning management systems (LMS)
- AI-powered recommendations for personalized learning paths
- Collaborative features for group study sessions
- Real-time updates using WebSockets for collaborative editing of collections
- Confetti explosions when students achieve a learning goal
- Multiple themes based on mastery levels (beginner, intermediate, advanced)
- Drag-and-drop word or card matching
- Instructional videos or information on each page to guide users
- Dropdown terms for easy selection in flashcards and math problems

## 11. Monetization Strategy

1. Subscription Model (Primary: Schools/Teachers)
- Target Market: Schools, districts, and individual teachers.
- Pricing Tiers:
  - Free Tier: Basic functionality, limited number of collections and practice sessions, access to pre-made collections.
  - Pro Tier (for Teachers): Monthly or annual subscription for advanced features, including custom collections, detailed session reports, mastery tracking, flashcard creation, and interactive elements (animations, sounds, etc.).
  - School/District Plans: Bulk pricing for institutions that includes unlimited teacher accounts, administrative oversight, analytics, and support for student accounts.
2. Freemium Model (Secondary: Broader Audience)
- Target Market: Students of all ages, adult learners, and professionals.
- Offer free access to a limited version of the app (basic collections and practice modes) to individual users.
- Paid options for unlocking advanced features such as:
- Customizable themes and gamified elements.
- Advanced analytics for tracking learning progress.
- Custom flashcard and collection creation, suited for specialized fields (e.g., nursing terms, periodic table elements).
