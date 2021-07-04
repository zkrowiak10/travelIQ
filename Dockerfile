
FROM python
RUN pip install flask psycopg2 flask_sqlalchemy pytest coverage flask_migrate
ENV FLASK_APP=travel_app
ENV FLASK_ENV=development
WORKDIR  /code
ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]

