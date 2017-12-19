import { handleActions, createAction } from 'redux-actions'

// Initial state
export const initialState = {
    collapsed: [],
    search: '',
}

// Actions
const SET_SEARCH = 'znanium/znanium/SET_SEARCH'

// Action Creators
export const setSearch = createAction(SET_SEARCH)

// Reducer
export default handleActions(
    {
        [SET_SEARCH]: (state, action) => ({
            ...state,
            search: action.payload,
        }),
    },
    initialState
)
