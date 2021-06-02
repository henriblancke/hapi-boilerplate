import { Prometheus } from '@promster/hapi';

export const getUserCounter = new Prometheus.Counter({
  name: 'get_users',
  help: 'tracks how often someone hits the users endpoint',
});
