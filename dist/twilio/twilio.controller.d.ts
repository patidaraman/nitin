import { Response } from 'express';
import { TwilioService } from './twilio.service';
import { InitiateCallDto, SendSmsDto, SendWhatsAppDto, SendEmailDto, BulkWhatsAppDto, TwilioResponseDto } from './dto/twilio.dto';
export declare class TwilioController {
    private readonly twilioService;
    private readonly logger;
    constructor(twilioService: TwilioService);
    initiateCall(callData: InitiateCallDto): Promise<TwilioResponseDto>;
    getCallStatus(callSid: string): Promise<TwilioResponseDto>;
    sendSms(smsData: SendSmsDto): Promise<TwilioResponseDto>;
    getSmsStatus(messageSid: string): Promise<TwilioResponseDto>;
    sendWhatsApp(whatsAppData: SendWhatsAppDto): Promise<TwilioResponseDto>;
    sendBulkWhatsApp(bulkData: BulkWhatsAppDto): Promise<TwilioResponseDto>;
    sendEmail(emailData: SendEmailDto): Promise<TwilioResponseDto>;
    getAccountInfo(): Promise<TwilioResponseDto>;
    getPhoneNumbers(): Promise<TwilioResponseDto>;
    getAvailableNumbers(countryCode: string): Promise<TwilioResponseDto>;
    getTrialInfo(): Promise<TwilioResponseDto>;
    handleVoiceResponse(body: any, res: Response): void;
    handleGatherResponse(body: any, res: Response): void;
    handleRecordingComplete(body: any, res: Response): void;
    handleCallStatus(body: any, res: Response): void;
    handleSmsStatus(body: any, res: Response): void;
    handleWhatsAppStatus(body: any, res: Response): void;
    handleIncomingSms(body: any, res: Response): void;
    handleIncomingWhatsApp(body: any, res: Response): Promise<void>;
    private generateChatbotResponse;
    healthCheck(): {
        status: string;
        timestamp: string;
        service: string;
    };
}
