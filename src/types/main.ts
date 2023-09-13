export enum Status {
    Connect,
    Loader,
    Guess,
    Won,
    Fail
}

export interface MainState {
    loader: boolean;
    notification: string;
    status: Status;
    showOK: boolean;
    games: any[];
    totalGames: number;
    currentPage: number;
    totalPages: number;
}

export enum MainActionTypes {
    SET_LOADER = 'SET_LOADER',
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    SET_SHOW_OK = 'SET_SHOW_OK',
    SET_STATUS = 'SET_STATUS',
    PUSH_GAME = 'PUSH_GAME',
    CLEAR_GAMES = 'CLEAR_GAMES',
    SET_TOTAL_GAMES = 'SET_TOTAL_GAMES',
    SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
    SET_TOTAL_PAGES = 'SET_TOTAL_PAGES'
} 
interface SetLoaderAction {
    type: MainActionTypes.SET_LOADER;
    payload: boolean;
}
interface SetNotificationAction {
    type: MainActionTypes.SET_NOTIFICATION;
    payload: string;
}
interface SetShowOkAction {
    type: MainActionTypes.SET_SHOW_OK;
    payload: boolean;
}
interface PushGameAction {
    type: MainActionTypes.PUSH_GAME;
    payload: any;
}
interface ClearGamesAction {
    type: MainActionTypes.CLEAR_GAMES;
}
interface SetStatusAction {
    type: MainActionTypes.SET_STATUS;
    payload: Status;
}
interface SetTotalGamesAction {
    type: MainActionTypes.SET_TOTAL_GAMES;
    payload: number;
}
interface SetCurrentPageAction {
    type: MainActionTypes.SET_CURRENT_PAGE;
    payload: number;
}
interface SetTotalPagesAction {
    type: MainActionTypes.SET_TOTAL_PAGES;
    payload: number;
}
export type MainAction = 
    SetLoaderAction |
    SetNotificationAction |
    SetShowOkAction |
    SetStatusAction |
    PushGameAction |
    ClearGamesAction |
    SetTotalGamesAction |
    SetCurrentPageAction |
    SetTotalPagesAction;
