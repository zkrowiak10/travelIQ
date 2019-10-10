FROM python
RUN pip install flask
RUN pip install flask_sqlalchemy
COPY ./ /dataVol
EXPOSE 80
CMD  cd dataVol/ && ls && source run.sh