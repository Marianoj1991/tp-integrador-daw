const { time } = require("node:console");

module.exports = {
    apps:[
        {
            name: "gestor-de-proyectos",
            script: "dist/main.js",
            env: {
                NODE_ENV: "production",
                PORT: 4000,
                DB_HOST: "localhost",
                DB_PORT: 5432,
                DB_USERNAME: "postgres",
                DB_PASSWORD: "WhiteWidow836**",
                DB_NAME: "tp_nest_db",
                DB_LOGGING: "false",
                SWAGGER_HABILITADO: "false",
                JWT_SECRET: "gtT0zY6&5Sx%7c29x&O4@^@73D&uz^xQ",
            },
            time: true,
        },
    ]
}

