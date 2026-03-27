# Portfolio Website

## Working Website Link
Once the server is running, your website will be available at:
👉 **[http://localhost:3000](http://localhost:3000)**


## Prerequisites
1. **Node.js**: Make sure Node.js is installed.
2. **MySQL**: MySQL must be installed and running.

## Fixing "Local Host Not Working"
If your localhost is not working, it is likely due to Windows PowerShell execution policies blocking `npm run dev` or MySQL access issues. Follow these steps to resolve:

### 1. Starting the Server (The easy way)
Just double-click the **`start_server.bat`** file in this folder. It will bypass any PowerShell script restrictions, automatically start your Node.js server, and open your portfolio website in your default web browser at `http://localhost:3000`.

### 2. Fixing Database Connection Error
If the server starts but you see an "Access denied for user 'root'" error in the terminal:
- Right-click on **`reset_mysql.ps1`** and select **Run with PowerShell** as **Administrator**.
- This script will reset your root MySQL password to `Lakshya123` so the Node server can connect.
- After resetting, you also need to set up the database by running:
  `mysql -u root -pLakshya123 < setup_db.sql`

## Tech Stack
- Frontend: HTML, CSS, JS
- Backend: Node.js, Express
- Database: MySQL
