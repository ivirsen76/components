/* global describe, it, expect */
import {
    getAdjustedTree,
    getElementLinks,
    getPlaceholderPosition,
    getFirstElementId,
    getLastElementId,
} from './builder.js'

describe('Builder selectors (getElementLinks)', () => {
    it('Should return element links when there are no elements yet', () => {
        const state = {
            tree: {},
            expandedElements: [],
        }
        expect(getElementLinks(state)).toEqual({})
    })

    it('Should return element links when there are no elements under root yet', () => {
        const state = {
            tree: {
                id: 1,
                children: [],
            },
            expandedElements: [],
        }
        expect(getElementLinks(state)).toEqual({})
    })

    it('Should return element links', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                                isAdult: true,
                                children: [
                                    {
                                        id: 5,
                                        component: 'Some',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                ],
            },
            expandedElements: [1, 2, 3],
        }
        const expectedLinks = {
            2: {
                aboveElement: null,
                belowElement: 3,
                children: [3],
                isAdult: true,
                parents: [],
                siblings: [2, 4],
            },
            3: {
                aboveElement: 2,
                belowElement: 5,
                parents: [2],
                isLastChild: true,
                siblings: [3],
                isAdult: true,
                children: [5],
            },
            5: {
                aboveElement: 3,
                belowElement: 4,
                parents: [3, 2],
                isLastChild: true,
                siblings: [5],
            },
            4: {
                aboveElement: 5,
                belowElement: null,
                parents: [],
                isLastChild: true,
                siblings: [2, 4],
            },
        }
        expect(getElementLinks(state)).toEqual(expectedLinks)
    })

    it('Should return element links without dragged element', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                                isAdult: true,
                                children: [
                                    {
                                        id: 5,
                                        component: 'Some',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                    {
                        id: 6,
                        component: 'Some',
                    },
                ],
            },
            draggedElementId: 2,
            expandedElements: [1, 2, 3],
        }
        const expectedLinks = {
            4: {
                aboveElement: null,
                belowElement: 6,
                parents: [],
                siblings: [4, 6],
            },
            6: {
                aboveElement: 4,
                belowElement: null,
                parents: [],
                isLastChild: true,
                siblings: [4, 6],
            },
        }

        expect(getElementLinks(state)).toEqual(expectedLinks)
    })

    it('Should return element links without collapsed elements', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                                isAdult: true,
                                children: [
                                    {
                                        id: 5,
                                        component: 'Some',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                ],
            },
            expandedElements: [1, 2],
        }
        const expectedLinks = {
            2: {
                aboveElement: null,
                belowElement: 3,
                children: [3],
                isAdult: true,
                parents: [],
                siblings: [2, 4],
            },
            3: {
                aboveElement: 2,
                belowElement: 4,
                parents: [2],
                isLastChild: true,
                siblings: [3],
                isAdult: true,
                children: [],
            },
            4: {
                aboveElement: 3,
                belowElement: null,
                parents: [],
                isLastChild: true,
                siblings: [2, 4],
            },
        }
        expect(getElementLinks(state)).toEqual(expectedLinks)
    })

    it('Should ignore dragged elements from children', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                                isAdult: true,
                                children: [
                                    {
                                        id: 5,
                                        component: 'Some',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                ],
            },
            draggedElementId: 3,
            expandedElements: [1, 2, 3],
        }
        const expectedLinks = {
            2: {
                aboveElement: null,
                belowElement: 4,
                children: [],
                isAdult: true,
                parents: [],
                siblings: [2, 4],
            },
            4: {
                aboveElement: 2,
                belowElement: null,
                parents: [],
                siblings: [2, 4],
                isLastChild: true,
            },
        }

        expect(getElementLinks(state)).toEqual(expectedLinks)
    })
})

