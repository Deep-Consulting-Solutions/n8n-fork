import type { AuthenticatedRequest } from '@/requests';
import type { EsaEnumData } from '@/databases/entities/EsaEnumData';
import type { EsaEnums } from '@/databases/entities/EsaEnums';

export declare namespace EnumsRequest {
	type CreateUpdatePayload = Omit<EsaEnumData, 'id'> & { id?: unknown; esaEnumId?: string };
	type EnumsSetPayload = Omit<EsaEnums, 'id'> & { id?: unknown };

	type GetAll = AuthenticatedRequest;
	type Get = AuthenticatedRequest<{ id: string }, {}, {}, {}>;
	type Create = AuthenticatedRequest<{}, {}, CreateUpdatePayload, {}>;
	type CreateEnumSet = AuthenticatedRequest<{}, {}, EsaEnums, {}>;
	type Update = AuthenticatedRequest<{ id: string }, {}, CreateUpdatePayload, {}>;
	type Delete = Get;
}
