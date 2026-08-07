from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)

# ---- Database connection settings ----
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Fatima123!'
app.config['MYSQL_DB'] = 'sportsclubdb'

mysql = MySQL(app)

# ---- REGISTER ROUTE ----
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    membership_type = data.get('membership_type', 'Student')

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    hashed_password = generate_password_hash(password)

    cur = mysql.connection.cursor()
    try:
        cur.execute(
            "INSERT INTO members (name, email, password_hash, membership_type) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_password, membership_type)
        )
        mysql.connection.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()

    return jsonify({"message": "Registered successfully"}), 201


# ---- LOGIN ROUTE ----
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT member_id, name, password_hash, membership_type FROM members WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    member_id, name, password_hash, membership_type = user

    if not check_password_hash(password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "member_id": member_id,
        "name": name,
        "membership_type": membership_type
    }), 200


# ---- ADMIN-ONLY GUARD (decorator) ----
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        membership_type = data.get('membership_type')

        if membership_type != 'Admin':
            return jsonify({"error": "Access denied: Admins only"}), 403

        return f(*args, **kwargs)
    return decorated


# ---- Example admin-only route, protected by the guard above ----
@app.route('/admin/update-roster', methods=['POST'])
@admin_required
def update_roster():
    return jsonify({"message": "Roster updated successfully (admin action)"}), 200

@app.route('/api/clubs/enroll', methods=['POST'])
def enroll_club():
    data = request.get_json()
    member_id = data.get('member_id')
    club_id = data.get('club_id')
    join_date = data.get('join_date')

    if not member_id or not club_id or not join_date:
        return jsonify({"error": "member_id, club_id, and join_date are required"}), 400

    cur = mysql.connection.cursor()
    try:
        mysql.connection.autocommit(False)

        cur.execute(
            "SELECT max_capacity FROM sportsclubs WHERE club_id = %s FOR UPDATE",
            (club_id,)
        )
        club = cur.fetchone()

        if not club:
            mysql.connection.rollback()
            return jsonify({"error": "Club not found"}), 404

        max_capacity = club[0]

        cur.execute("SELECT COUNT(*) FROM rosters WHERE club_id = %s", (club_id,))
        current_count = cur.fetchone()[0]

        if current_count >= max_capacity:
            mysql.connection.rollback()
            return jsonify({"error": "Club is at full capacity"}), 400

        cur.execute(
            "INSERT INTO rosters (member_id, club_id, join_date) VALUES (%s, %s, %s)",
            (member_id, club_id, join_date)
        )
        mysql.connection.commit()

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        mysql.connection.autocommit(True)

    return jsonify({"message": "Enrolled successfully"}), 201


@app.route('/api/clubs/listings', methods=['GET'])
def list_clubs():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT sc.club_id, sc.club_name, sc.coach_name, sc.max_capacity,
               COUNT(r.roster_id) AS current_members
        FROM sportsclubs sc
        LEFT JOIN rosters r ON sc.club_id = r.club_id
        GROUP BY sc.club_id, sc.club_name, sc.coach_name, sc.max_capacity
    """)
    rows = cur.fetchall()
    cur.close()

    clubs = []
    for row in rows:
        clubs.append({
            "club_id": row[0],
            "club_name": row[1],
            "coach_name": row[2],
            "max_capacity": row[3],
            "current_members": row[4]
        })

    return jsonify(clubs), 200


@app.route('/api/clubs/leave/<int:roster_id>', methods=['DELETE'])
def leave_club(roster_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT * FROM rosters WHERE roster_id = %s", (roster_id,))
        roster = cur.fetchone()

        if not roster:
            cur.close()
            return jsonify({"error": "Roster entry not found"}), 404

        cur.execute("DELETE FROM rosters WHERE roster_id = %s", (roster_id,))
        mysql.connection.commit()
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()

    return jsonify({"message": "Left club successfully"}), 200
# ---- PAGE ROUTES (serve the Phase 4 front-end pages) ----
@app.route('/')
@app.route('/student')
def student_portal():
    return render_template('student_portal.html')

@app.route('/admin')
def admin_workspace():
    return render_template('admin_workspace.html')


# ---- ADMIN ROSTER (with real names, for the Admin Workspace table) ----
@app.route('/api/admin/roster', methods=['GET'])
def admin_roster():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT r.roster_id, m.name, sc.club_name, r.join_date
        FROM rosters r
        JOIN members m ON r.member_id = m.member_id
        JOIN sportsclubs sc ON r.club_id = sc.club_id
        ORDER BY r.join_date DESC
    """)
    rows = cur.fetchall()
    cur.close()

    roster = []
    for row in rows:
        roster.append({
            "roster_id": row[0],
            "student_name": row[1],
            "club_name": row[2],
            "join_date": str(row[3])
        })

    return jsonify(roster), 200
if __name__ == '__main__':
    app.run(debug=True)