import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL

# Initialize Flask application
app = Flask(__name__)

# Set secret key for session (needed for flash messages)
app.secret_key = '12345678'  # Change this to something more secure for production

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Your MySQL username
app.config['MYSQL_PASSWORD'] = 'password'  # Your MySQL password
app.config['MYSQL_DB'] = 'ecoeats'  # Your database name
mysql = MySQL(app)

# Define routes
@app.route('/')
def home():
    # Check if user is logged in
    if 'user_id' in session:
        return render_template('homepage.html', logged_in=True)
    else:
        return render_template('homepage.html', logged_in=False)

@app.route('/register_customer', methods=['GET', 'POST'])
def reg_customer():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']
        phone = request.form['phone']
        shipping_address = request.form['address']
        
        # Check if passwords match
        if password != confirm_password:
            flash("Passwords do not match! Please try again.")
            return redirect(url_for('register_customer'))

        # Check if user already exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM Users WHERE email_address = %s", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            flash("User with this email already exists. Please log in or use a different email.")
            return redirect(url_for('login'))
        
        # Insert new customer into the database
        cur.execute("INSERT INTO Users (name, email_address, password, phone, shipping_address, user_type) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (name, email, password, phone, shipping_address, 'consumer'))
        mysql.connection.commit()
        user_id = cur.lastrowid  # Get the last inserted user_id
        cur.close()

        # Store user data in session to indicate logged-in state
        session['user_id'] = user_id
        session['user_name'] = name  # Store name if needed for display

        flash("Registration successful! Welcome to EcoEats.")
        return redirect(url_for('home'))  # Redirect to home after successful registration

    return render_template('register-customer.html')

@app.route('/register_seller', methods=['GET', 'POST'])
def reg_seller():
    if request.method == 'POST':
        name = request.form['business-name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']
        phone = request.form['phone']
        shipping_address = request.form['address']
        selling_address = request.form['business-address']
        
        # Check if passwords match
        if password != confirm_password:
            flash("Passwords do not match! Please try again.")
            return redirect(url_for('register_seller'))

        # Check if user already exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM Users WHERE email_address = %s", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            flash("User with this email already exists. Please log in or use a different email.")
            return redirect(url_for('login'))
        
        # Insert new seller into the database
        cur.execute("INSERT INTO Users (name, email_address, password, phone, shipping_address, selling_address, user_type) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
            (name, email, password, phone, shipping_address, selling_address, 'seller'))

        mysql.connection.commit()
        user_id = cur.lastrowid  # Get the last inserted user_id
        cur.close()

        # Store user data in session to indicate logged-in state
        session['user_id'] = user_id
        session['user_name'] = name  # Store name if needed for display

        flash("Registration successful! Welcome to EcoEats.")
        return redirect(url_for('home'))  # Redirect to home after successful registration

    return render_template('seller-register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():

    user_id = request.args.get('user_id')

    if request.method == 'POST':
        # Get form data
        role = request.form.get('role')
        email = request.form.get('email')
        password = request.form.get('password')

        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Query to check if the user exists and matches the email, password, and role
        cur.execute("SELECT * FROM users WHERE email_address = %s AND password = %s AND user_type = %s", (email, password, role))
        user = cur.fetchone()  # Fetch the first matching user (if any)

        if user:
            # If a match is found, store user data in session (to track login state)
            session['user_id'] = user[0]  # Assuming the first column is the user_id
            session['user_name'] = user[1]  # Assuming the second column is the user name

            # Redirect to the appropriate page based on user role
            if role == 'seller':
                 return redirect(url_for('add_food_listing', user_id=user_id))  # Redirect to seller profile
            elif role == 'consumer':
                return redirect(url_for('food_list'))  # Redirect to customer food list

        # If no match, show error
        flash("Invalid email, password, or role. Please try again.")
        return redirect(url_for('login'))

    return render_template('login.html')  # Render login page for GET requests


app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/add-food-listing', methods=['GET', 'POST'])
def add_food_listing():
    # Retrieve the user_id from the URL or session
    user_id = request.args.get('user_id')  # Assuming you pass it through the URL

    if request.method == 'POST':
        food_name = request.form['food-name']
        food_description = request.form['description']
        food_price = request.form['price']
        freshness = request.form['freshness']

        # Handle image upload
        if 'food_image' in request.files:
            file = request.files['food-image']
            if file and allowed_file(file.filename):
                filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(filename)
            else:
                filename = None
        else:
            filename = None

        # Insert food data into the Listings table
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO Listings (food_name, description, freshness_duration, picture_url, price, seller_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (food_name, food_description, freshness, filename, food_price, user_id))  # Use the user_id from registration
        mysql.connection.commit()
        cur.close()

        return redirect(url_for('food_list'))  # Redirect to the list of food items

    return render_template('seller-profile.html')


@app.route('/food-list')
def food_list():
    # Fetch all food listings from the database
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM listings")
    food_items = cur.fetchall()
    cur.close()

    return render_template('food-list.html', food_items=food_items)


# Run the app
if __name__ == '__main__':
    app.run(debug=True)
