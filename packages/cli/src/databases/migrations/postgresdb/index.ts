import type { Migration } from '@db/types';
import { InitialMigration1587669153312 } from './1587669153312-InitialMigration';
import { WebhookModel1589476000887 } from './1589476000887-WebhookModel';
import { CreateIndexStoppedAt1594828256133 } from './1594828256133-CreateIndexStoppedAt';
import { AddWebhookId1611144599516 } from './1611144599516-AddWebhookId';
import { MakeStoppedAtNullable1607431743768 } from './1607431743768-MakeStoppedAtNullable';
import { CreateTagEntity1617270242566 } from './1617270242566-CreateTagEntity';
import { UniqueWorkflowNames1620824779533 } from './1620824779533-UniqueWorkflowNames';
import { AddwaitTill1626176912946 } from './1626176912946-AddwaitTill';
import { UpdateWorkflowCredentials1630419189837 } from './1630419189837-UpdateWorkflowCredentials';
import { AddExecutionEntityIndexes1644422880309 } from './1644422880309-AddExecutionEntityIndexes';
import { IncreaseTypeVarcharLimit1646834195327 } from './1646834195327-IncreaseTypeVarcharLimit';
import { CreateUserManagement1646992772331 } from './1646992772331-CreateUserManagement';
import { LowerCaseUserEmail1648740597343 } from './1648740597343-LowerCaseUserEmail';
import { AddUserSettings1652367743993 } from './1652367743993-AddUserSettings';
import { CommunityNodes1652254514002 } from './1652254514002-CommunityNodes';
import { AddAPIKeyColumn1652905585850 } from './1652905585850-AddAPIKeyColumn';
import { IntroducePinData1654090467022 } from './1654090467022-IntroducePinData';
import { AddNodeIds1658932090381 } from './1658932090381-AddNodeIds';
import { AddJsonKeyPinData1659902242948 } from './1659902242948-AddJsonKeyPinData';
import { CreateCredentialsUserRole1660062385367 } from './1660062385367-CreateCredentialsUserRole';
import { WorkflowStatistics1664196174001 } from './1664196174001-WorkflowStatistics';
import { CreateWorkflowsEditorRole1663755770893 } from './1663755770893-CreateWorkflowsEditorRole';
import { CreateCredentialUsageTable1665484192212 } from './1665484192212-CreateCredentialUsageTable';
import { RemoveCredentialUsageTable1665754637025 } from './1665754637025-RemoveCredentialUsageTable';
import { AddWorkflowVersionIdColumn1669739707126 } from './1669739707126-AddWorkflowVersionIdColumn';
import { AddTriggerCountColumn1669823906995 } from './1669823906995-AddTriggerCountColumn';
import { RemoveWorkflowDataLoadedFlag1671726148421 } from './1671726148421-RemoveWorkflowDataLoadedFlag';
import { MessageEventBusDestinations1671535397530 } from './1671535397530-MessageEventBusDestinations';
import { DeleteExecutionsWithWorkflows1673268682475 } from './1673268682475-DeleteExecutionsWithWorkflows';
import { CreateLdapEntities1674509946020 } from '../common/1674509946020-CreateLdapEntities';
import { PurgeInvalidWorkflowConnections1675940580449 } from '../common/1675940580449-PurgeInvalidWorkflowConnections';
import { AddStatusToExecutions1674138566000 } from './1674138566000-AddStatusToExecutions';
import { MigrateExecutionStatus1676996103000 } from './1676996103000-MigrateExecutionStatus';
import { UpdateRunningExecutionStatus1677236854063 } from './1677236854063-UpdateRunningExecutionStatus';
import { CreateExecutionMetadataTable1679416281778 } from './1679416281778-CreateExecutionMetadataTable';
import { CreateVariables1677501636754 } from './1677501636754-CreateVariables';
import { AddUserActivatedProperty1681134145996 } from './1681134145996-AddUserActivatedProperty';
import { AddUserOTPSecret1681134145997 } from './1681134145997-AddUserOTPSecret';
import { AddSaveRequestLog1681134145998 } from './1681134145998-AddSaveRequestLog';
import { addIncidentHandlingTables1689942863738 } from './1689942863738-addIncidentHandlingTables';
import { dropConstraintOnSaveRequestLog1689942863739 } from './1689942863739-dropConstraintOnSaveRequestLog';
import { MigrateIntegerKeysToString1690000000000 } from './1690000000000-MigrateIntegerKeysToString';
import { SeparateExecutionData1690000000020 } from './1690000000020-SeparateExecutionData';
import { RemoveSkipOwnerSetup1681134145997 } from './1681134145997-RemoveSkipOwnerSetup';
import { addConstarinToSvaeRequestLog1694091729096 } from './1694091729096-addConstarinToSvaeRequestLog';
import { RemoveResetPasswordColumns1690000000030 } from '../common/1690000000030-RemoveResetPasswordColumns';
import { AddMissingPrimaryKeyOnExecutionData1690787606731 } from './1690787606731-AddMissingPrimaryKeyOnExecutionData';
import { CreateWorkflowNameIndex1691088862123 } from '../common/1691088862123-CreateWorkflowNameIndex';
import { AddMfaColumns1690000000030 } from './../common/1690000000040-AddMfaColumns';
import { CreateWorkflowHistoryTable1692967111175 } from '../common/1692967111175-CreateWorkflowHistoryTable';
import { DisallowOrphanExecutions1693554410387 } from '../common/1693554410387-DisallowOrphanExecutions';
import { ExecutionSoftDelete1693491613982 } from '../common/1693491613982-ExecutionSoftDelete';
import { AddWorkflowMetadata1695128658538 } from '../common/1695128658538-AddWorkflowMetadata';
import { MigrateToTimestampTz1694091729095 } from './1694091729095-MigrateToTimestampTz';
import { ModifyWorkflowHistoryNodesAndConnections1695829275184 } from '../common/1695829275184-ModifyWorkflowHistoryNodesAndConnections';
import { AddGlobalAdminRole1700571993961 } from '../common/1700571993961-AddGlobalAdminRole';
import { DropRoleMapping1705429061930 } from '../common/1705429061930-DropRoleMapping';
import { RemoveFailedExecutionStatus1711018413374 } from '../common/1711018413374-RemoveFailedExecutionStatus';
import { MoveSshKeysToDatabase1711390882123 } from '../common/1711390882123-MoveSshKeysToDatabase';
import { RemoveNodesAccess1712044305787 } from '../common/1712044305787-RemoveNodesAccess';
import { N8NTestingFramework1689942863738 } from './1689942865738-N8NTestingFramework';
import { ResumeWorkflowTimerTable1689949863759 } from './1689949863759-ResumeWorfklowTimer';
import { UpdateResumeWorfklowTimer1779949863759 } from './1779949863759-UpdateResumeWorfklowTimer';
import { UpdateResumeWorfklowTimer1879949869859 } from './1879949869859-UpdateResumeWorfklowTimer';
import { ResultDataResumeWorfklowTimer1899949999859 } from './1899949999859-ResultDataResumeWorfklowTimer';
import { ExecutionIdResumeWorkflowTimer1899949999969 } from './1899949999969-ExecutionIdResumeWorkflowTimer';
import { IdResumeWorkflowTimer1899999999969 } from './1899999999969-IdResumeWorkflowTimer';
import { UpdateIdTypeOnEntites1899999999979 } from './1899999999979-UpdateIdTypeOnEntites';
import { AddEnumsEntity1899999999989 } from './1899999999989-AddEnumsEntity';

