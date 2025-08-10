# EcoEats Deployment Guide

## Deploying to Render

### Prerequisites

- A GitHub account
- Your EcoEats application code pushed to a GitHub repository
- A Render account (free tier available)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Ensure these files are in your repository:**
   - `app.py` (main Flask application)
   - `requirements.txt` (Python dependencies)
   - `Procfile` (process definition)
   - `render.yaml` (deployment configuration)

### Step 2: Set Up Database

**Option A: Use Render's MySQL Service (Recommended)**

1. Go to your Render dashboard
2. Click "New +" → "MySQL"
3. Choose a name (e.g., "ecoeats-db")
4. Select "Free" plan
5. Note down the connection details

**Option B: Use External MySQL Service**

- Use services like PlanetScale, Railway, or AWS RDS

### Step 3: Deploy to Render

1. **Go to Render Dashboard:**

   - Visit [render.com](https://render.com)
   - Sign in or create an account

2. **Create New Web Service:**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing EcoEats

3. **Configure the Service:**

   - **Name:** `ecoeats` (or your preferred name)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Plan:** Free (or choose paid plan)

4. **Set Environment Variables:**

   ```
   SECRET_KEY=your-secure-secret-key-here
   MYSQL_HOST=your-mysql-host
   MYSQL_USER=your-mysql-username
   MYSQL_PASSWORD=your-mysql-password
   MYSQL_DB=your-database-name
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete (usually 2-5 minutes)

### Step 4: Database Setup

1. **Connect to your MySQL database**
2. **Create the required tables:**

   ```sql
   CREATE DATABASE ecoeats;
   USE ecoeats;

   CREATE TABLE Users (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email_address VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       phone VARCHAR(20),
       shipping_address TEXT,
       selling_address TEXT,
       user_type ENUM('consumer', 'seller') NOT NULL
   );

   CREATE TABLE Listings (
       listing_id INT AUTO_INCREMENT PRIMARY KEY,
       food_name VARCHAR(255) NOT NULL,
       description TEXT,
       freshness_duration VARCHAR(100),
       picture_url VARCHAR(500),
       price DECIMAL(10,2),
       seller_id INT,
       city VARCHAR(100),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (seller_id) REFERENCES Users(user_id)
   );
   ```

### Step 5: Test Your Deployment

1. **Visit your deployed URL** (e.g., `https://ecoeats.onrender.com`)
2. **Test the main functionality:**
   - Homepage loads
   - User registration
   - User login
   - Food listing creation
   - Food listing display

### Troubleshooting

**Common Issues:**

1. **Build Failures:**

   - Check `requirements.txt` for correct dependencies
   - Ensure all files are committed to GitHub

2. **Database Connection Errors:**

   - Verify environment variables are set correctly
   - Check database credentials and host

3. **Application Crashes:**

   - Check Render logs for error messages
   - Verify `Procfile` and start command

4. **Static Files Not Loading:**
   - Ensure static folder structure is correct
   - Check file permissions

**Getting Help:**

- Check Render logs in the dashboard
- Review Flask application logs
- Verify database connectivity

### Environment Variables Reference

| Variable         | Description                   | Example                     |
| ---------------- | ----------------------------- | --------------------------- |
| `SECRET_KEY`     | Flask secret key for sessions | `your-secure-random-string` |
| `MYSQL_HOST`     | MySQL database host           | `your-db-host.render.com`   |
| `MYSQL_USER`     | MySQL username                | `ecoeats_user`              |
| `MYSQL_PASSWORD` | MySQL password                | `your-secure-password`      |
| `MYSQL_DB`       | Database name                 | `ecoeats`                   |

### Security Notes

- **Never commit sensitive data** like passwords or API keys
- **Use strong, unique passwords** for your database
- **Enable HTTPS** (Render provides this automatically)
- **Regularly update dependencies** to patch security vulnerabilities

### Cost Optimization

- **Free tier:** 750 hours/month, auto-sleep after 15 minutes of inactivity
- **Paid plans:** Start at $7/month for always-on service
- **Database:** Free tier available for development/testing

---

**Happy Deploying! 🚀**