describe('Builder selectors (getAdjustedTree)', () => {
    it('Should return element tree', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                ],
            },
            expandedElements: [],
        }
        const expectedTree = {
            id: 1,
            level: 0,
            parents: [],
            children: [
                {
                    id: 2,
                    component: 'Some',
                    isAdult: true,
                    level: 1,
                    parents: [1],
                    children: [
                        {
                            id: 3,
                            component: 'Some',
                            level: 2,
                            parents: [2, 1],
                            isLastChild: true,
                        },
                    ],
                },
                {
                    id: 4,
                    component: 'Some',
                    level: 1,
                    parents: [1],
                    isLastChild: true,
                },
            ],
        }
        expect(getAdjustedTree(state)).toEqual(expectedTree)
    })

    it('Should return element tree without dragged element children', () => {
        const state = {
            tree: {
                id: 1,
                children: [
                    {
                        id: 2,
                        component: 'Some',
                        isAdult: true,
                        children: [
                            {
                                id: 3,
                                component: 'Some',
                            },
                        ],
                    },
                    {
                        id: 4,
                        component: 'Some',
                    },
                ],
            },
            draggedElementId: 2,
            expandedElements: [],
        }
        const expectedTree = {
            id: 1,
            level: 0,
            parents: [],
            children: [
                {
                    id: 2,
                    component: 'Some',
                    isAdult: true,
                    level: 1,
                    parents: [1],
                    children: [],
                },
                {
                    id: 4,
                    component: 'Some',
                    level: 1,
                    parents: [1],
                    isLastChild: true,
                },
            ],
        }
        expect(getAdjustedTree(state)).toEqual(expectedTree)
    })

    it('Should return empty tree when there is empty tree', () => {
        const state = {
            tree: {},
            expandedElements: [],
        }
        expect(getAdjustedTree(state)).toEqual({})
    })
})

describe('Builder selectors (getPlaceholderPosition)', () => {
    const tree = {
        id: 10,
        children: [
            {
                id: 1,
                isAdult: true,
                children: [
                    {
                        id: 3,
                    },
                    {
                        id: 4,
                        isAdult: true,
                        children: [{ id: 5 }],
                    },
                ],
            },
            {
                id: 2,
            },
            {
                id: 7,
                isAdult: true,
                children: [
                    {
                        id: 8,
                        isAdult: true,
                        children: [],
                    },
                    {
                        id: 9,
                        isAdult: true,
                        children: [],
                    },
                ],
            },
            {
                id: 6,
                isAdult: true,
                children: [],
            },
        ],
    }
    const defaultState = {
        tree,
        expandedElements: [10, 1, 4, 7, 8, 9, 6],
    }
    const defaultHoveredElement = {
        id: 0,
        top: false,
        middle: false,
        bottom: false,
        level: 0,
    }

    it('Should return null position for no hoveredElement', () => {
        const state = {
            ...defaultState,
            hoveredElement: defaultHoveredElement,
        }
        expect(getPlaceholderPosition(state)).toEqual({
            placeholderBefore: 0,
            placeholderParentId: 10,
        })
    })

    it('Should handle top for the first element', () => {
        const state = {
            ...defaultState,
            hoveredElement: {
                id: 1,
                top: true,
                middle: false,
                bottom: false,
                level: 0,
            },
        }
        expect(getPlaceholderPosition(state)).toEqual({
            placeholderBefore: 1,
            placeholderParentId: 10,
        })
    })

    describe('Folder', () => {
        it('Should handle bottom for the latest indented element', () => {
            const state = {
                tree: {
                    id: 10,
                    children: [
                        {
                            id: 1,
                            isAdult: true,
                            children: [
                                {
                                    id: 2,
                                    isAdult: true,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                hoveredElement: {
                    id: 2,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
                expandedElements: [10, 1, 2],
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for the parent with dragged child', () => {
            const state = {
                tree: {
                    id: 10,
                    children: [
                        {
                            id: 1,
                            isAdult: true,
                            children: [{ id: 3 }],
                        },
                        {
                            id: 2,
                            isAdult: true,
                            children: [],
                        },
                    ],
                },
                hoveredElement: {
                    id: 1,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
                draggedElementId: 3,
                expandedElements: [10, 1, 2],
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 2,
                placeholderParentId: 10,
            })
        })

        it('Should handle middle', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: false,
                    middle: true,
                    bottom: false,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 1,
            })
        })

        it('Should handle middle with top', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: true,
                    middle: true,
                    bottom: false,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 1,
            })
        })

        it('Should handle middle for parent without children', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 6,
                    top: false,
                    middle: true,
                    bottom: false,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 6,
            })
        })

        it('Should handle top', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: true,
                    middle: false,
                    bottom: false,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 1,
                placeholderParentId: 10,
            })
        })

        it('Should handle middle over the top', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: true,
                    middle: true,
                    bottom: false,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 1,
            })
        })

        it('Should handle bottom when there are children', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 3,
                placeholderParentId: 1,
            })
        })

        it('Should handle bottom for parent without children, level 2', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 6,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 2,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 6,
            })
        })

        it('Should handle bottom for latest parent without children, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 6,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for parent without children again, level 2', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 9,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 2,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 7,
            })
        })

        it('Should handle bottom for parent without children, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 9,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 6,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for parent without children again, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 8,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 9,
                placeholderParentId: 7,
            })
        })

        it('Should handle bottom for parent without children with middle, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 8,
                    top: false,
                    middle: true,
                    bottom: true,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 9,
                placeholderParentId: 7,
            })
        })

        it('Should handle top for parent without children with middle, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 8,
                    top: true,
                    middle: true,
                    bottom: false,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 8,
                placeholderParentId: 7,
            })
        })

        it('Should handle bottom when the parent is collapsed, level 2', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 1,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 2,
                },
                expandedElements: [10, 4, 7, 8, 9, 6],
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 2,
                placeholderParentId: 10,
            })
        })
    })

    describe('Node', () => {
        it('Should handle bottom for the latest indented element', () => {
            const state = {
                tree: {
                    id: 10,
                    children: [
                        {
                            id: 1,
                            isAdult: true,
                            children: [{ id: 2 }],
                        },
                    ],
                },
                hoveredElement: {
                    id: 2,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
                expandedElements: [],
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for the latest element', () => {
            const state = {
                tree: {
                    id: 10,
                    children: [{ id: 1 }],
                },
                hoveredElement: {
                    id: 1,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
                expandedElements: [],
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 10,
            })
        })

        it('Should handle top', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 3,
                    top: true,
                    middle: false,
                    bottom: false,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 3,
                placeholderParentId: 1,
            })
        })

        it('Should handle top and ignore middle', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 3,
                    top: true,
                    middle: true,
                    bottom: false,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 3,
                placeholderParentId: 1,
            })
        })

        it('Should handle bottom', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 3,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 4,
                placeholderParentId: 1,
            })
        })

        it('Should handle bottom on top level', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 2,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 0,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 7,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for the last child, level 1', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 5,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 1,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 2,
                placeholderParentId: 10,
            })
        })

        it('Should handle bottom for the last child, level 2', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 5,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 2,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 1,
            })
        })

        it('Should handle bottom for the last child, level 3', () => {
            const state = {
                ...defaultState,
                hoveredElement: {
                    id: 5,
                    top: false,
                    middle: false,
                    bottom: true,
                    level: 3,
                },
            }
            expect(getPlaceholderPosition(state)).toEqual({
                placeholderBefore: 0,
                placeholderParentId: 4,
            })
        })
    })
})

