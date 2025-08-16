"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const simple_chatbot_controller_1 = require("./simple-chatbot.controller");
const ai_powered_adlync_chatbot_service_1 = require("./services/ai-powered-adlync-chatbot.service");
let SimpleChatbotModule = class SimpleChatbotModule {
};
exports.SimpleChatbotModule = SimpleChatbotModule;
exports.SimpleChatbotModule = SimpleChatbotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
        ],
        controllers: [simple_chatbot_controller_1.SimpleChatbotController],
        providers: [ai_powered_adlync_chatbot_service_1.AIPoweredAdlyncChatbotService],
        exports: [ai_powered_adlync_chatbot_service_1.AIPoweredAdlyncChatbotService],
    })
], SimpleChatbotModule);
//# sourceMappingURL=simple-chatbot.module.js.map