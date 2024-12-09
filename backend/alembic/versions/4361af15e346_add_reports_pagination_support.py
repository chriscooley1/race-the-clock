"""add_reports_pagination_support

Revision ID: 4361af15e346
Revises: c0070990eaec
Create Date: 2024-12-11 18:37:44.054323

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql
from models import MountainDateTime

# revision identifiers, used by Alembic.
revision: str = '4361af15e346'
down_revision: str | None = 'c0070990eaec'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('completion_records', 'completed_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=MountainDateTime(),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('completion_records', 'completed_at',
               existing_type=MountainDateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=True)
    # ### end Alembic commands ###
