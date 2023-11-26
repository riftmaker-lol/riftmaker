import { TournamentStatus } from '@prisma/client';

const Status = ({ status }: { status: TournamentStatus }) => {
  switch (status) {
    case TournamentStatus.CREATED:
      return <div className="text-lg text-gray-500">Created</div>;
    case TournamentStatus.ACCEPTING_PARTICIPANTS:
      return <div className="text-lg text-gray-500">Accepting participants</div>;
    case TournamentStatus.READY:
      return <div className="text-lg text-gray-500">Ready</div>;
    case TournamentStatus.FINISHED:
      return <div className="text-lg text-gray-500">Finished</div>;
    default:
      return null;
  }
};

export default Status;
