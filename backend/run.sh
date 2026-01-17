#!/bin/bash

# GovConnect Backend Runner

echo "Setting up GovConnect Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pip3 install -r requirements.txt

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check your Python/pip installation."
    exit 1
fi

echo "Starting GovConnect Backend on http://localhost:5000"
echo "Press Ctrl+C to stop the server"

# Run the Flask app
python3 app.py