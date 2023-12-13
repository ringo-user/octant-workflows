import pytest

from app.context.context import ContextBuilder
from app.v2.engine.epochs_settings import EpochSettings
from app.v2.engine.octant_rewards import OctantRewardsSettings
from app.v2.engine.octant_rewards.total_and_individual.all_proceeds_with_op_cost import (
    AllProceedsWithOperationalCost,
)
from app.v2.engine.user import DefaultWeightedAverageEffectiveDeposit, UserSettings
from app.v2.engine.user.effective_deposit.weighted_average.weights.timebased.default import (
    DefaultTimebasedWeights,
)
from tests.conftest import (
    MOCK_EPOCHS,
    USER1_BUDGET,
    USER2_BUDGET,
    USER1_ED,
    USER2_ED,
)


@pytest.fixture(autouse=True)
def before(app, patch_epochs, mock_epoch_details):
    pass


def test_basic_context():
    MOCK_EPOCHS.get_current_epoch.return_value = 3
    MOCK_EPOCHS.get_pending_epoch.return_value = 2
    MOCK_EPOCHS.get_finalized_epoch.return_value = 1

    context = ContextBuilder().build()

    assert context.current_epoch == 3
    assert context.pending_epoch == 2
    assert context.finalized_epoch == 1
    assert context.current_epoch_context is None
    assert context.pending_epoch_context is None
    assert context.finalized_epoch_context is None


def test_current_epoch_context(user_accounts):
    context = ContextBuilder().with_current_epoch_context().build()
    current_epoch_context = context.current_epoch_context
    epoch_details = current_epoch_context.epoch_details

    assert context.current_epoch == 2
    assert current_epoch_context.epoch_settings == EpochSettings()
    assert epoch_details.epoch_no == 2
    assert epoch_details.start_sec == 2000
    assert epoch_details.end_sec == 3000


def test_pending_epoch_context(user_accounts, mock_pending_epoch_snapshot_db):
    context = (
        ContextBuilder()
        .with_pending_epoch_context(
            [user_accounts[0].address, user_accounts[1].address]
        )
        .build()
    )
    pending_epoch_context = context.pending_epoch_context
    epoch_details = pending_epoch_context.epoch_details

    assert context.pending_epoch == 1
    assert pending_epoch_context.epoch_settings == EpochSettings(
        octant_rewards=OctantRewardsSettings(
            total_and_all_individual_rewards=AllProceedsWithOperationalCost(),
        ),
        user=UserSettings(
            effective_deposit=DefaultWeightedAverageEffectiveDeposit(
                timebased_weights=DefaultTimebasedWeights(),
            ),
        ),
    )
    assert epoch_details.epoch_no == 1
    assert epoch_details.start_sec == 1000
    assert epoch_details.end_sec == 2000

    assert context.pending_epoch_context.pending_snapshot is not None
    assert len(context.pending_epoch_context.users_context) == 2
    user1 = context.pending_epoch_context.users_context[user_accounts[0].address]
    assert user1.get_effective_deposit(1) == USER1_ED
    assert user1.get_budget(1) == USER1_BUDGET
    user2 = context.pending_epoch_context.users_context[user_accounts[1].address]
    assert user2.get_effective_deposit(1) == USER2_ED
    assert user2.get_budget(1) == USER2_BUDGET


def test_finalized_epoch_context(user_accounts, mock_finalized_epoch_snapshot_db):
    MOCK_EPOCHS.get_finalized_epoch.return_value = 1
    context = ContextBuilder().with_finalized_epoch_context().build()
    finalized_epoch_context = context.finalized_epoch_context
    epoch_details = finalized_epoch_context.epoch_details

    assert context.finalized_epoch == 1
    assert finalized_epoch_context.epoch_settings == EpochSettings(
        octant_rewards=OctantRewardsSettings(
            total_and_all_individual_rewards=AllProceedsWithOperationalCost(),
        ),
        user=UserSettings(
            effective_deposit=DefaultWeightedAverageEffectiveDeposit(
                timebased_weights=DefaultTimebasedWeights(),
            ),
        ),
    )
    assert epoch_details.epoch_no == 1
    assert epoch_details.start_sec == 1000
    assert epoch_details.end_sec == 2000
