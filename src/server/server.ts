import { ServerConfigs } from '../shared/config';
import app from './app';

app.listen(ServerConfigs.port, () => {
  console.warn(
    `Listening on port ${ServerConfigs.port} env: ${ServerConfigs.env}`,
  );
});
