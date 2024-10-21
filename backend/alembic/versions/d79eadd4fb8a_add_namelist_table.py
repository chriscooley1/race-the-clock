"""Add NameList table

Revision ID: d79eadd4fb8a
Revises: 23ab397f408d
Create Date: 2024-10-21 08:47:00.040633

"""
from typing import Sequence
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.exc import ProgrammingError

# revision identifiers, used by Alembic.
revision: str = 'd79eadd4fb8a'
down_revision: str | None = '23ab397f408d'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    # Remove the check for existing table, as it might cause issues
    op.create_table('namelists',
        sa.Column('namelist_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('names', sa.JSON(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('namelist_id')
    )

def downgrade() -> None:
    op.drop_table('namelists')
