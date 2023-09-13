import { MainState, MainAction, MainActionTypes } from "../../types/main"
import { Status } from "../../types/main"

const initialState: MainState = {
    loader: false,
    notification: "Guess the range!",
    status: Status.Guess,
    showOK: false,
    games: [],
    totalGames: 0,
    currentPage: 1,
    totalPages: 0
}

export const mainReducer = (state: MainState = initialState, action: MainAction): MainState => {
    switch (action.type) {
        case MainActionTypes.SET_LOADER:
            return {...state, loader: action.payload}
        case MainActionTypes.SET_NOTIFICATION:
            return {...state, notification: action.payload}
        case MainActionTypes.SET_SHOW_OK:
            return {...state, showOK: action.payload}
        case MainActionTypes.SET_STATUS:
            return {...state, status: action.payload}
        case MainActionTypes.PUSH_GAME:
            return {...state, games: [...state.games, action.payload] }
        case MainActionTypes.CLEAR_GAMES:
            return {...state, games: [] }
        case MainActionTypes.SET_CURRENT_PAGE:
            return {...state, currentPage: action.payload }
        case MainActionTypes.SET_TOTAL_GAMES:
            return {...state, totalGames: action.payload }
        case MainActionTypes.SET_TOTAL_PAGES:
            return {...state, totalPages: action.payload }
        default:
            return state
    }
}