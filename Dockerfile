# Multi-stage Dockerfile for AI-Assisted Environmental Platform
FROM python:3.12-slim AS backend-builder

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend /app/backend

WORKDIR /app/backend
EXPOSE 8000

CMD ["python", "run.py"]
