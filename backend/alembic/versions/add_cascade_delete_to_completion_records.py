"""add_cascade_delete_to_completion_records

Revision ID: ae66c5c9dfdc
Revises: 25d5326b9139
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = 'ae66c5c9dfdc'
down_revision = '25d5326b9139'
branch_labels = None
depends_on = None

def upgrade():
    # Drop existing foreign key constraints if they exist
    op.drop_constraint(
        'completion_records_collection_id_fkey',
        'completion_records',
        type_='foreignkey'
    )
    
    # Re-create foreign key with ON DELETE CASCADE
    op.create_foreign_key(
        'completion_records_collection_id_fkey',
        'completion_records', 'collections',
        ['collection_id'], ['collection_id'],
        ondelete='CASCADE'
    )

def downgrade():
    # Drop the CASCADE foreign keys
    op.drop_constraint(
        'completion_records_collection_id_fkey',
        'completion_records',
        type_='foreignkey'
    )
    
    # Re-create without CASCADE
    op.create_foreign_key(
        'completion_records_collection_id_fkey',
        'completion_records', 'collections',
        ['collection_id'], ['collection_id']
    )
