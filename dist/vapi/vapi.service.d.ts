import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
export interface VapiCallRequest {
    phoneNumber: string;
    assistantId?: string;
    customerName?: string;
    customerEmail?: string;
    metadata?: Record<string, any>;
}
export interface VapiCallResponse {
    success: boolean;
    callId?: string;
    message: string;
    data?: any;
}
export declare class VapiService {
    private readonly config;
    private readonly httpService;
    private readonly logger;
    private readonly privateKey;
    private readonly publicKey;
    private readonly baseUrl;
    constructor(config: ConfigService, httpService: HttpService);
    private getTwilioAccountSid;
    private validateConfiguration;
    createAssistant(): Promise<VapiCallResponse>;
    initiateCall(callRequest: VapiCallRequest): Promise<VapiCallResponse>;
    getCallStatus(callId: string): Promise<VapiCallResponse>;
    listAssistants(): Promise<VapiCallResponse>;
    listPhoneNumbers(): Promise<VapiCallResponse>;
    chatWithAssistant(chatRequest: {
        message: string;
        userId: string;
        source?: string;
        assistantId?: string;
    }): Promise<any>;
    private handleError;
}
