"""empty message

Revision ID: 5be0b6f99ee7
Revises: c4b0243c24d6
Create Date: 2023-08-28 16:27:24.685638

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5be0b6f99ee7'
down_revision = 'c4b0243c24d6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('allocation_nonce',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('allocation_nonce',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###