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
var TwilioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const qs = require("qs");
let TwilioService = TwilioService_1 = class TwilioService {
    constructor(config, httpService) {
        this.config = config;
        this.httpService = httpService;
        this.logger = new common_1.Logger(TwilioService_1.name);
        this.accountSid = this.config.get('twilio.accountSid');
        this.authToken = this.config.get('twilio.authToken');
        this.sendGridApiKey = this.config.get('twilio.sendGridApiKey');
        this.appBaseUrl = this.config.get('app.baseUrl');
        this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
        this.validateConfiguration();
    }
    validateConfiguration() {
        const requiredConfigs = [
            { key: 'accountSid', value: this.accountSid },
            { key: 'authToken', value: this.authToken },
        ];
        const missingConfigs = requiredConfigs.filter(config => !config.value);
        if (missingConfigs.length > 0) {
            const missingKeys = missingConfigs.map(config => config.key).join(', ');
            throw new Error(`Missing required Twilio configuration: ${missingKeys}`);
        }
        this.logger.log('🔍 Twilio Configuration Status:');
        this.logger.log(`✅ Account SID: ${this.accountSid ? 'Configured' : 'Missing'}`);
        this.logger.log(`✅ Auth Token: ${this.authToken ? 'Configured' : 'Missing'}`);
        this.logger.log(`📞 Phone Number: ${this.config.get('twilio.phoneNumber') ? 'Configured' : 'Not configured (optional for testing)'}`);
        this.logger.log(`💬 WhatsApp Number: ${this.config.get('twilio.whatsappNumber') ? 'Configured' : 'Not configured (optional for testing)'}`);
        this.logger.log(`📧 SendGrid API Key: ${this.sendGridApiKey ? 'Configured' : 'Not configured (optional for testing)'}`);
    }
    async initiateCall(callData) {
        try {
            this.logger.log(`Initiating call from ${callData.from} to ${callData.to}`);
            const webhookUrl = callData.url || `${this.appBaseUrl}/twilio/voice-response`;
            console.log('🔍 DEBUG - Call Configuration:');
            console.log('App Base URL:', this.appBaseUrl);
            console.log('Webhook URL:', webhookUrl);
            console.log('To:', callData.to);
            console.log('From:', callData.from);
            const payload = qs.stringify({
                To: callData.to,
                From: callData.from,
                Url: webhookUrl,
                Method: callData.method || 'POST',
                StatusCallback: callData.statusCallback || `${this.appBaseUrl}/twilio/call-status`,
                StatusCallbackMethod: callData.statusCallbackMethod || 'POST',
                Record: callData.record || 'false',
                Timeout: callData.timeout || '60',
            });
            console.log('🔍 DEBUG - Twilio Call Request:');
            console.log('Account SID:', this.accountSid);
            console.log('Payload:', payload);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/Calls.json`, payload, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            }));
            this.logger.log(`Call initiated successfully. CallSid: ${response.data?.sid}`);
            return {
                success: true,
                sid: response.data?.sid,
                message: 'Call initiated successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to initiate call');
        }
    }
    async getCallStatus(callSid) {
        try {
            this.logger.log(`Fetching call status for CallSid: ${callSid}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/Calls/${callSid}.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            return {
                success: true,
                sid: callSid,
                message: 'Call status retrieved successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, `Failed to get call status for CallSid: ${callSid}`);
        }
    }
    async sendSms(smsData) {
        try {
            this.logger.log(`Sending SMS from ${smsData.from} to ${smsData.to}`);
            const payload = qs.stringify({
                To: smsData.to,
                From: smsData.from,
                Body: smsData.body,
                StatusCallback: smsData.statusCallback || `${this.appBaseUrl}/twilio/sms-status`,
                ...(smsData.mediaUrl && { MediaUrl: smsData.mediaUrl }),
            });
            console.log('🔍 DEBUG - Twilio SMS Request:');
            console.log('Payload:', payload);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            }));
            this.logger.log(`SMS sent successfully. MessageSid: ${response.data?.sid}`);
            return {
                success: true,
                sid: response.data?.sid,
                message: 'SMS sent successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to send SMS');
        }
    }
    async getSmsStatus(messageSid) {
        try {
            this.logger.log(`Fetching SMS status for MessageSid: ${messageSid}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/Messages/${messageSid}.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            return {
                success: true,
                sid: messageSid,
                message: 'SMS status retrieved successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, `Failed to get SMS status for MessageSid: ${messageSid}`);
        }
    }
    async sendWhatsApp(whatsAppData) {
        try {
            this.logger.log(`Sending WhatsApp from ${whatsAppData.from} to ${whatsAppData.to}`);
            const payload = qs.stringify({
                To: whatsAppData.to.startsWith('whatsapp:') ? whatsAppData.to : `whatsapp:${whatsAppData.to}`,
                From: whatsAppData.from.startsWith('whatsapp:') ? whatsAppData.from : `whatsapp:${whatsAppData.from}`,
                Body: whatsAppData.body,
                StatusCallback: whatsAppData.statusCallback || `${this.appBaseUrl}/twilio/whatsapp-status`,
                ...(whatsAppData.mediaUrl && { MediaUrl: whatsAppData.mediaUrl }),
            });
            console.log('🔍 DEBUG - Twilio WhatsApp Request:');
            console.log('Payload:', payload);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            }));
            this.logger.log(`WhatsApp sent successfully. MessageSid: ${response.data?.sid}`);
            return {
                success: true,
                sid: response.data?.sid,
                message: 'WhatsApp message sent successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to send WhatsApp message');
        }
    }
    async sendBulkWhatsApp(bulkData) {
        try {
            this.logger.log(`Sending bulk WhatsApp to ${bulkData.phoneNumbers.length} numbers`);
            const delay = parseInt(bulkData.delayBetweenMessages || '2');
            const results = [];
            const errors = [];
            for (let i = 0; i < bulkData.phoneNumbers.length; i++) {
                const phoneNumber = bulkData.phoneNumbers[i];
                try {
                    this.logger.log(`Sending WhatsApp ${i + 1}/${bulkData.phoneNumbers.length} to ${phoneNumber}`);
                    const payload = qs.stringify({
                        To: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`,
                        From: bulkData.from.startsWith('whatsapp:') ? bulkData.from : `whatsapp:${bulkData.from}`,
                        Body: bulkData.body,
                        StatusCallback: bulkData.statusCallback || `${this.appBaseUrl}/twilio/whatsapp-status`,
                        ...(bulkData.mediaUrl && { MediaUrl: bulkData.mediaUrl }),
                    });
                    const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
                        auth: {
                            username: this.accountSid,
                            password: this.authToken,
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        timeout: 10000,
                    }));
                    results.push({
                        phoneNumber,
                        success: true,
                        messageSid: response.data?.sid,
                        status: response.data?.status,
                    });
                    this.logger.log(`✅ WhatsApp sent to ${phoneNumber}. MessageSid: ${response.data?.sid}`);
                    if (i < bulkData.phoneNumbers.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, delay * 1000));
                    }
                }
                catch (error) {
                    this.logger.error(`❌ Failed to send WhatsApp to ${phoneNumber}:`, error.message);
                    errors.push({
                        phoneNumber,
                        success: false,
                        error: error.response?.data || error.message,
                    });
                }
            }
            const successCount = results.length;
            const errorCount = errors.length;
            return {
                success: successCount > 0,
                message: `Bulk WhatsApp completed. ${successCount} sent, ${errorCount} failed.`,
                data: {
                    summary: {
                        total: bulkData.phoneNumbers.length,
                        successful: successCount,
                        failed: errorCount,
                    },
                    results,
                    errors,
                },
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to send bulk WhatsApp messages');
        }
    }
    async sendEmail(emailData) {
        try {
            this.logger.log(`Sending email from ${emailData.from} to ${emailData.to}`);
            if (!this.sendGridApiKey) {
                throw new common_1.BadRequestException('SendGrid API key not configured');
            }
            const payload = {
                personalizations: [
                    {
                        to: [{ email: emailData.to }],
                        subject: emailData.subject,
                    },
                ],
                from: { email: emailData.from },
                content: [
                    {
                        type: 'text/plain',
                        value: emailData.text,
                    },
                    ...(emailData.html ? [{ type: 'text/html', value: emailData.html }] : []),
                ],
                ...(emailData.attachments && { attachments: emailData.attachments }),
            };
            console.log('🔍 DEBUG - SendGrid Email Request:');
            console.log('Payload:', JSON.stringify(payload, null, 2));
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://api.sendgrid.com/v3/mail/send', payload, {
                headers: {
                    'Authorization': `Bearer ${this.sendGridApiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }));
            this.logger.log('Email sent successfully via SendGrid');
            return {
                success: true,
                message: 'Email sent successfully',
                data: { status: response.status, headers: response.headers },
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to send email');
        }
    }
    async getAccountInfo() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            return {
                success: true,
                message: 'Account info retrieved successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to get account info');
        }
    }
    async getPhoneNumbers() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/IncomingPhoneNumbers.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            return {
                success: true,
                message: 'Phone numbers retrieved successfully',
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to get phone numbers');
        }
    }
    async getAvailableNumbers(countryCode = 'US') {
        try {
            this.logger.log(`Fetching available numbers for country: ${countryCode}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/AvailablePhoneNumbers/${countryCode}/Local.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                params: {
                    PageSize: 10,
                },
                timeout: 10000,
            }));
            return {
                success: true,
                message: `Available numbers for ${countryCode} retrieved successfully`,
                data: response.data,
            };
        }
        catch (error) {
            return this.handleError(error, `Failed to get available numbers for ${countryCode}`);
        }
    }
    async getTrialInfo() {
        try {
            this.logger.log('Fetching trial account information');
            const accountResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            const balanceResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/Balance.json`, {
                auth: {
                    username: this.accountSid,
                    password: this.authToken,
                },
                timeout: 10000,
            }));
            const trialInfo = {
                account: accountResponse.data,
                balance: balanceResponse.data,
                isTrial: accountResponse.data.type === 'Trial',
                status: accountResponse.data.status,
                dateCreated: accountResponse.data.date_created,
            };
            return {
                success: true,
                message: 'Trial information retrieved successfully',
                data: trialInfo,
            };
        }
        catch (error) {
            return this.handleError(error, 'Failed to get trial information');
        }
    }
    handleError(error, message) {
        this.logger.error(`${message}: ${error.message}`, error.stack);
        console.log('❌ DEBUG - Twilio Error Details:');
        console.log('Error message:', error.message);
        console.log('Error response status:', error.response?.status);
        console.log('Error response data:', error.response?.data);
        if (error instanceof axios_2.AxiosError) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            if (status === 400) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Invalid request parameters',
                    error: errorData,
                });
            }
            if (status === 401) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Invalid Twilio credentials',
                    error: errorData,
                });
            }
            if (status === 403) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: 'Insufficient permissions or account suspended',
                    error: errorData,
                });
            }
            if (status >= 500) {
                throw new common_1.InternalServerErrorException({
                    success: false,
                    message: 'Twilio service temporarily unavailable',
                    error: errorData,
                });
            }
        }
        throw new common_1.InternalServerErrorException({
            success: false,
            message,
            error: error.message,
        });
    }
};
exports.TwilioService = TwilioService;
exports.TwilioService = TwilioService = TwilioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], TwilioService);
//# sourceMappingURL=twilio.service.js.map