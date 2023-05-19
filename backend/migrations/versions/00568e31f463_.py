"""empty message

Revision ID: 00568e31f463
Revises: 5d3b741a454d
Create Date: 2023-05-16 16:13:55.109992

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "00568e31f463"
down_revision = "5d3b741a454d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "epoch_snapshots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("epoch", sa.Integer(), nullable=False),
        sa.Column("glm_supply", sa.String(), nullable=False),
        sa.Column("eth_proceeds", sa.String(), nullable=False),
        sa.Column("total_effective_deposit", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("epoch"),
    )
    op.drop_table("onchain_snapshot")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "onchain_snapshot",
        sa.Column("id", sa.INTEGER(), nullable=False),
        sa.Column("epoch_no", sa.INTEGER(), nullable=False),
        sa.Column("glm_supply", sa.VARCHAR(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("epoch_no"),
    )
    op.drop_table("epoch_snapshots")
    # ### end Alembic commands ###