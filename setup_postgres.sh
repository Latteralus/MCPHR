#!/bin/bash
# Update package lists
sudo apt update

# Install PostgreSQL server and additional tools
sudo apt install -y postgresql postgresql-contrib

# Switch to the postgres user and execute SQL commands
sudo -i -u postgres psql <<EOF
-- Create a new user with password (change 'your_password' to a strong password)
CREATE USER admin WITH PASSWORD 'admin123';
-- Create the new database
CREATE DATABASE mcphr_db;
-- Grant privileges to the new user on the new database
GRANT ALL PRIVILEGES ON DATABASE mcphr_db TO admin;
EOF

echo "PostgreSQL installation and configuration complete."



# chmod +x setup_postgres.sh
# run script: ./setup_postgres.sh
