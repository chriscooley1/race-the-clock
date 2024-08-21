from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a786c3603da9'
down_revision = 'fd285411f6e9'
branch_labels = None
depends_on = None

def upgrade():
    # Add the column with a default value
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=False, server_default='default_password'))
    
    # Remove the server_default to enforce NOT NULL constraint without default
    op.alter_column('users', 'hashed_password', server_default=None)

def downgrade():
    # Drop the column if downgrading
    op.drop_column('users', 'hashed_password')
