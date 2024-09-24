"""update_null_created_at

Revision ID: 6a1a68540c6f
Revises: beb251452416
Create Date: 2024-09-24 16:16:37.618677

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from datetime import datetime

# revision identifiers, used by Alembic.
revision: str = '6a1a68540c6f'
down_revision: str | None = 'beb251452416'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""
        UPDATE collections
        SET created_at = NOW()
        WHERE created_at IS NULL
    """)


def downgrade() -> None:
    # We can't easily revert this change, so we'll leave this empty
    pass
