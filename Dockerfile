# syntax=docker/dockerfile:1
FROM python:3.10.1-slim-buster
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD gunicorn  wsgi:app --workers 5 --threads 2 -b 0.0.0.0:5000 --timeout 0
#CMD [ "gunicorn", "--bind=0.0.0.0:5000", "--timeout=0", "wsgi:app"]