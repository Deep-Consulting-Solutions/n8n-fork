/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity } from 'typeorm';

import GenericEntity from './GenericEntity';

@Entity()
export class ServerIncident extends GenericEntity {
	@Column({ nullable: true })
	API: string;

	@Column({ nullable: true })
	APIMethod: string;

	@Column({ type: 'json', nullable: true })
	APIBody: string;

	@Column({ nullable: true })
	queueName: string;

	@Column()
	errorMessage: string;

	@Column({ nullable: true })
	errorStackTrace: string;

	@Column()
	incidentTime: Date;

	@Column({ type: 'json', nullable: true })
	additionalInformation: string;

	@Column({ nullable: true })
	zohoDeskTicketId: string;

	@Column({ nullable: true })
	correlationId: string;

	@Column({ default: false })
	isResolved: boolean;
}
