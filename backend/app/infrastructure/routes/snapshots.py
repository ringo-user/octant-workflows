import dataclasses

from flask import Response
from flask_restx import Resource, Namespace, fields

from app.controllers import snapshots
from app.extensions import api

ns = Namespace("snapshots", description="Database snapshots")
api.add_namespace(ns)

epoch_status_model = api.model(
    "EpochStatus",
    {
        "isCurrent": fields.Boolean(
            required=True,
            description="Returns True if the given epoch is the current epoch",
        ),
        "isPending": fields.Boolean(
            required=True,
            description="Returns True if the given epoch is the pending epoch",
        ),
        "isFinalized": fields.Boolean(
            required=True,
            description="Returns True if the given epoch is a finalized epoch",
        ),
    },
)


@ns.route("/pending")
@ns.doc(
    description="Take a database snapshot of the recently completed epoch. \
    This endpoint should be executed at the beginning of an epoch to activate \
    a decision window."
)
@ns.response(
    200, "Snapshot could not be created due to an existing snapshot for previous epoch"
)
@ns.response(201, "Snapshot created successfully")
class PendingEpochSnapshot(Resource):
    def post(self):
        epoch = snapshots.snapshot_pending_epoch()
        return ({"epoch": epoch}, 201) if epoch is not None else Response()


@ns.route("/finalized")
@ns.doc(
    description="Take a database snapshot of the recently completed allocations. \
    This endpoint should be executed at the end of the decision window"
)
@ns.response(
    200, "Snapshot could not be created due to an existing snapshot for previous epoch"
)
@ns.response(201, "Snapshot created successfully")
class FinalizedEpochSnapshot(Resource):
    def post(self):
        epoch = snapshots.snapshot_finalized_epoch()
        return ({"epoch": epoch}, 201) if epoch is not None else Response()


@ns.route("/status/<int:epoch>")
@ns.doc(
    description="Returns given epoch's status, whether it's a "
    "current, pending or a finalized epoch. In case all fields are returning False and not "
    "an error, it is likely that there's a pending epoch that has not been snapshotted yet."
)
@ns.response(200, "Epoch status successfully retrieved")
@ns.response(
    400,
    "Invalid epoch number given. Most likely the epoch has not started yet. "
    "Consult the error message.",
)
class EpochStatus(Resource):
    @ns.marshal_with(epoch_status_model)
    def get(self, epoch: int):
        status = snapshots.get_epoch_status(epoch)
        return status.to_dict()