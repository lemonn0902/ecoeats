from flask import Flask, render_template

# Initialize Flask application
app = Flask(__name__)

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

@app.route('/register-customer')
def reg_seller():
    return render_template('seller-register.html')

@app.route('/login')
def seller_profile():
    return render_template('seller-profile.html')

if __name__ == '__main__':
    app.run(debug=True)
