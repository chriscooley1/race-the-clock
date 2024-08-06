"""Add status field to collections

Revision ID: 3c4b687d38c6
Revises: 8b7be4abe74a
Create Date: 2024-08-06 17:34:02.487533

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '3c4b687d38c6'
down_revision: str | None = '8b7be4abe74a'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add the status column with a default value to avoid NOT NULL constraint violations
    op.add_column(
        'collections',
        sa.Column('status', sqlmodel.sql.sqltypes.AutoString(), nullable=False, server_default='private')
    )
    # Remove the server default after adding the column
    op.alter_column('collections', 'status', server_default=None)

    # Update existing commands
    op.alter_column('users', 'username',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)


def downgrade() -> None:
    # Drop the status column and revert other changes
    op.drop_column('collections', 'status')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.alter_column('users', 'username',
               existing_type=sa.VARCHAR(),
               nullable=False)
