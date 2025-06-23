"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const path_1 = require("path");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use('/uploads', express.static((0, path_1.join)(process.cwd(), 'uploads')));
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    await app.listen(3001);
    console.log('🚀 Backend corriendo en http://localhost:3001');
}
bootstrap();
//# sourceMappingURL=main.js.map