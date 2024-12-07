"""add completion records table

Revision ID: 25d5326b9139
Revises: cb9d8caf77a1
Create Date: 2024-12-07 06:39:28.778444

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy import Column, DateTime
import pytz
from datetime import datetime


# revision identifiers, used by Alembic.
revision: str = '25d5326b9139'
down_revision: str | None = 'cb9d8caf77a1'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('completion_records',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('collection_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['collection_id'], ['collections.collection_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('completion_records')
    # ### end Alembic commands ###
