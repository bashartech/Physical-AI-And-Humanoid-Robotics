# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Create a user to avoid running as root
RUN useradd -m -u 1000 user
USER user

# Set the PATH environment variable
ENV PATH="/home/user/.local/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy the requirements file first
COPY --chown=user:USER requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the current directory contents into the container
COPY --chown=user:USER . .

# Expose the port Uvicorn will run on
EXPOSE 7860

# Set the command to run Uvicorn with your FastAPI app
# Replace `main:app` with your actual FastAPI entrypoint if different
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--reload"]
