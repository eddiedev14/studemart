const { TestEnvironment } = require('jest-environment-node');
require('reflect-metadata');

// Load ESM Nest integrations in Node, outside Jest's CommonJS module loader.
// No authentication implementation is replaced by a test double here.
const integrations = {
  common: require('@nestjs/common'),
  core: require('@nestjs/core'),
  testing: require('@nestjs/testing'),
  validator: require('class-validator'),
  transformer: require('class-transformer'),
  config: require('@nestjs/config'),
  jwt: require('@nestjs/jwt'),
  typeorm: require('@nestjs/typeorm'),
};

module.exports = class AuthTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    this.global.authNestIntegrations = integrations;
    // Native modules and modules in the test VM must use the same metadata store.
    this.global.Reflect = Reflect;
  }
};
