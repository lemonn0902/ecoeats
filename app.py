from flask import Flask, render_template, request, redirect, url_for, flash

# Initialize Flask application
app = Flask(__name__)

# Set secret key for session (needed for flash messages)
app.secret_key = '12345678'  # Change this to something more secure for production

users = [
    {"email": "seller@example.com", "password": "seller123", "role": "seller"},
    {"email": "customer@example.com", "password": "customer123", "role": "customer"},
]

# Define routes
@app.route('/')
def home():
    return render_template('homepage.html')  # Your HTML file in templates folder

@app.route('/food-list')
def food_list():
    return render_template('food-list.html')  # About page

@app.route('/register-customer')
def reg_customer():
    return render_template('register-customer.html')  # Contact page

@app.route('/register-seller')
def reg_seller():  # Fix this route name
    return render_template('seller-register.html')

@app.route('/seller-profile')
def seller_profile():
    return render_template('seller-profile.html')  

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get form data
        role = request.form.get('role')
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate user credentials
        for user in users:
            if user['email'] == email and user['password'] == password and user['role'] == role:
                # Redirect to appropriate dashboard
                if role == 'seller':
                    return redirect(url_for('seller_profile'))
                elif role == 'customer':
                    return redirect(url_for('food_list'))

        # If no match, show error
        flash("Invalid email, password, or role. Please try again.")
        return redirect(url_for('login'))

    return render_template('login.html')  # Render login page for GET requests


if __name__ == '__main__':
    app.run(debug=True)
