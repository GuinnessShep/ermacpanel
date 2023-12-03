export const FETCH_COUNTS = "FETCH_COUNTS";
export const SET_COUNT = "SET_COUNT";

export interface CountsState {
    isLoaded: boolean,
    bots: number,
    banks: number,
    stealers: number,
    crypt: number,
    shops: number,
    emails: number,
    wallets: number,
    credit_cards: number,
    permissionless_bots: number,
    events: number,
}

export interface GetCountsPayload {
    bots: number,
    banks: number,
    stealers: number,
    crypt: number,
    shops: number,
    emails: number,
    wallets: number,
    credit_cards: number,
    permissionless_bots: number,
    events: number,
}

export interface GetCountsAction {
    type: typeof FETCH_COUNTS,
    payload: GetCountsPayload,
}

export interface SetCountAction {
    type: typeof SET_COUNT,
    payload: Partial<CountsState>,
}

export type CountsActionTypes = GetCountsAction | SetCountAction;
