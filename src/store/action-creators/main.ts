import { MainAction, MainActionTypes, Status } from "../../types/main";

export function SetLoader(loader: boolean): MainAction {
    return {type: MainActionTypes.SET_LOADER, payload: loader}
}
export function SetNotification(notification: string): MainAction {
    return {type: MainActionTypes.SET_NOTIFICATION, payload: notification}
}
export function SetShowOk(showOk: boolean): MainAction {
    return {type: MainActionTypes.SET_SHOW_OK, payload: showOk}
}
export function SetStatus(status: Status): MainAction {
    return {type: MainActionTypes.SET_STATUS, payload: status}
}
export function PushGame(game: any): MainAction {
    return {type: MainActionTypes.PUSH_GAME, payload: game}
}
export function ClearGames(): MainAction {
    return {type: MainActionTypes.CLEAR_GAMES}
}
export function SetCurrentPage(currentPage: number): MainAction {
    return {type: MainActionTypes.SET_CURRENT_PAGE, payload: currentPage}
}
export function SetTotalGames(totalGames: number): MainAction {
    return {type: MainActionTypes.SET_TOTAL_GAMES, payload: totalGames}
}
export function SetTotalPages(totalPages: number): MainAction {
    return {type: MainActionTypes.SET_TOTAL_PAGES, payload: totalPages}
}