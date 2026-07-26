# Sports Club Management System



# Phase 1



This project is a Sports Club Management System.



# Technologies Used

- MySQL

- MySQL Workbench

- SQL



# Database

The database contains three tables:



1. Members

2. SportsClubs

3. Rosters



# Relationships

- Members and Rosters are connected using member\_id.

- SportsClubs and Rosters are connected using club\_id.

- Foreign keys use ON DELETE CASCADE.



# Manual Testing

Sample records were inserted into all tables.

JOIN queries were executed successfully to verify relationships.



# Phase 2



This phase adds the backend logic for user registration, login, and access control.



# Technologies Used

- Python

- Flask

- Flask-MySQLdb

- Werkzeug (for password hashing)



# Routes

- POST register - registers a new member and stores their password as a hash, not plain text

- POST login - checks the email and password against the database

- POST admin update-roster - example route that only Admins can access



# Data Integrity Guard

A decorator called admin_required checks the membership_type sent in the request. If it's not "Admin", the request is blocked with a 403 error. This stops Students from accessing admin-only actions.



# Testing

All routes were tested manually using Postman. Screenshots of the tests are in the screenshots folder:

- join_test.png and cascade_test.png - from Phase 1 database testing

- student_blocked.png - shows a Student being denied access to the admin route

- admin_allowed.png - shows an Admin successfully accessing the same route



# How to Run

1. Install the required packages: pip install flask flask-mysqldb werkzeug

2. Make sure MySQL is running and the sportsclubdb database exists with the schema from schema.sql

3. Update the MYSQL_PASSWORD in app.py to match your own MySQL password

4. Run the server: python app.py

5. Test the routes using Postman at http://127.0.0.1:5000



# Note

Django was not used for this project since the announcement confirmed there are no restrictions on which language or framework to use. MySQL Workbench and Flask were used instead.

