/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import type { AxiosError } from 'axios';

export const getProjectTables = async (projectId: string) => {
	const baseUrl = process.env.DCS_NOCODB_BASE_URL;
	const route = `/api/v1/db/meta/projects/${projectId}/tables`;
	const url = `${baseUrl}${route}`;

	try {
		const response = await axios.get<{ list: any[] }>(url, {
			headers: {
				'xc-token': process.env.DCS_NOCODB_API_TOKEN,
			},
		});
		const list = response.data.list;
		if (list.length) {
			return list;
		}
		return null;
	} catch (e) {
		const error = e as AxiosError;
		throw new Error(`Failed to check opted out chats. ${error.message}. ${error.stack}`);
	}
};
