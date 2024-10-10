"""Add stage field to collections

Revision ID: d48985a79c54
Revises: 6a1a68540c6f
Create Date: 2024-10-10 08:23:08.254691

"""
from typing import Sequence
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd48985a79c54'
down_revision: str | None = '6a1a68540c6f'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Create the enum type for stage
    stage_enum = sa.Enum('beginner', 'intermediate', 'advanced', name='stage_enum')
    stage_enum.create(op.get_bind())  # Create the enum type in the database

    # Add the stage column to the collections table
    op.add_column('collections', sa.Column('stage', stage_enum, nullable=False, server_default='beginner'))
    
    op.alter_column('collections', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False,
               existing_server_default=sa.text('now()'))
    # ### end Alembic commands ###


def downgrade() -> None:
    # Drop the stage column
    op.drop_column('collections', 'stage')

    # Drop the enum type
    stage_enum = sa.Enum('beginner', 'intermediate', 'advanced', name='stage_enum')
    stage_enum.drop(op.get_bind())  # Drop the enum type from the database

    op.alter_column('collections', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True,
               existing_server_default=sa.text('now()'))
    # ### end Alembic commands ###
