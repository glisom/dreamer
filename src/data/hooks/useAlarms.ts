import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  Alarm,
  AlarmsRepository,
  CreateAlarmInput,
  UpdateAlarmInput,
} from '../repositories/alarmsRepo';

export interface UseAlarmsResult {
  ready: boolean;
  repository: AlarmsRepository;
  list: () => Alarm[];
  getById: (id: number) => Alarm | null;
  getByUser: (userId: number) => Alarm[];
  create: (input: CreateAlarmInput) => Alarm;
  update: (id: number, updates: UpdateAlarmInput) => Alarm | null;
  remove: (id: number) => boolean;
}

export function useAlarms(): UseAlarmsResult {
  const { ready, alarms } = useRepositoriesContext();

  const list = useCallback(() => alarms.getAll(), [alarms]);
  const getById = useCallback((id: number) => alarms.getById(id), [alarms]);
  const getByUser = useCallback(
    (userId: number) => alarms.getByUser(userId),
    [alarms]
  );
  const create = useCallback(
    (input: CreateAlarmInput) => alarms.create(input),
    [alarms]
  );
  const update = useCallback(
    (id: number, updates: UpdateAlarmInput) => alarms.update(id, updates),
    [alarms]
  );
  const remove = useCallback((id: number) => alarms.delete(id), [alarms]);

  return {
    ready,
    repository: alarms,
    list,
    getById,
    getByUser,
    create,
    update,
    remove,
  };
}
