import validator from 'validator';
import speakeasy from 'speakeasy';
import { validateEntity } from '@/GenericHelpers';
import { Authorized, Get, Post, RestController } from '@/decorators';
import { BadRequestError } from '@/ResponseHelper';
import {
	hashPassword,
	sanitizeUser,
	validatePassword,
} from '@/UserManagement/UserManagementHelper';
import { issueCookie } from '@/auth/jwt';
import { Response } from 'express';
import type { ILogger } from 'n8n-workflow';
import type { Config } from '@/config';
import { OwnerRequest } from '@/requests';
import type { IDatabaseCollections, IInternalHooksClass } from '@/Interfaces';
import type {
	CredentialsRepository,
	SettingsRepository,
	UserRepository,
	WorkflowRepository,
} from '@db/repositories';

@Authorized(['global', 'owner'])
@RestController('/owner')
export class OwnerController {
	private readonly config: Config;

	private readonly logger: ILogger;

	private readonly internalHooks: IInternalHooksClass;

	private readonly userRepository: UserRepository;

	private readonly settingsRepository: SettingsRepository;

	private readonly credentialsRepository: CredentialsRepository;

	private readonly workflowsRepository: WorkflowRepository;

	constructor({
		config,
		logger,
		internalHooks,
		repositories,
	}: {
		config: Config;
		logger: ILogger;
		internalHooks: IInternalHooksClass;
		repositories: Pick<IDatabaseCollections, 'User' | 'Settings' | 'Credentials' | 'Workflow'>;
	}) {
		this.config = config;
		this.logger = logger;
		this.internalHooks = internalHooks;
		this.userRepository = repositories.User;
		this.settingsRepository = repositories.Settings;
		this.credentialsRepository = repositories.Credentials;
		this.workflowsRepository = repositories.Workflow;
	}

	@Get('/pre-setup')
	async preSetup(): Promise<{ credentials: number; workflows: number }> {
		if (this.config.getEnv('userManagement.isInstanceOwnerSetUp')) {
			throw new BadRequestError('Instance owner already setup');
		}

		const [credentials, workflows] = await Promise.all([
			this.credentialsRepository.countBy({}),
			this.workflowsRepository.countBy({}),
		]);
		return { credentials, workflows };
	}

	/**
	 * Promote a shell into the owner of the n8n instance,
	 * and enable `isInstanceOwnerSetUp` setting.
	 */
	@Post('/setup')
	async setupOwner(req: OwnerRequest.Post, res: Response) {
		const { email, firstName, lastName, password, otpSecret, otp } = req.body;
		const { id: userId, globalRole } = req.user;

		if (this.config.getEnv('userManagement.isInstanceOwnerSetUp')) {
			this.logger.debug(
				'Request to claim instance ownership failed because instance owner already exists',
				{
					userId,
				},
			);
			throw new BadRequestError('Instance owner already setup');
		}

		if (!email || !validator.isEmail(email)) {
			this.logger.debug('Request to claim instance ownership failed because of invalid email', {
				userId,
				invalidEmail: email,
			});
			throw new BadRequestError('Invalid email address');
		}

		const validPassword = validatePassword(password);

		if (!firstName || !lastName) {
			this.logger.debug(
				'Request to claim instance ownership failed because of missing first name or last name in payload',
				{ userId, payload: req.body },
			);
			throw new BadRequestError('First and last names are mandatory');
		}

		if (!otpSecret || !otp) {
			this.logger.debug(
				'Request to claim instance ownership failed because of missing otpSecret or otp in payload',
				{ userId, payload: req.body },
			);
			throw new BadRequestError('otpSecret and otp are mandatory');
		}

		// TODO: This check should be in a middleware outside this class
		if (globalRole.scope === 'global' && globalRole.name !== 'owner') {
			this.logger.debug(
				'Request to claim instance ownership failed because user shell does not exist or has wrong role!',
				{
					userId,
				},
			);
			throw new BadRequestError('Invalid request');
		}

		const verified = speakeasy.totp.verify({
			secret: otpSecret,
			encoding: 'base32',
			token: otp,
		});

		if (!verified) {
			throw new BadRequestError('OTP token is not valid');
		}

		let owner = req.user;

		Object.assign(owner, {
			email,
			firstName,
			lastName,
			password: await hashPassword(validPassword),
			otpSecret,
		});

		await validateEntity(owner);

		owner = await this.userRepository.save(owner);

		this.logger.info('Owner was set up successfully', { userId });

		await this.settingsRepository.update(
			{ key: 'userManagement.isInstanceOwnerSetUp' },
			{ value: JSON.stringify(true) },
		);

		this.config.set('userManagement.isInstanceOwnerSetUp', true);

		this.logger.debug('Setting isInstanceOwnerSetUp updated successfully', { userId });

		await issueCookie(res, owner);

		void this.internalHooks.onInstanceOwnerSetup({ user_id: userId });

		return sanitizeUser(owner);
	}

	/**
	 * Persist that the instance owner setup has been skipped
	 */
	@Post('/skip-setup')
	async skipSetup() {
		await this.settingsRepository.update(
			{ key: 'userManagement.skipInstanceOwnerSetup' },
			{ value: JSON.stringify(true) },
		);

		this.config.set('userManagement.skipInstanceOwnerSetup', true);

		return { success: true };
	}
}
