# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Create a shell script to run the application
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}' >> /app/start.sh && \
    chmod +x /app/start.sh

# Run the application
CMD ["/bin/bash", "/app/start.sh"]
