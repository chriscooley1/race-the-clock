"""Add is_public field to Collection model

Revision ID: 5feb807ecab7
Revises: ae66c5c9dfdc
Create Date: 2024-12-10 11:03:33.147591

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5feb807ecab7'
down_revision: str | None = 'ae66c5c9dfdc'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add is_public column with a default value of False
    op.add_column('collections', sa.Column('is_public', sa.Boolean(), server_default='false', nullable=False))
    
    # Update existing public collections
    op.execute("UPDATE collections SET is_public = true WHERE status = 'public'")
    
    # Modify the completion_records table changes to use basic timestamp type
    op.alter_column('completion_records', 'completed_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.DateTime(timezone=True),
               existing_nullable=True)
    op.drop_constraint('completion_records_collection_id_fkey', 'completion_records', type_='foreignkey')
    op.create_foreign_key(None, 'completion_records', 'collections', ['collection_id'], ['collection_id'])


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'completion_records', type_='foreignkey')
    op.create_foreign_key('completion_records_collection_id_fkey', 'completion_records', 'collections', ['collection_id'], ['collection_id'], ondelete='CASCADE')
    op.alter_column('completion_records', 'completed_at',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=True)
    op.drop_column('collections', 'is_public')
    # ### end Alembic commands ###