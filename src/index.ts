import { EmbeddedDB, EmbeddedOptions } from './embedded';
import weaviate, { ConnectToLocalOptions, WeaviateClient } from 'weaviate-client';

export interface EmbeddedClient extends WeaviateClient {
  embedded: EmbeddedDB;
}

const app = {
  client: async function (embedded: EmbeddedOptions, opts?: ConnectToLocalOptions): Promise<EmbeddedClient> {
    const client = await weaviate.connectToLocal(opts);
    const embeddedClient: EmbeddedClient = {
      ...client,
      embedded: new EmbeddedDB(embedded),
    };
    return embeddedClient;
  },
};

export default app;
export * from './embedded';
