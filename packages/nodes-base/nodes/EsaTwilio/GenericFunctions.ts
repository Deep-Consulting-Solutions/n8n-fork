import crypto from 'crypto';
import {
	type IExecuteFunctions,
	type IHookFunctions,
	type IDataObject,
	type ILoadOptionsFunctions,
	type IHttpRequestMethods,
	NodeApiError,
	ApplicationError,
} from 'n8n-workflow';
import sortBy from 'lodash.sortby';
import axios from 'axios';
import type { AxiosError } from 'axios';

import type { OptionsWithUri } from 'request';
import { DEFAULT_MESSAGING_SERVICE_CUSTOM_SID, messagingServiceValue } from './descriptions';
import type { EsaApp, MessagingService, MessagingServicesResponse } from './types';

const generateESAAuthCRMToken = async (
	options: Required<Pick<EsaApp, 'zohoCrmSecretKey' | 'zohoUserDetails' | 'appName'>>,
): Promise<{ token: string; tokenForAuthHeader: string }> => {
	const { zohoCrmSecretKey, zohoUserDetails, appName } = options;

	if (appName.toLowerCase().includes('bmh')) {
		const timestamp = Date.now();
		const signatureString = `${timestamp}:${zohoUserDetails.id}`;
		const createdSignature = crypto
			.createHmac('sha1', zohoCrmSecretKey)
			.update(signatureString)
			.digest('base64');

		const token = Buffer.from(`${createdSignature}:${signatureString}`).toString('base64');
		return {
			token,
			tokenForAuthHeader: `Bearer ${token}`,
		};
	}

	const nowTimestamp = Date.now();
	const data = `${nowTimestamp}|${JSON.stringify(options.zohoUserDetails)}`;

	const signature = crypto.createHmac('sha1', zohoCrmSecretKey).update(data).digest('base64');
	const signatureWithData = `${signature}|${data}`;
	const token = Buffer.from(signatureWithData).toString('base64');

	return {
		token,
		tokenForAuthHeader: `Bearer ${token}`,
	};
};

export const getESAApps = (): EsaApp[] => {
	let esaApps!: EsaApp[];

	try {
		const esaAppsString = process.env.ESA_APPS;
		if (esaAppsString) {
			esaApps = JSON.parse(esaAppsString) as EsaApp[];
		}
	} catch {
		return [];
	}

	if (Array.isArray(esaApps)) {
		return esaApps;
	}

	return [];
};

/**
 * Make an API request to Twilio
 *
 */
export async function twilioApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	esaAppKey: string,
	query?: IDataObject,
): Promise<any> {
	const credentials = (await this.getCredentials('twilioApi')) as {
		accountSid: string;
		authType: 'authToken' | 'apiKey';
		authToken: string;
		apiKeySid: string;
		apiKeySecret: string;
	};

	if (query === undefined) {
		query = {};
	}

	const options: OptionsWithUri = {
		method,
		form: body,
		qs: query,
		uri: `https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}${endpoint}`,
		json: true,
	};

	const esaApps = getESAApps();

	const esaApp = Array.isArray(esaApps)
		? esaApps.find((esaApp) => esaApp.appKey === esaAppKey)
		: null;

	let error = { message: 'esaApp config not found in ESA Twilio node' };
	if (!esaApp) throw new NodeApiError(this.getNode(), error, error);

	const { zohoCrmSecretKey, zohoUserDetails, appName } = esaApp;

	if (!zohoCrmSecretKey) {
		error = { message: 'zohoCrmSecretKey not found in esaApp config' };
		throw new NodeApiError(this.getNode(), error, error);
	}
	if (!zohoUserDetails?.id) {
		error = { message: 'zohoUserDetails.id in esaApp config should be defined' };
		throw new NodeApiError(this.getNode(), error, error);
	}
	const { tokenForAuthHeader } = await generateESAAuthCRMToken({
		zohoCrmSecretKey,
		zohoUserDetails,
		appName,
	});

	return await axios.post(`${process.env.BASE_URL}/package/sms/message/send-message`, options, {
		headers: {
			Authorization: tokenForAuthHeader,
		},
	});
}

const XML_CHAR_MAP: { [key: string]: string } = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&apos;',
};

