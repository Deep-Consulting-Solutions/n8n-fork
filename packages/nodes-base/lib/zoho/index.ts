import { ClientLib, ClientLibCM, ZohoConfig } from '@deep-consulting-solutions/zoho-utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import redis from '../redis';

let zohoClientInstance: ClientLibCM | null = null;
let zohoClientInstanceLegacy: ClientLib | null = null;

export const initZohoClient = (): void => {
	const crmBase = process.env.ZOHO_CRM_BASE_URL || 'https://www.zohoapis.com/crm';

	const zohoConfig: ZohoConfig = {
		accountsUrl: process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.com',
		clientID: process.env.ZOHO_CLIENT_ID || '',
		clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
		refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
		crm: {
			apiUrl: `${crmBase}/v2`,
			apiUrlV2_1: `${crmBase}/v2`,
			apiUrlV3: `${crmBase}/v3`,
		},
		sign: {
			apiUrl: process.env.ZOHO_SIGN_BASE_URL || 'https://sign.zoho.com/api/v1',
			fieldTypeIds: {
				Signature: process.env.ZOHO_SIGN_SIGNATURE_FIELD_TYPE_ID,
				Date: process.env.ZOHO_SIGN_DATE_FIELD_TYPE_ID,
			},
		},
		books: {
			apiUrl: process.env.ZOHO_BOOKS_BASE_URL || 'https://www.zohoapis.com/books/v3',
			orgID: process.env.ZOHO_BOOKS_ORG_ID || '',
		},
		writer: {
			apiUrl: process.env.ZOHO_WRITER_URL || 'https://www.zohoapis.com/writer/api/v1',
        },
		desk: {
			apiUrl: process.env.ZOHO_DESK_BASE_URL || 'https://desk.zoho.com/api/v1',
			orgID: process.env.ZOHO_DESK_ORG_ID || '',
		},
		calendar: {
			apiUrl: process.env.ZOHO_CALENDAR_BASE_URL || 'https://calendar.zoho.com/api/v1',
		},
	};

	// eslint-disable-next-line
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	zohoClientInstance = new ClientLibCM(
		process.env.MANAGER_URL || '',
		redis as any,
		zohoConfig,
		true,
	);
	zohoClientInstanceLegacy = new ClientLib(process.env.MANAGER_URL!, redis, zohoConfig, false);

	const reportIncident = async (
		correlationId: string,
		retryAttempt: number,
		axiosRequestConfig: AxiosRequestConfig,
		error: Error,
		response?: AxiosResponse,
	) => {
		if ([0, 5, 8].includes(retryAttempt)) {
			const body = {
				correlationId,
				error: {
					message: error.message,
					stack: error.stack,
				},
				request: {
					originalUrl: axiosRequestConfig.baseURL || axiosRequestConfig.url || '',
					method: axiosRequestConfig.method,
					body:
						typeof axiosRequestConfig.data === 'string'
							? JSON.parse(axiosRequestConfig.data)
							: axiosRequestConfig.data,
				},
				extras: {
					retryAttempt,
					requestHeaders: axiosRequestConfig.headers,
					...(response
						? {
								zohoResponse: {
									statusCode: response.status,
									headers: response.headers,
									body: response.data,
								},
						  }
						: {}),
				},
			};

			await axios.post(`${process.env.BASE_URL}/package/incident-handling/incidents`, body, {
				headers: {
					Authorization: process.env.INCIDENT_HANDLING_ROUTES_API_TOKEN,
				},
			});
		}
	};

	const resolveIncident = async (correlationId: string) => {
		await axios.post(
			`${process.env.BASE_URL}/package/incident-handling/incidents/${correlationId}/resolve`,
		);
	};

	zohoClientInstance.setReportIncidentFn(reportIncident);
	zohoClientInstance.setResolveIncidentFn(resolveIncident);
};

export const zohoClient = (): ClientLibCM => {
	if (!zohoClientInstance) {
		initZohoClient();

		if (!zohoClientInstance) {
			throw new Error('zohoClient lib initialization failed');
		}
	}

	return zohoClientInstance;
};

// needed for downloading invoices
export const zohoClientLegacy = (): ClientLib => {
	if (!zohoClientInstanceLegacy) {
		initZohoClient();

		if (!zohoClientInstanceLegacy) {
			throw new Error('zohoClientLegacy lib initialization failed');
		}
	}

	return zohoClientInstanceLegacy;
};
