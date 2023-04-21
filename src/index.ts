import { EmbeddedDB, EmbeddedOptions } from './embedded';
import weaviate, { ConnectionParams, WeaviateClient } from 'weaviate-ts-client';

export interface EmbeddedClient extends WeaviateClient {
  embedded: EmbeddedDB;
}

const app = {
  client: function (embedded: EmbeddedOptions, conn?: ConnectionParams): EmbeddedClient {
    if (!conn) conn = { host: '127.0.0.1:6666', scheme: 'http' };
    const client = weaviate.client(conn);
    const embeddedClient: EmbeddedClient = {
      ...client,
      embedded: new EmbeddedDB(embedded),
    };
    return embeddedClient;
  },
};

export default app;
export * from './embedded';
