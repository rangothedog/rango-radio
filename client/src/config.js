import schema from 'config.json';

class Config {
  constructor() {  
    this.schema = schema;
  }

  schema() {
    return this.schema;
  }

  active() {
    const sites = this.schema.sites || [];
    const activeSites = sites.filter(site => site.active);
    return activeSites && activeSites.length > 0 ? activeSites[0] : null;
  }

  server() {
    const server = this.schema.server || {};
    return server;
  }
}

module.exports = Config;