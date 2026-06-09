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
        DB_PASSWORD: 'mariano_12345',
        DB_NAME: 'gestor_de_proyectos_personal',
        DB_LOGGING: 'false',
        SWAGGER_HABILITADO: false,
        JWT_SECRET: 'gtT0zY6&5Sx%7c29x&O4@^@73D&uz^xQ',
      },
      time: true,
    },
  ],
};
