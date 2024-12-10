"""add_image_paths_to_feedback

Revision ID: c0070990eaec
Revises: 5feb807ecab7
Create Date: 2024-12-10 15:39:44.471483

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects.postgresql import JSON


# revision identifiers, used by Alembic.
revision: str = 'c0070990eaec'
down_revision: str | None = '5feb807ecab7'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add image_paths column as JSON type
    op.add_column('feedback', 
        sa.Column('image_paths', JSON, nullable=True, server_default='[]')
    )


def downgrade() -> None:
    # Remove image_paths column
    op.drop_column('feedback', 'image_paths')
