import weaviate, { EmbeddedClient, EmbeddedOptions } from '.';

describe('embedded', () => {
  jest.setTimeout(60 * 1000);

  it('checks platform', () => {});
  if (process.platform != 'linux' && process.platform != 'darwin') {
    console.warn(`Skipping because EmbeddedDB does not support ${process.platform}`);
    return;
  }

  it('starts/stops EmbeddedDB with default options', async () => {
    const client: EmbeddedClient = await weaviate.client(new EmbeddedOptions());
    await client.embedded.start();
    await checkClientServerConn(client).catch((err: any) => {
      throw new Error(`unexpected failure: ${err}`);
    });
    await client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with custom options', async () => {
    const client: EmbeddedClient = await weaviate.client(
      new EmbeddedOptions({
        port: 7878,
        version: '1.19.8',
        env: {
          QUERY_DEFAULTS_LIMIT: 50,
          DEFAULT_VECTORIZER_MODULE: 'text2vec-openai',
        },
      }),
      {
        host: '127.0.0.01',
        port: 7878,
        grpcPort: 50051,
      }
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch(async (err: any) => {
      await client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    await client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with latest version', async () => {
    const client: EmbeddedClient = await weaviate.client(
      new EmbeddedOptions({
        version: 'latest',
      })
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch(async (err: any) => {
      await client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    await client.embedded.stop();
  });

  it('starts/stops EmbeddedDB with binaryUrl', async () => {
    let binaryUrl = 'https://github.com/weaviate/weaviate/releases/download/v1.19.8/weaviate-v1.19.8-';
    if (process.platform == 'darwin') {
      binaryUrl += 'darwin-all.zip';
    } else {
      binaryUrl += `linux-amd64.tar.gz`;
    }
    const client: EmbeddedClient = await weaviate.client(
      new EmbeddedOptions({
        binaryUrl: binaryUrl,
      })
    );
    await client.embedded.start();
    await checkClientServerConn(client).catch(async (err: any) => {
      await client.embedded.stop();
      throw new Error(`unexpected failure: ${err}`);
    });
    await client.embedded.stop();
  });
});

// Checks communication between the client and embedded server
// by creating, then deleting a class
async function checkClientServerConn(client: EmbeddedClient) {
  const testClass = {
    class: 'TestClass',
    properties: [{ name: 'stringProp', dataType: ['string'] }],
  };

  await client.collections
    .create({
      name: testClass,
    })
    .then((res) => {
      expect(res.name).toEqual('TestClass');
      console.log('class created!');
    })
    .catch((err: any) => {
      throw new Error(`unexpected error: ${err}`);
    });

  await client.collections
    .delete(testClass.class)
    .then(() => console.log('class deleted!'))
    .catch((err: any) => {
      throw new Error(`unexpected error: ${err}`);
    });
}
