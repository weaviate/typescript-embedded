import weaviate, { EmbeddedClient, EmbeddedOptions } from '.';
import { WeaviateClass } from 'weaviate-ts-client';

describe('embedded', () => {
  jest.setTimeout(60 * 1000);

  it('checks platform', () => {});
  if (process.platform != 'linux') {
    console.warn(`Skipping because EmbeddedDB does not support ${process.platform}`);
    return;
  }

  it('starts/stops EmbeddedDB with default options', async () => {
    const client: EmbeddedClient = weaviate.client(new EmbeddedOptions());
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      throw new Error(`unexpected failure: ${err}`);
    });
    client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with custom options', async () => {
    const client: EmbeddedClient = weaviate.client(
      new EmbeddedOptions({
        port: 7878,
        version: '1.18.1',
        env: {
          QUERY_DEFAULTS_LIMIT: 50,
          DEFAULT_VECTORIZER_MODULE: 'text2vec-openai',
        },
      }),
      {
        scheme: 'http',
        host: '127.0.0.1:7878',
      }
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with latest version', async () => {
    const client: EmbeddedClient = weaviate.client(
      new EmbeddedOptions({
        version: 'latest',
      })
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with binaryUrl', async () => {
    const binaryUrl =
      'https://github.com/weaviate/weaviate/releases/download/v1.19.8/weaviate-v1.19.8-linux-amd64.tar.gz';
    const client: EmbeddedClient = weaviate.client(
      new EmbeddedOptions({
        binaryUrl: binaryUrl,
      })
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    client.embedded.stop();
  });
});

// Checks communication between the client and embedded server
// by creating, then deleting a class
async function checkClientServerConn(client: EmbeddedClient) {
  const testClass = {
    class: 'TestClass',
    properties: [{ name: 'stringProp', dataType: ['string'] }],
  };

  await client.schema
    .classCreator()
    .withClass(testClass)
    .do()
    .then((res: WeaviateClass) => {
      expect(res.class).toEqual('TestClass');
      console.log('class created!');
    })
    .catch((err: any) => {
      throw new Error(`unexpected error: ${err}`);
    });

  await client.schema
    .classDeleter()
    .withClassName(testClass.class)
    .do()
    .then(() => console.log('class deleted!'))
    .catch((err: any) => {
      throw new Error(`unexpected error: ${err}`);
    });
}
