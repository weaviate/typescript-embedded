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
      throw new Error(`unexpected failure: ${JSON.stringify(err)}`);
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
        host: 'localhost:7878',
      }
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      client.embedded.stop();
      throw new Error(`unexpected failure: ${JSON.stringify(err)}`);
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
      throw new Error(`unexpected failure: ${JSON.stringify(err)}`);
    });
    client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with binaryUrl', async () => {
    let binaryUrl = '';
    const url = 'https://api.github.com/repos/weaviate/weaviate/releases/latest';
    await fetch(url, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
      .then((res: Response) => {
        if (res.status != 200) {
          throw new Error(`unexpected status code: ${res.status}`);
        }
        return res.json();
      })
      .then((body: any) => {
        binaryUrl = body.assets[0].browser_download_url as string;
      })
      .catch((err: any) => {
        throw new Error(`unexpected failure: ${JSON.stringify(err)}`);
      });

    const client: EmbeddedClient = weaviate.client(
      new EmbeddedOptions({
        binaryUrl: binaryUrl,
      })
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      client.embedded.stop();
      throw new Error(`unexpected failure: ${JSON.stringify(err)}`);
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
      throw new Error(`unexpected error: ${JSON.stringify(err)}`);
    });

  await client.schema
    .classDeleter()
    .withClassName(testClass.class)
    .do()
    .then(() => console.log('class deleted!'))
    .catch((err: any) => {
      throw new Error(`unexpected error: ${JSON.stringify(err)}`);
    });
}
