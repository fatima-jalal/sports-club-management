from flask import Flask, request, jsonify
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


if __name__ == '__main__':
    app.run(debug=True)