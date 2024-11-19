"""Remove stage from NewCollection

Revision ID: 9eafdbdad78d
Revises: aeb71fa4d09e
Create Date: 2024-11-19 09:39:20.421341

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '9eafdbdad78d'
down_revision: str | None = 'aeb71fa4d09e'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Drop the 'stage' column from the 'collections' table
    op.drop_column('collections', 'stage')


def downgrade() -> None:
    # Re-add the 'stage' column in case of a downgrade
    op.add_column('collections', sa.Column('stage', sa.String(), nullable=True))