export const postgresMigrations: Migration[] = [
	InitialMigration1587669153312,
	WebhookModel1589476000887,
	CreateIndexStoppedAt1594828256133,
	AddWebhookId1611144599516,
	MakeStoppedAtNullable1607431743768,
	CreateTagEntity1617270242566,
	UniqueWorkflowNames1620824779533,
	AddwaitTill1626176912946,
	UpdateWorkflowCredentials1630419189837,
	AddExecutionEntityIndexes1644422880309,
	IncreaseTypeVarcharLimit1646834195327,
	CreateUserManagement1646992772331,
	LowerCaseUserEmail1648740597343,
	AddUserSettings1652367743993,
	CommunityNodes1652254514002,
	AddAPIKeyColumn1652905585850,
	IntroducePinData1654090467022,
	CreateCredentialsUserRole1660062385367,
	AddNodeIds1658932090381,
	AddJsonKeyPinData1659902242948,
	CreateWorkflowsEditorRole1663755770893,
	CreateCredentialUsageTable1665484192212,
	RemoveCredentialUsageTable1665754637025,
	AddWorkflowVersionIdColumn1669739707126,
	WorkflowStatistics1664196174001,
	AddTriggerCountColumn1669823906995,
	RemoveWorkflowDataLoadedFlag1671726148421,
	MessageEventBusDestinations1671535397530,
	DeleteExecutionsWithWorkflows1673268682475,
	CreateLdapEntities1674509946020,
	PurgeInvalidWorkflowConnections1675940580449,
	AddStatusToExecutions1674138566000,
	MigrateExecutionStatus1676996103000,
	UpdateRunningExecutionStatus1677236854063,
	CreateExecutionMetadataTable1679416281778,
	CreateVariables1677501636754,
	AddUserActivatedProperty1681134145996,
	AddUserOTPSecret1681134145997,
	AddSaveRequestLog1681134145998,
	addIncidentHandlingTables1689942863738,
	dropConstraintOnSaveRequestLog1689942863739,
	MigrateIntegerKeysToString1690000000000,
	SeparateExecutionData1690000000020,
	RemoveSkipOwnerSetup1681134145997,
	addConstarinToSvaeRequestLog1694091729096,
	RemoveResetPasswordColumns1690000000030,
	AddMissingPrimaryKeyOnExecutionData1690787606731,
	CreateWorkflowNameIndex1691088862123,
	AddMfaColumns1690000000030,
	CreateWorkflowHistoryTable1692967111175,
	DisallowOrphanExecutions1693554410387,
	ExecutionSoftDelete1693491613982,
	AddWorkflowMetadata1695128658538,
	MigrateToTimestampTz1694091729095,
	ModifyWorkflowHistoryNodesAndConnections1695829275184,
	AddGlobalAdminRole1700571993961,
	DropRoleMapping1705429061930,
	RemoveFailedExecutionStatus1711018413374,
	MoveSshKeysToDatabase1711390882123,
	RemoveNodesAccess1712044305787,
	N8NTestingFramework1689942863738,
	ResumeWorkflowTimerTable1689949863759,
	UpdateResumeWorfklowTimer1779949863759,
	UpdateResumeWorfklowTimer1879949869859,
	ResultDataResumeWorfklowTimer1899949999859,
	ExecutionIdResumeWorkflowTimer1899949999969,
	IdResumeWorkflowTimer1899999999969,
	UpdateIdTypeOnEntites1899999999979,
	AddEnumsEntity1899999999989,
];
