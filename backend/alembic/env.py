from logging.config import fileConfig
from decouple import config as env_config  # Rename to avoid confusion
from sqlalchemy import engine_from_config, pool
from alembic import context
from models import SQLModel, User, Sequence, Collection
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))


# Load the database URL from the environment variable
DATABASE_URL = env_config("DATABASE_URL")
alembic_config = context.config  # Use a different name for Alembic's config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
alembic_config.set_main_option("sqlalchemy.url", DATABASE_URL)
if alembic_config.config_file_name is not None:
    fileConfig(alembic_config.config_file_name)

# add your model's MetaData object here for "autogenerate" support
target_metadata = SQLModel.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = alembic_config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        alembic_config.get_section(alembic_config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
