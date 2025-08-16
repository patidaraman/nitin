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
var VapiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VapiController = exports.VapiChatDto = exports.InitiateVapiCallDto = void 0;
const common_1 = require("@nestjs/common");
const vapi_service_1 = require("./vapi.service");
const class_validator_1 = require("class-validator");
class InitiateVapiCallDto {
}
exports.InitiateVapiCallDto = InitiateVapiCallDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateVapiCallDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateVapiCallDto.prototype, "customerName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateVapiCallDto.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateVapiCallDto.prototype, "assistantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], InitiateVapiCallDto.prototype, "metadata", void 0);
class VapiChatDto {
}
exports.VapiChatDto = VapiChatDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VapiChatDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VapiChatDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VapiChatDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VapiChatDto.prototype, "assistantId", void 0);
let VapiController = VapiController_1 = class VapiController {
    constructor(vapiService) {
        this.vapiService = vapiService;
        this.logger = new common_1.Logger(VapiController_1.name);
    }
    async createAssistant() {
        this.logger.log("🎙️ Creating Vapi AI Assistant for Adlync Solutions");
        return this.vapiService.createAssistant();
    }
    async listAssistants() {
        this.logger.log("📋 Fetching all Vapi assistants");
        return this.vapiService.listAssistants();
    }
    async listPhoneNumbers() {
        this.logger.log("📞 Fetching all Vapi phone numbers");
        return this.vapiService.listPhoneNumbers();
    }
    async initiateCall(callData) {
        this.logger.log(`🎙️ Initiating Vapi AI call to: ${callData.phoneNumber}`);
        const callRequest = {
            phoneNumber: callData.phoneNumber,
            assistantId: callData.assistantId,
            customerName: callData.customerName,
            customerEmail: callData.customerEmail,
            metadata: {
                source: "adlync-website",
                timestamp: new Date().toISOString(),
                ...callData.metadata,
            },
        };
        return this.vapiService.initiateCall(callRequest);
    }
    async getCallStatus(callId) {
        this.logger.log(`📞 Fetching call status for: ${callId}`);
        return this.vapiService.getCallStatus(callId);
    }
    async testCall() {
        this.logger.log("🧪 Initiating test Vapi call");
        const testCallRequest = {
            phoneNumber: "+917566873233",
            customerName: "Test Customer",
            customerEmail: "test@adlyncsolutions.com",
            metadata: {
                source: "test-call",
                type: "demo",
            },
        };
        return this.vapiService.initiateCall(testCallRequest);
    }
    async handleVapiWebhook(body) {
        this.logger.log("🎙️ Vapi webhook received");
        this.logger.log("Webhook data:", JSON.stringify(body, null, 2));
        switch (body.type) {
            case "call-started":
                this.logger.log(`📞 Call started: ${body.call?.id}`);
                break;
            case "call-ended":
                this.logger.log(`📞 Call ended: ${body.call?.id}`);
                this.logger.log(`Duration: ${body.call?.duration} seconds`);
                break;
            case "transcript":
                this.logger.log(`💬 Transcript: ${body.transcript?.text}`);
                break;
            case "function-call":
                this.logger.log(`🔧 Function called: ${body.functionCall?.name}`);
                break;
            default:
                this.logger.log(`📨 Unknown event type: ${body.type}`);
        }
        return { status: "OK" };
    }
    async chatWithAssistant(chatData) {
        this.logger.log(`💬 VAPI Assistant chat from user: ${chatData.userId}`);
        this.logger.log(`📝 Message: ${chatData.message}`);
        return this.vapiService.chatWithAssistant(chatData);
    }
    healthCheck() {
        return {
            status: "OK",
            timestamp: new Date().toISOString(),
            service: "Vapi AI Voice Service",
        };
    }
};
exports.VapiController = VapiController;
__decorate([
    (0, common_1.Post)("create-assistant"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "createAssistant", null);
__decorate([
    (0, common_1.Get)("assistants"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "listAssistants", null);
__decorate([
    (0, common_1.Get)("phone-numbers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "listPhoneNumbers", null);
__decorate([
    (0, common_1.Post)("initiate-call"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitiateVapiCallDto]),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "initiateCall", null);
__decorate([
    (0, common_1.Get)("call-status/:callId"),
    __param(0, (0, common_1.Param)("callId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "getCallStatus", null);
__decorate([
    (0, common_1.Post)("test-call"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "testCall", null);
__decorate([
    (0, common_1.Post)("webhook"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "handleVapiWebhook", null);
__decorate([
    (0, common_1.Post)("assistant-chat"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VapiChatDto]),
    __metadata("design:returntype", Promise)
], VapiController.prototype, "chatWithAssistant", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], VapiController.prototype, "healthCheck", null);
exports.VapiController = VapiController = VapiController_1 = __decorate([
    (0, common_1.Controller)("vapi"),
    __metadata("design:paramtypes", [vapi_service_1.VapiService])
], VapiController);
//# sourceMappingURL=vapi.controller.js.map