export const FETCH_STATS = "FETCH_STATS";

export interface StatsBotsCountry {
    count: number,
    percent: number,
    country_code: string,
    country: string,
}

interface StatsBots {
    counts: {
        total: number,
        totalToday: number,
        online: number,
        offline: number,
        dead: number,
        withPermissions: number,
        permissionless: number,
    }
    countries: StatsBotsCountry[],
}

interface LogTimeline {
    date: string,
    count: number,
    category: string,
}

interface StatsInjects {
    timelines: LogTimeline[],
    counts: {
        banks: number,
        credit_cards: number,
        stealers: number,
        crypt: number,
        shops: number,
        emails: number,
        wallets: number,
        sum: number,
    }
}

interface StatsLogs {
    timelines: LogTimeline[],
    counts: {
        smslist: number,
        hidesms: number,
        googleauth: number,
        otheraccounts: number,
        pushlist: number,
        datakeylogger: number,
        sum: number,
    }
}

export interface StatsState {
    isLoaded: boolean,
    bots: StatsBots,
    injects: StatsInjects,
    logs: StatsLogs,
}

export type GetStatsPayload = Omit<StatsState, "isLoaded">;

export interface GetStatsAction {
    type: typeof FETCH_STATS,
    payload: GetStatsPayload,
}


export type StatsActionTypes = GetStatsAction;
