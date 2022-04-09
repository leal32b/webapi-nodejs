#!/bin/bash

set -e
set -u

database="${POSTGRES_DB}_test"
echo "Creating database '$database'"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE $database;
  GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
