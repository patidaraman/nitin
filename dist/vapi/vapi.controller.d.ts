import { VapiService, VapiCallResponse } from "./vapi.service";
export declare class InitiateVapiCallDto {
    phoneNumber: string;
    customerName?: string;
    customerEmail?: string;
    assistantId?: string;
    metadata?: Record<string, any>;
}
export declare class VapiChatDto {
    message: string;
    userId: string;
    source?: string;
    assistantId?: string;
}
export declare class VapiController {
    private readonly vapiService;
    private readonly logger;
    constructor(vapiService: VapiService);
    createAssistant(): Promise<VapiCallResponse>;
    listAssistants(): Promise<VapiCallResponse>;
    listPhoneNumbers(): Promise<VapiCallResponse>;
    initiateCall(callData: InitiateVapiCallDto): Promise<VapiCallResponse>;
    getCallStatus(callId: string): Promise<VapiCallResponse>;
    testCall(): Promise<VapiCallResponse>;
    handleVapiWebhook(body: any): Promise<{
        status: string;
    }>;
    chatWithAssistant(chatData: VapiChatDto): Promise<any>;
    healthCheck(): {
        status: string;
        timestamp: string;
        service: string;
    };
}
