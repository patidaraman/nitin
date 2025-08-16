"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        });
        const configService = app.get(config_1.ConfigService);
        const port = configService.get('port') || parseInt(process.env.DEFAULT_PORT, 10);
        const environment = configService.get('app.environment');
        app.enableCors({
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'ngrok-skip-browser-warning',
                'X-Requested-With',
                'Accept',
                'Origin'
            ],
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        app.setGlobalPrefix('api/v1', {
            exclude: [
                '/exotel/ivr-response',
                '/exotel/gather-response',
                '/exotel/call-status',
                '/twilio/voice-response',
                '/twilio/gather-response',
                '/twilio/recording-complete',
                '/twilio/call-status',
                '/twilio/sms-status',
                '/twilio/whatsapp-status',
                '/twilio/incoming-sms',
                '/twilio/incoming-whatsapp',
                '/twilio/ai-agent-response',
                '/twilio/account-menu',
                '/twilio/ai-followup',
                '/twilio/post-recording-menu',
                '/twilio/callback-request',
            ],
        });
        await app.listen(port);
        logger.log(`🚀 Application is running on: http://localhost:${port}`);
        logger.log(`📱 Exotel webhooks available at: http://localhost:${port}/exotel/`);
        logger.log(`📞 Twilio webhooks available at: http://localhost:${port}/twilio/`);
        logger.log(`🌍 Environment: ${environment}`);
        logger.log(`📊 Health checks:`);
        logger.log(`   - Exotel: http://localhost:${port}/api/v1/exotel/health`);
        logger.log(`   - Twilio: http://localhost:${port}/api/v1/twilio/health`);
        logger.log(`   - Chatbot: http://localhost:${port}/api/v1/chatbot/health`);
        logger.log(`   - VAPI: http://localhost:${port}/api/v1/vapi/health`);
        logger.log(`🤖 Chatbot API: http://localhost:${port}/api/v1/chatbot/chat`);
        logger.log(`🎙️ VAPI Assistant Chat: http://localhost:${port}/api/v1/vapi/assistant-chat`);
        logger.log(`📞 VAPI Call Initiate: http://localhost:${port}/api/v1/vapi/initiate-call`);
    }
    catch (error) {
        logger.error('❌ Error starting the application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map