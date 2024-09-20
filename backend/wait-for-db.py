import time
import os
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def wait_for_db(db_url, max_retries=5, retry_interval=5):
    retries = 0
    while retries < max_retries:
        try:
            engine = create_engine(db_url)
            engine.connect()
            logger.info("Successfully connected to the database")
            return
        except OperationalError:
            retries += 1
            logger.warning(f"Database connection attempt {retries} failed. Retrying in {retry_interval} seconds...")
            time.sleep(retry_interval)
    
    raise Exception("Could not connect to the database after multiple attempts")

if __name__ == "__main__":
    database_url = os.getenv("DATABASE_URL")
    wait_for_db(database_url)
