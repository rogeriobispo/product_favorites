import { ServerConfigs } from '../shared/config';
import app from './app';
import '../database';
import '@shared/container';

app.listen(ServerConfigs.port, () => {
  console.warn(
    `Listening on port ${ServerConfigs.port} env: ${ServerConfigs.env}`,
  );
});
