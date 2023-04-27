# Weaviate TypeScript EmbeddedDB <img alt='Weaviate logo' src='https://weaviate.io/img/site/weaviate-logo-light.png' width='148' align='right' />

An embedded Weaviate database with TypeScript client interface

## Documentation

- [Documentation](https://weaviate.io/developers/weaviate/installation/embedded).

## Examples

### With default options

Defaults:
- Host: `127.0.0.1`
- Port: `6666`
- Weaviate version: `latest`

```ts
import weaviate, { EmbeddedClient, EmbeddedOptions } from 'weaviate-ts-embedded';

const client: EmbeddedClient = weaviate.client(new EmbeddedOptions());
await client.embedded.start();
// use the client to interact with embedded Weaviate
client.embedded.stop();
```

### With custom options

```ts
import weaviate, { EmbeddedClient, EmbeddedOptions } from 'weaviate-ts-embedded';

const client: EmbeddedClient = weaviate.client(
  new EmbeddedOptions({
    port: 7878,
    version: '1.18.1',
    env: {
      QUERY_DEFAULTS_LIMIT: 50,
      DEFAULT_VECTORIZER_MODULE: 'text2vec-openai',
    },
  }),
  // weaviate-ts-client ConnectionParams
  {
    scheme: 'http',
    host: '127.0.0.1:7878',
  }
);
await client.embedded.start();
// use the client to interact with embedded Weaviate
client.embedded.stop();
```

### With direct binary url

```ts
import weaviate, { EmbeddedClient, EmbeddedOptions } from 'weaviate-ts-embedded';

const binaryUrl = 'https://some-link-to-weaviate-binary';
const client: EmbeddedClient = weaviate.client(
  new EmbeddedOptions({
    binaryUrl: binaryUrl,
  })
);
await client.embedded.start();
// use the client to interact with embedded Weaviate
client.embedded.stop();
```

## Support

- [Stackoverflow for questions](https://stackoverflow.com/questions/tagged/weaviate).
- [Github for issues](https://github.com/weaviate/typescript-embedded/issues).

## Contributing

- [How to Contribute](https://github.com/weaviate/typescript-embedded/blob/main/CONTRIBUTE.md).

## Build Status

[![Build Status](https://github.com/weaviate/typescript-embedded/actions/workflows/.github/workflows/main.yaml/badge.svg?branch=main)](https://github.com/weaviate/typescript-embedded/actions/workflows/.github/workflows/main.yaml)
