from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = '0de0fcb2a232'
down_revision = 'a786c3603da9'
branch_labels = None
depends_on = None

def upgrade():
    # Add the new column with a default value
    op.add_column('collections', sa.Column('category', sqlmodel.sql.sqltypes.AutoString(), nullable=False, server_default='Uncategorized'))

    # Remove the server default after the column has been populated
    op.alter_column('collections', 'category', server_default=None)

def downgrade():
    op.drop_column('collections', 'category')
