# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory in the container
WORKDIR /usr/srv

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy toàn bộ source code vào container
COPY . .

# Install Python dependencies (sau khi copy code)
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8068

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8068", "--reload"]