describe('Builder selectors (getLastElementId)', () => {
    it('Should return 0 for empty list', () => {
        const state = {
            tree: {
                id: 10,
                children: [],
            },
            expandedElements: [],
        }

        expect(getLastElementId(state)).toBe(0)
    })

    it('Should return last element', () => {
        const state = {
            tree: {
                id: 10,
                children: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                        isAdult: true,
                        children: [{ id: 3 }],
                    },
                ],
            },
            expandedElements: [10, 2],
        }

        expect(getLastElementId(state)).toBe(3)
    })

    it('Should return last element when last element is dragged', () => {
        const state = {
            tree: {
                id: 10,
                children: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                        isAdult: true,
                        children: [{ id: 3 }],
                    },
                ],
            },
            draggedElementId: 2,
            expandedElements: [10, 2],
        }

        expect(getLastElementId(state)).toBe(1)
    })
})

describe('Builder selectors (getFirstElementId)', () => {
    it('Should return 0 for empty list', () => {
        const state = {
            tree: {
                id: 10,
                children: [],
            },
            expandedElements: [],
        }

        expect(getFirstElementId(state)).toBe(0)
    })

    it('Should return first element', () => {
        const state = {
            tree: {
                id: 10,
                children: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                        isAdult: true,
                        children: [{ id: 3 }],
                    },
                ],
            },
            expandedElements: [10, 2],
        }

        expect(getFirstElementId(state)).toBe(1)
    })

    it('Should return first element when first element is dragged', () => {
        const state = {
            tree: {
                id: 10,
                children: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                        isAdult: true,
                        children: [{ id: 3 }],
                    },
                ],
            },
            draggedElementId: 1,
            expandedElements: [10, 2],
        }

        expect(getFirstElementId(state)).toBe(2)
    })
})
