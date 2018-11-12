import reducer, { captureGlobalClick } from './boilerplate.js'

describe('captureGlobalClick()', () => {
    it('should capture global click', () => {
        const state = {
            globalClickCaptured: false,
        }
        const resultedState = reducer(state, captureGlobalClick())
        expect(resultedState.globalClickCaptured).toBe(true)
    })
})
