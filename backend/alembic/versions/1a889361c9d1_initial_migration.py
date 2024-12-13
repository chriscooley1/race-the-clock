"""Initial migration

Revision ID: 1a889361c9d1
Revises: 
Create Date: 2024-12-13 15:17:16.951652

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql
from models import MountainDateTime  # Adjust the import path as necessary

# revision identifiers, used by Alembic.
revision: str = '1a889361c9d1'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('auth0_id', sa.String(), nullable=True),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('role', sa.String(), nullable=False, server_default='student'),
        sa.PrimaryKeyConstraint('user_id'),
        sa.UniqueConstraint('auth0_id'),
        sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_auth0_id'), 'users', ['auth0_id'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Create sequences table
    op.create_table(
        'sequences',
        sa.Column('sequence_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('sequence_id')
    )

    # Create collections table
    op.create_table(
        'collections',
        sa.Column('collection_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='private'),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('collection_id')
    )

    # Create items table
    op.create_table(
        'items',
        sa.Column('item_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('collection_id', sa.Integer(), nullable=False),
        sa.Column('count', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['collection_id'], ['collections.collection_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('item_id')
    )

    # Create namelists table
    op.create_table(
        'namelists',
        sa.Column('namelist_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('names', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('namelist_id')
    )

    # Create feedback table
    op.create_table(
        'feedback',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('page_url', sa.String(), nullable=False),
        sa.Column('created_at', MountainDateTime(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('image_paths', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create completion_records table
    op.create_table(
        'completion_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('collection_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('completed_at', MountainDateTime(), nullable=False),
        sa.ForeignKeyConstraint(['collection_id'], ['collections.collection_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop tables in reverse order of creation
    op.drop_table('completion_records')
    op.drop_table('feedback')
    op.drop_table('namelists')
    op.drop_table('items')
    op.drop_table('collections')
    op.drop_table('sequences')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_auth0_id'), table_name='users')
    op.drop_table('users')
