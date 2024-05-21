export enum ZohoCalendarModule {
	CALENDARS = 'calendars',
	EVENTS = 'events',
}

export const moduleSingularForm: Record<ZohoCalendarModule, string> = {
	[ZohoCalendarModule.CALENDARS]: 'calendar',
	[ZohoCalendarModule.EVENTS]: 'event',
};