export function escapeXml(str: string) {
	return str.replace(/[<>&"']/g, (ch: string) => {
		return XML_CHAR_MAP[ch];
	});
}

export const findOptedOutChat = async (phone: string) => {
	const baseURL = process.env.DCS_NOCODB_BASE_URL;
	if (!baseURL) {
		throw new Error('No base URL configured!');
	}
	const route = '/api/v1/db/data/v1/CustomBackend/Chat';
	const where = `where=(Phone,eq,${encodeURIComponent(
		phone,
	)})~and(~not(OptingState,in,hard opt out,soft opt out))`;
	const fields = 'fields=Id';
	const limit = 'limit=1';
	const url = `${baseURL}${route}?${where}&${fields}&${limit}`;

	try {
		const response = await axios.get<{ list: any[] }>(url, {
			headers: {
				'xc-token': process.env.DCS_NOCODB_API_TOKEN,
			},
		});
		const list = response.data.list;
		if (list.length) {
			return list[0];
		}
		return null;
	} catch (e) {
		const error = e as AxiosError;
		throw new Error(`Failed to check opted out chats. ${error.message}. ${error.stack}`);
	}
};

export async function findAllMessagingServices(
	this: ILoadOptionsFunctions,
): Promise<MessagingService[]> {
	const credentials = (await this.getCredentials('twilioApi')) as {
		accountSid: string;
		authToken: string;
	};

	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	const { accountSid, authToken } = credentials;

	const url = 'https://messaging.twilio.com/v1/Services';
	const params = {
		PageSize: 1000,
	};
	const auth = {
		username: accountSid,
		password: authToken,
	};

	try {
		const response = await axios.get<MessagingServicesResponse>(url, {
			params,
			auth,
		});
		return response.data.services;
	} catch (e) {
		const error = e as AxiosError;
		throw new ApplicationError(
			`Failed to fetch messaging services. ${error.response?.data || error.message}.`,
		);
	}
}

export function transformFromDataToSendSMS({
	from,
	messagingService,
	number,
}: {
	from: string;
	messagingService: string;
	number: string;
}) {
	if (from === messagingServiceValue) {
		if (messagingService === DEFAULT_MESSAGING_SERVICE_CUSTOM_SID) {
			return process.env.SMS_MESSAGING_SERVICE_SID || '';
		}
		return messagingService;
	}
	return number;
}

export function transformToDataToSendSMS({
	to,
	fallbackPhone,
	useFallbackPhone,
}: {
	to: string;
	fallbackPhone: string;
	useFallbackPhone: boolean;
}) {
	if (useFallbackPhone) {
		return fallbackPhone;
	}
	return to;
}

export function transformDataToSendSMS(
	{
		from,
		to,
		message,
		toWhatsapp,
		messagingService,
		number,
		mediaUrls,
		useFallbackPhone,
		fallbackPhone,
	}: {
		from: string;
		to: string;
		message: string;
		toWhatsapp: boolean;
		messagingService: string;
		fallbackPhone: string;
		number: string;
		mediaUrls: string[];
		useFallbackPhone: boolean;
	},
	body: IDataObject,
) {
	body.From = transformFromDataToSendSMS({
		from,
		messagingService,
		number,
	});
	body.To = transformToDataToSendSMS({
		to,
		fallbackPhone,
		useFallbackPhone,
	});
	body.Body = message || '';
	if (mediaUrls.length) {
		body.MediaUrl = mediaUrls;
	}

	if (toWhatsapp) {
		body.From = `whatsapp:${body.From}`;
		body.To = `whatsapp:${body.To}`;
	}
	return body;
}

/**
 * Retrieve all messages services, sorted alphabetically.
 */
export async function getMessagingServices(this: ILoadOptionsFunctions) {
	const messagingServices = await findAllMessagingServices.call(this);

	const options = messagingServices.map(({ sid, friendly_name }) => ({
		name: friendly_name,
		value: sid,
	}));

	return [
		{ name: 'DEFAULT SMS MESSAGING SERVICE', value: DEFAULT_MESSAGING_SERVICE_CUSTOM_SID },
	].concat(sortBy(options, (o) => o.name));
}
//
