import { handleActions, createAction } from 'redux-actions'

// Initial state
export const initialState = {
    globalClickCaptured: false,
}

// Actions
const CAPTURE_GLOBAL_CLICK = 'boilerplate/boilerplate/CAPTURE_GLOBAL_CLICK'

// Action Creators
export const captureGlobalClick = createAction(CAPTURE_GLOBAL_CLICK)

// Reducer
export default handleActions(
    {
        [CAPTURE_GLOBAL_CLICK]: (state, action) => ({
            ...state,
            globalClickCaptured: true,
        }),
    },
    initialState
)
