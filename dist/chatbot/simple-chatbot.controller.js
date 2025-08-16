"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleChatbotController = void 0;
const common_1 = require("@nestjs/common");
const ai_powered_adlync_chatbot_service_1 = require("./services/ai-powered-adlync-chatbot.service");
let SimpleChatbotController = class SimpleChatbotController {
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    async health() {
        return {
            status: 'ok',
            service: 'chatbot',
            timestamp: new Date().toISOString(),
            message: 'Chatbot service is running',
        };
    }
    async chat(chatRequest) {
        try {
            const { message, sessionId } = chatRequest;
            if (!message || message.trim().length === 0) {
                throw new common_1.HttpException('Message is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const response = await this.chatbotService.processMessage(message.trim(), sessionId || 'default-session');
            return {
                message: response.message,
                suggestedActions: response.suggestedActions || [],
            };
        }
        catch (error) {
            console.error('Chatbot error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SimpleChatbotController = SimpleChatbotController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleChatbotController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SimpleChatbotController.prototype, "chat", null);
exports.SimpleChatbotController = SimpleChatbotController = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [ai_powered_adlync_chatbot_service_1.AIPoweredAdlyncChatbotService])
], SimpleChatbotController);
//# sourceMappingURL=simple-chatbot.controller.js.map