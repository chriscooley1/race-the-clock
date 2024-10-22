"""Add check_subscription endpoint

Revision ID: 18099c02fa63
Revises: d79eadd4fb8a
Create Date: 2024-10-22 11:34:03.167032

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '18099c02fa63'
down_revision: str | None = 'd79eadd4fb8a'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Added new endpoint /collections/check-subscription/{collection_id}
    # This endpoint checks if a user is subscribed to a specific collection
    # No database schema changes were required for this feature
    pass


def downgrade() -> None:
    # No database changes to revert
    pass
