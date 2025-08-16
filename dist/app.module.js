"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const twilio_service_1 = require("./twilio/twilio.service");
const twilio_controller_1 = require("./twilio/twilio.controller");
const simple_chatbot_module_1 = require("./chatbot/simple-chatbot.module");
const vapi_module_1 = require("./vapi/vapi.module");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: ['.env.local', '.env'],
                validationOptions: {
                    allowUnknown: false,
                    abortEarly: true,
                },
            }),
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
            simple_chatbot_module_1.SimpleChatbotModule,
            vapi_module_1.VapiModule,
        ],
        providers: [
            twilio_service_1.TwilioService,
            {
                provide: core_1.APP_PIPE,
                useClass: common_2.ValidationPipe,
            },
        ],
        controllers: [twilio_controller_1.TwilioController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map