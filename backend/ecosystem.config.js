module.exports = {
  apps: [
    {
      name: 'gestor-de-proyectos',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: '1234',
        DB_NAME: 'tp_nest_db',
        DB_LOGGING: 'false',
        SWAGGER_HABILITADO: false,
        JWT_SECRET: 'af46ac628db9bccae001487fbe456025f8f6cd93596c18f622c66314abe405fb',
      },
      time: true,
    },
  ],
};
