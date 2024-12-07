"""add creator fields to collections

Revision ID: 3a3ede560b67
Revises: ccf7be89a536
Create Date: 2024-11-26 11:13:35.230964

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '3a3ede560b67'
down_revision: str | None = 'ccf7be89a536'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('collections', sa.Column('creator_display_name', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.add_column('collections', sa.Column('creator_username', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('collections', 'creator_username')
    op.drop_column('collections', 'creator_display_name')
    # ### end Alembic commands ###
