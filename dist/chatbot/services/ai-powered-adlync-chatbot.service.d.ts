import { ConfigService } from '@nestjs/config';
interface ChatSession {
    id: string;
    userId?: string;
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }>;
    createdAt: Date;
    lastActivity: Date;
}
interface ChatResponse {
    message: string;
    sessionId: string;
    isFromKnowledgeBase: boolean;
    confidence?: number;
    suggestedActions?: string[];
    timestamp: Date;
}
export declare class AIPoweredAdlyncChatbotService {
    private configService;
    private readonly logger;
    private sessions;
    private readonly sessionTimeout;
    private openai;
    private readonly adlyncKnowledgeBase;
    constructor(configService: ConfigService);
    processMessage(message: string, sessionId?: string, userId?: string): Promise<ChatResponse>;
    private generateAIResponse;
    private generateFallbackResponse;
    private generateSuggestedActions;
    private getOrCreateSession;
    private cleanupExpiredSessions;
    getSessionHistory(sessionId: string): Promise<ChatSession | null>;
    initializeKnowledgeBase(serviceData?: string): Promise<void>;
    getKnowledgeBaseStats(): Promise<{
        totalDocuments: number;
        categories: string[];
        lastProcessed: Date | null;
    }>;
    clearKnowledgeBase(): Promise<void>;
}
export {};
