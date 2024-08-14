from typing import Sequence

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'd8c7b865d146'
down_revision: str | None = '7078096c42f8'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add the column as nullable
    op.add_column('users', sa.Column('hashed_password', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    
    # Set a default value for existing rows
    op.execute("UPDATE users SET hashed_password = 'default_password' WHERE hashed_password IS NULL")
    
    # Alter the column to be NOT NULL
    op.alter_column('users', 'hashed_password', nullable=False)
    
    # Make email column nullable
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=True)
    
    # Drop the password column
    op.drop_column('users', 'password')


def downgrade() -> None:
    # Add the password column back
    op.add_column('users', sa.Column('password', sa.VARCHAR(), autoincrement=False, nullable=False))
    
    # Make email column non-nullable
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=False)
    
    # Drop the hashed_password column
    op.drop_column('users', 'hashed_password')
