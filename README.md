# Sports Club Management System

## Phase 1

This project is a Sports Club Management System.

### Technologies Used
- MySQL
- MySQL Workbench
- SQL

### Database
The database contains three tables:

1. Members
2. SportsClubs
3. Rosters

### Relationships
- Members and Rosters are connected using member_id.
- SportsClubs and Rosters are connected using club_id.
- Foreign keys use ON DELETE CASCADE.

### Manual Testing
Sample records were inserted into all tables.
JOIN queries were executed successfully to verify relationships.