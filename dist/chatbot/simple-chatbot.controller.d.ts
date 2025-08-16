import { AIPoweredAdlyncChatbotService } from './services/ai-powered-adlync-chatbot.service';
export interface ChatRequest {
    message: string;
    sessionId?: string;
}
export interface ChatResponse {
    message: string;
    suggestedActions?: string[];
}
export declare class SimpleChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: AIPoweredAdlyncChatbotService);
    health(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        message: string;
    }>;
    chat(chatRequest: ChatRequest): Promise<ChatResponse>;
}
