"""add patrons_rewards, leftover and operational_cost to snapshots

Revision ID: d381462203ad
Revises: 794617984fc3
Create Date: 2024-01-02 16:17:53.740348

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d381462203ad"
down_revision = "794617984fc3"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("finalized_epoch_snapshots", schema=None) as batch_op:
        batch_op.add_column(sa.Column("patrons_rewards", sa.String(), nullable=False))
        batch_op.add_column(sa.Column("leftover", sa.String(), nullable=False))

    with op.batch_alter_table("pending_epoch_snapshots", schema=None) as batch_op:
        batch_op.add_column(sa.Column("operational_cost", sa.String(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("pending_epoch_snapshots", schema=None) as batch_op:
        batch_op.drop_column("operational_cost")

    with op.batch_alter_table("finalized_epoch_snapshots", schema=None) as batch_op:
        batch_op.drop_column("leftover")
        batch_op.drop_column("patrons_rewards")

    # ### end Alembic commands ###
