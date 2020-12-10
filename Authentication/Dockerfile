# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9

COPY . ./app
# Copy local code to the container image.
WORKDIR /app

# Install production dependencies.
RUN pip install --user -r requirements.txt
RUN pip install google-cloud-firestore

EXPOSE 8080

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
ENTRYPOINT ["python3"]
CMD ["app.py"]