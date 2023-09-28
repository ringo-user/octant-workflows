from datetime import datetime

from app.extensions import epochs
from app.infrastructure import graphql
from app.utils.time import sec_to_days


class EpochDetails:
    def __init__(self, start, duration, decision_window):
        self.duration_sec = int(duration)
        self.duration_days = sec_to_days(self.duration_sec)
        self.decision_window_sec = int(decision_window)
        self.decision_window_days = sec_to_days(self.decision_window_sec)
        self.start_sec = int(start)
        self.end_sec = self.start_sec + self.duration_sec

        now_sec = int(datetime.utcnow().timestamp())
        if now_sec > self.end_sec:
            self.remaining_sec = 0
        elif self.start_sec <= now_sec < self.end_sec:
            self.remaining_sec = self.end_sec - now_sec
        else:
            self.remaining_sec = self.duration_sec

        self.remaining_days = sec_to_days(self.remaining_sec)


def get_epoch_details(epoch: int) -> EpochDetails:
    epoch_details = graphql.epochs.get_epoch_by_number(epoch)

    return EpochDetails(
        start=epoch_details["fromTs"],
        duration=epoch_details["duration"],
        decision_window=epoch_details["decisionWindow"],
    )


def get_future_epoch_details() -> EpochDetails:
    epoch_details = epochs.get_future_epoch_props()

    return EpochDetails(
        start=epoch_details[2],
        duration=epoch_details[3],
        decision_window=epoch_details[4],
    )