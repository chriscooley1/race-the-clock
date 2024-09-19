"""Add display_name to users

Revision ID: e51854b2cc79
Revises: ea2496d9375e
Create Date: 2024-09-02 13:20:32.401838

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'e51854b2cc79'
down_revision: str | None = 'ea2496d9375e'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Check if 'category' column exists in 'collections' table
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    collections_columns = inspector.get_columns('collections')
    if 'category' not in [col['name'] for col in collections_columns]:
        op.add_column('collections', sa.Column('category', sqlmodel.sql.sqltypes.AutoString(), nullable=False))
    
    # Check if 'display_name' column exists in 'users' table
    users_columns = inspector.get_columns('users')
    if 'display_name' not in [col['name'] for col in users_columns]:
        op.add_column('users', sa.Column('display_name', sqlmodel.sql.sqltypes.AutoString(), nullable=True))


def downgrade() -> None:
    # Check if 'display_name' column exists before trying to drop it
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    users_columns = inspector.get_columns('users')
    if 'display_name' in [col['name'] for col in users_columns]:
        op.drop_column('users', 'display_name')
    
    # Check if 'category' column exists before trying to drop it
    collections_columns = inspector.get_columns('collections')
    if 'category' in [col['name'] for col in collections_columns]:
        op.drop_column('collections', 'category')
