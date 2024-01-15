from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol

from app.context.manager import Context
from app.engine.octant_rewards.matched import MatchedRewardsPayload
from app.infrastructure import database
from app.modules.dto import OctantRewardsDTO
from app.modules.octant_rewards.core import calculate_leverage


class UserPatronMode(Protocol):
    def get_patrons_rewards(self, context: Context) -> int:
        ...


@dataclass
class PendingOctantRewards:
    patrons_mode: UserPatronMode

    def get_octant_rewards(self, context: Context) -> OctantRewardsDTO:
        pending_snapshot = database.pending_epoch_snapshot.get_by_epoch(
            context.epoch_details.epoch_num
        )
        return OctantRewardsDTO(
            staking_proceeds=int(pending_snapshot.eth_proceeds),
            locked_ratio=Decimal(pending_snapshot.locked_ratio),
            total_effective_deposit=int(pending_snapshot.total_effective_deposit),
            total_rewards=int(pending_snapshot.total_rewards),
            individual_rewards=int(pending_snapshot.all_individual_rewards),
            operational_cost=int(pending_snapshot.operational_cost),
        )

    def get_matched_rewards(self, context: Context) -> int:
        pending_snapshot = database.pending_epoch_snapshot.get_by_epoch(
            context.epoch_details.epoch_num
        )
        patrons_rewards = self.patrons_mode.get_patrons_rewards(context)
        matched_rewards_settings = context.epoch_settings.octant_rewards.matched_rewards

        return matched_rewards_settings.calculate_matched_rewards(
            MatchedRewardsPayload(
                total_rewards=int(pending_snapshot.total_rewards),
                all_individual_rewards=int(pending_snapshot.all_individual_rewards),
                patrons_rewards=patrons_rewards,
            )
        )

    def get_leverage(self, context: Context) -> float:
        allocations_sum = database.allocations.get_alloc_sum_by_epoch(
            context.epoch_details.epoch_num
        )
        matched_rewards = self.get_matched_rewards(context)

        return calculate_leverage(matched_rewards, allocations_sum)
