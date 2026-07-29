\# Sports Club Management System



\## Phase 1



This project is a Sports Club Management System.



\### Technologies Used

\- MySQL

\- MySQL Workbench

\- SQL



\### Database

The database contains three tables:



1\. Members

2\. SportsClubs

3\. Rosters



\### Relationships

\- Members and Rosters are connected using member\_id.

\- SportsClubs and Rosters are connected using club\_id.

\- Foreign keys use ON DELETE CASCADE.



\### Manual Testing

Sample records were inserted into all tables.

JOIN queries were executed successfully to verify relationships.



\## Phase 2



This phase adds the backend logic for user registration, login, and access control.



\### Technologies Used

\- Python

\- Flask

\- Flask-MySQLdb

\- Werkzeug (for password hashing)



\### Routes

\- POST register - registers a new member and stores their password as a hash, not plain text

\- POST login - checks the email and password against the database

\- POST admin update-roster - example route that only Admins can access



\### Data Integrity Guard

A decorator called admin\_required checks the membership\_type sent in the request. If it's not "Admin", the request is blocked with a 403 error. This stops Students from accessing admin-only actions.



\### Testing

All routes were tested manually using Postman. Screenshots of the tests are in the screenshots folder:

\- join\_test.png and cascade\_test.png - from Phase 1 database testing

\- student\_blocked.png - shows a Student being denied access to the admin route

\- admin\_allowed.png - shows an Admin successfully accessing the same route



\### How to Run

1\. Install the required packages: pip install flask flask-mysqldb werkzeug

2\. Make sure MySQL is running and the sportsclubdb database exists with the schema from schema.sql

3\. Update the MYSQL\_PASSWORD in app.py to match your own MySQL password

4\. Run the server: python app.py

5\. Test the routes using Postman at http://127.0.0.1:5000



\### Note

Django was not used for this project since the announcement confirmed there are no restrictions on which language or framework to use. MySQL Workbench and Flask were used instead.





\## Phase 3



This phase adds the business logic endpoints for club enrollment, listing,

and leaving, along with capacity limit enforcement.



\### Routes



\- POST /api/clubs/enroll - enrolls a member into a club. Requires member\_id,

&#x20; club\_id, and join\_date in the request body. Checks the club's current

&#x20; roster count against its max\_capacity before inserting; rejects the

&#x20; request if the club is full.

\- GET /api/clubs/listings - returns all clubs, each with club\_id, club\_name,

&#x20; coach\_name, max\_capacity, and current\_members (a live count from the

&#x20; rosters table).

\- DELETE /api/clubs/leave/<roster\_id> - removes a member from a club's

&#x20; roster by roster\_id.



\### Capacity Logic



The enroll route wraps its capacity check and insert inside a single

database transaction. It uses SELECT ... FOR UPDATE to lock the club's row

while checking current\_count against max\_capacity, so two enroll requests

arriving at the same time cannot both slip past the capacity check. If the

club is full, the transaction is rolled back and a 400 error is returned.



\### Example Requests



POST /api/clubs/enroll

Request body:

{

&#x20; "member\_id": 2,

&#x20; "club\_id": 1,

&#x20; "join\_date": "2026-07-30"

}

Success response (201):

{ "message": "Enrolled successfully" }

Failure response when club is full (400):

{ "error": "Club is at full capacity" }



GET /api/clubs/listings

Success response (200):

\[

&#x20; {

&#x20;   "club\_id": 1,

&#x20;   "club\_name": "Cricket Club",

&#x20;   "coach\_name": "Muhammad",

&#x20;   "max\_capacity": 20,

&#x20;   "current\_members": 3

&#x20; }

]



DELETE /api/clubs/leave/10

Success response (200):

{ "message": "Left club successfully" }



\### Testing



All three routes were tested manually using Postman:

\- enroll\_success.png - shows a successful enrollment (201 Created)

\- listings\_test.png - shows GET /api/clubs/listings returning club data

\- leave\_test.png - shows DELETE /api/clubs/leave/<roster\_id> removing a member

\- capacity\_blocked.png - shows a 400 error returned when a club is at

&#x20; max\_capacity



\### How to Run



1\. Make sure app.py is running: python app.py

2\. Make sure MySQL is running and sportsclubdb has data

3\. Use Postman to send requests to the routes above at

&#x20;  http://127.0.0.1:5000

