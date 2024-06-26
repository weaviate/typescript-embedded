import { homedir } from 'os';
import { join } from 'path';
import { EmbeddedOptions } from './embedded';

describe('embedded', () => {
  jest.setTimeout(60 * 1000);

  it('creates EmbeddedOptions with defaults', () => {
    const opt = new EmbeddedOptions();

    expect(opt.binaryPath).toEqual(join(homedir(), '.cache/weaviate-embedded-latest'));
    expect(opt.persistenceDataPath).toEqual(join(homedir(), '.local/share/weaviate'));
    expect(opt.host).toEqual('127.0.0.1');
    expect(opt.port).toEqual(6789);
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'Embedded_at_6789');
  });

  it('creates EmbeddedOptions with custom options', () => {
    const opt = new EmbeddedOptions({
      host: 'somehost.com',
      port: 7777,
      version: '1.18.1-alpha.0',
      env: {
        DEFAULT_VECTORIZER_MODULE: 'text2vec-contextionary',
        ENABLE_MODULES: 'text2vec-contextionary',
        CONTEXTIONARY_URL: 'contextionary:9999',
        QUERY_DEFAULTS_LIMIT: 100,
      },
    });

    // eslint-disable-next-line prettier/prettier
    expect(opt.env).toHaveProperty('DEFAULT_VECTORIZER_MODULE', 'text2vec-contextionary');
    expect(opt.env).toHaveProperty('ENABLE_MODULES', 'text2vec-contextionary');
    expect(opt.env).toHaveProperty('CONTEXTIONARY_URL', 'contextionary:9999');
    expect(opt.env).toHaveProperty('QUERY_DEFAULTS_LIMIT', 100);
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'Embedded_at_7777');
    expect(opt.host).toEqual('somehost.com');
    expect(opt.port).toEqual(7777);
  });

  it('overrides default env vars with inherited exported ones', () => {
    process.env.CLUSTER_HOSTNAME = 'custom-hostname';
    const opt = new EmbeddedOptions();
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'custom-hostname');
  });

  it('failed to create EmbeddedOptions with invalid version', () => {
    return expect(() => {
      const opt = new EmbeddedOptions({
        version: '123',
      });
    }).toThrow("invalid version: 123. version must resemble '{major}.{minor}.{patch}, or 'latest'");
  });
});
