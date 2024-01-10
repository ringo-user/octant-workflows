from typing import List

from app.context.epoch_state import EpochState
from app.context.manager import epoch_context
from app.exceptions import NotImplementedForGivenEpochState
from app.modules.registry import get_services


def get_donors(epoch_num: int) -> List[str]:
    context = epoch_context(epoch_num)
    if context.epoch_state > EpochState.PENDING:
        raise NotImplementedForGivenEpochState()
    service = get_services(context.epoch_state).user_allocations_service
    return service.get_all_donors_addresses(context)
