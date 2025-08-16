export declare class InitiateCallDto {
    to: string;
    from: string;
    url?: string;
    method?: 'GET' | 'POST';
    statusCallback?: string;
    statusCallbackMethod?: 'GET' | 'POST';
    record?: 'true' | 'false';
    timeout?: string;
}
export declare class SendSmsDto {
    to: string;
    from: string;
    body: string;
    statusCallback?: string;
    mediaUrl?: string;
}
export declare class SendWhatsAppDto {
    to: string;
    from: string;
    body: string;
    mediaUrl?: string;
    statusCallback?: string;
}
export declare class BulkWhatsAppDto {
    phoneNumbers: string[];
    from: string;
    body: string;
    mediaUrl?: string;
    statusCallback?: string;
    delayBetweenMessages?: string;
}
export declare class SendEmailDto {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content: string;
        type: string;
    }>;
}
export declare class TwilioResponseDto {
    success: boolean;
    sid?: string;
    message: string;
    data?: any;
    error?: any;
}
export declare class TwilioWebhookDto {
    CallSid?: string;
    MessageSid?: string;
    From?: string;
    To?: string;
    CallStatus?: string;
    MessageStatus?: string;
    Body?: string;
    Digits?: string;
    RecordingUrl?: string;
    CallDuration?: string;
}
