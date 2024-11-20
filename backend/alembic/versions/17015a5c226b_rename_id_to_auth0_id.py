"""rename_id_to_auth0_id

Revision ID: 17015a5c226b
Revises: dcddcda5be17
Create Date: 2024-11-20 16:22:58.851137

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '17015a5c226b'
down_revision: str | None = 'dcddcda5be17'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # First copy data from id to auth0_id
    op.add_column('users', sa.Column('auth0_id', sa.String(), nullable=True))
    op.execute('UPDATE users SET auth0_id = id')
    op.drop_index('ix_users_id', table_name='users')
    op.create_index(op.f('ix_users_auth0_id'), 'users', ['auth0_id'], unique=True)
    op.drop_column('users', 'id')


def downgrade() -> None:
    op.add_column('users', sa.Column('id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.execute('UPDATE users SET id = auth0_id')
    op.drop_index(op.f('ix_users_auth0_id'), table_name='users')
    op.create_index('ix_users_id', 'users', ['id'], unique=True)
    op.drop_column('users', 'auth0_id')
