FROM python
RUN pip install flask
RUN pip install psycopg2
RUN pip install flask_sqlalchemy
RUN pip install flask_migrate
ENV FLASK_APP=travel_app
ENV FLASK_ENV=development
WORKDIR  /dataVol/
CMD bash