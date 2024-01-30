import { TFunction } from 'i18next';

export type Milestone = {
  from: Date;
  id: string;
  label: string;
  to?: Date;
};

// LOOK AT ME
// Each milestone must have a date in the appropriate Europe/Warsaw time zone!
// Dates only in ISO8601 (Safari has troubles understanding other formats)
export default function getMilestones(t: TFunction): Milestone[] {
  return [
    {
      from: new Date('2023-11-13T00:00:00+0100'),
      id: 'e2-applications-open',
      label: t('applicationsOpen'),
      to: new Date('2023-12-20T00:00:00+0100'),
    },
    {
      from: new Date('2023-12-22T00:00:00+0100'),
      id: 'e2-project-updates-close',
      label: t('projectUpdatesClose'),
    },
    {
      from: new Date('2024-01-01T00:00:00+0100'),
      id: 'e2-snapshot-vote',
      label: t('snapshotVote'),
      to: new Date('2024-01-05T00:00:00+0100'),
    },
    {
      from: new Date('2024-01-17T00:00:00+0100'),
      id: 'e2-allocation-window',
      label: t('allocationWindow'),
      to: new Date('2024-01-31T00:00:00+0100'),
    },
    {
      from: new Date('2024-01-17T00:00:00+0100'),
      id: 'e3-epoch-starts',
      label: t('epochStarts', { epoch: 'Three' }),
    },
    {
      from: new Date('2024-02-12T00:00:00+0100'),
      id: 'e3-applications-open',
      label: t('applicationsOpen'),
      to: new Date('2024-03-14T00:00:00+0100'),
    },
    {
      from: new Date('2024-03-17T00:00:00+0100'),
      id: 'e3-project-updates-close',
      label: t('projectUpdatesClose'),
    },
    {
      from: new Date('2024-03-18T00:00:00+0100'),
      id: 'e3-snapshot-vote',
      label: t('snapshotVote'),
      to: new Date('2024-03-22T00:00:00+0100'),
    },
    {
      from: new Date('2024-04-16T00:00:00+0100'),
      id: 'e3-allocation-window',
      label: t('allocationWindow'),
      to: new Date('2024-04-30T00:00:00+0100'),
    },
    {
      from: new Date('2024-04-16T00:00:00+0100'),
      id: 'e4-epoch-starts',
      label: t('epochStarts', { epoch: 'Four' }),
    },
  ];
}
