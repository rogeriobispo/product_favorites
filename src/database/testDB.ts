import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create(): Promise<void> {
    await createConnection();
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const conn = getConnection();
    const entities = conn.entityMetadatas;

    entities.forEach(async entity => {
      const repository = conn.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};

export default connection;
