FROM python:3.10-slim-buster

ENV DEBIAN_FRONTEND=noninteractive
ARG NAME=captcha_backend
ARG HOME_DIR=/usr/src/${NAME}
ARG PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev python3-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash -d ${HOME_DIR} container_user 

COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

COPY . ${HOME_DIR}

RUN chown -R container_user:container_user ${HOME_DIR}

ENV PORT=${PORT}

WORKDIR ${HOME_DIR}
EXPOSE ${PORT}

USER container_user

ENTRYPOINT ["sh", "-c"]
CMD ["uvicorn main:app --host 0.0.0.0 --port ${PORT}"]