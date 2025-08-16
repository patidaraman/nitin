import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InitiateCallDto, SendSmsDto, SendWhatsAppDto, SendEmailDto, BulkWhatsAppDto, TwilioResponseDto } from './dto/twilio.dto';
export declare class TwilioService {
    private readonly config;
    private readonly httpService;
    private readonly logger;
    private readonly accountSid;
    private readonly authToken;
    private readonly baseUrl;
    private readonly sendGridApiKey;
    private readonly appBaseUrl;
    constructor(config: ConfigService, httpService: HttpService);
    private validateConfiguration;
    initiateCall(callData: InitiateCallDto): Promise<TwilioResponseDto>;
    getCallStatus(callSid: string): Promise<TwilioResponseDto>;
    sendSms(smsData: SendSmsDto): Promise<TwilioResponseDto>;
    getSmsStatus(messageSid: string): Promise<TwilioResponseDto>;
    sendWhatsApp(whatsAppData: SendWhatsAppDto): Promise<TwilioResponseDto>;
    sendBulkWhatsApp(bulkData: BulkWhatsAppDto): Promise<TwilioResponseDto>;
    sendEmail(emailData: SendEmailDto): Promise<TwilioResponseDto>;
    getAccountInfo(): Promise<TwilioResponseDto>;
    getPhoneNumbers(): Promise<TwilioResponseDto>;
    getAvailableNumbers(countryCode?: string): Promise<TwilioResponseDto>;
    getTrialInfo(): Promise<TwilioResponseDto>;
    private handleError;
}
