import { createSelector } from 'reselect'
import _omit from 'lodash/omit'
import _isEmpty from 'lodash/isEmpty'
import _last from 'lodash/last'
import _filter from 'lodash/filter'
import _isArray from 'lodash/isArray'
import _findKey from 'lodash/findKey'

const getRootId = state => state.tree.id
const getTree = state => state.tree
const getHoveredElement = state => state.hoveredElement
const getDraggedElementId = state => state.draggedElementId
const getExpandedElements = state => state.expandedElements

export const getAllExpandedElements = createSelector(
    getExpandedElements,
    getTree,
    (expandedElements, tree) => {
        const result = [0, ...expandedElements]

        // Make adult with empty children also expanded
        function process(branch) {
            if (!branch.children) {
                return
            }

            if (branch.children.length === 0 && !result.includes(branch.id)) {
                result.push(branch.id)
            }

            branch.children.forEach(child => process(child))
        }

        process(tree)

        return result
    }
)

export const getElementLinks = createSelector(
    getTree,
    getDraggedElementId,
    getAllExpandedElements,
    (tree, draggedElementId, expandedElements) => {
        if (_isEmpty(tree) || !tree.children || tree.children.length === 0) {
            return {}
        }

        const links = {}
        let aboveElement = null

        function ignoreDraggedElement(element) {
            if (!expandedElements.includes(element.id)) {
                return null
            }

            const children = element.children

            if (!_isArray(children)) {
                return null
            }

            return _filter(children, child => child.id !== draggedElementId)
        }

        function setLinks(element, prevParents = [], siblings = []) {
            const elementId = element.id
            links[elementId] = {
                parents: prevParents,
                aboveElement,
                belowElement: null,
                siblings,
            }

            if (aboveElement) {
                links[aboveElement].belowElement = elementId
            }
            aboveElement = elementId

            if (element.isAdult) {
                links[elementId].isAdult = true

                const children = ignoreDraggedElement(element)
                const childrenIds = children ? children.map(child => child.id) : []

                links[elementId].children = childrenIds

                if (children && children.length > 0) {
                    const childParents = [elementId, ...prevParents]
                    children.forEach(child => setLinks(child, childParents, childrenIds))
                    links[_last(childrenIds)].isLastChild = true
                }
            }
        }

        const rootChildren = ignoreDraggedElement(tree)
        if (rootChildren && rootChildren.length > 0) {
            const rootChildrenIds = rootChildren.map(child => child.id)
            rootChildren.forEach(child => setLinks(child, [], rootChildrenIds))
            links[_last(rootChildrenIds)].isLastChild = true
        }

        return links
    }
)

export const getAdjustedTree = createSelector(
    getTree,
    getDraggedElementId,
    (tree, draggedElementId) => {
        function getBranch(branch, parents = [], level = 0) {
            if (_isEmpty(branch)) {
                return {}
            }

            const element = _omit(branch, ['children'])
            element.parents = parents
            element.level = level

            if (branch.children && branch.children.length > 0) {
                if (element.id === draggedElementId) {
                    element.children = []
                } else {
                    element.children = branch.children.map(child =>
                        getBranch(child, [element.id, ...parents], level + 1)
                    )
                    element.children[element.children.length - 1].isLastChild = true
                }
            }

            return element
        }

        return getBranch(tree)
    }
)

export const getPlaceholderPosition = createSelector(
    getHoveredElement,
    getElementLinks,
    getRootId,
    getAllExpandedElements,
    (hoveredElement, links, rootId, expandedElements) => {
        // Helper function
        const getNextPlaceholder = elementId => {
            const thisLink = links[elementId]
            const siblings = thisLink.siblings
            const nextId = siblings[siblings.indexOf(elementId) + 1]

            return {
                placeholderBefore: nextId,
                placeholderParentId: thisLink.parents[0] || rootId,
            }
        }

        let { id, top, middle, bottom, level } = hoveredElement
        const nullResult = { placeholderBefore: 0, placeholderParentId: rootId }

        let link = links[id]
        if (!link) {
            return nullResult
        }

        let diff = Math.max(link.parents.length + 1 - level, -1)
        let isCollapsed = !expandedElements.includes(id)

        // If it's a top hover then move it to the bottom for the previous element
        if (top && (!middle || diff > 0 || !link.isAdult || isCollapsed)) {
            if (link.aboveElement) {
                top = false
                bottom = true
                middle = false
                id = link.aboveElement

                link = links[id]
                diff = Math.max(link.parents.length + 1 - level, -1)
                isCollapsed = !expandedElements.includes(id)
            } else {
                return { placeholderBefore: id, placeholderParentId: rootId }
            }
        }

        if (link.isAdult && !isCollapsed) {
            // if it's a "folder"
            if (middle && diff <= 0) {
                return { placeholderBefore: 0, placeholderParentId: id }
            }

            if (bottom) {
                if (link.children.length !== 0) {
                    return { placeholderBefore: link.belowElement, placeholderParentId: id }
                }

                if (diff === -1) {
                    return { placeholderBefore: 0, placeholderParentId: id }
                }
                if (!link.isLastChild) {
                    return {
                        placeholderBefore: link.belowElement,
                        placeholderParentId: link.parents[0] || rootId,
                    }
                }

                if (diff === 0) {
                    return { placeholderBefore: 0, placeholderParentId: link.parents[0] || rootId }
                }

                for (let i = 0; i < diff; i++) {
                    let parentId = link.parents[i]
                    let parentLink = links[parentId]

                    if (!parentLink.isLastChild) {
                        return getNextPlaceholder(parentId)
                    }
                    if (parentLink.isLastChild && i === diff - 1) {
                        return {
                            placeholderBefore: 0,
                            placeholderParentId: parentLink.parents[0] || rootId,
                        }
                    }
                }
            }
        } else if (bottom) {
            // if it's a "node"
            if (!link.isLastChild) {
                return {
                    placeholderBefore: link.belowElement,
                    placeholderParentId: link.parents[0] || rootId,
                }
            }

            if (diff <= 0) {
                return { placeholderBefore: 0, placeholderParentId: link.parents[0] || rootId }
            }

            for (let i = 0; i < diff; i++) {
                let parentId = link.parents[i]
                let parentLink = links[parentId]

                if (!parentLink.isLastChild) {
                    return getNextPlaceholder(parentId)
                }
                if (parentLink.isLastChild && i === diff - 1) {
                    return {
                        placeholderBefore: 0,
                        placeholderParentId: parentLink.parents[0] || rootId,
                    }
                }
            }
        }

        return nullResult
    }
)

export const getFirstElementId = createSelector(getElementLinks, links => {
    const firstElementId = _findKey(links, { aboveElement: null })
    return firstElementId ? +firstElementId : 0
})

export const getLastElementId = createSelector(getElementLinks, links => {
    const lastElementId = _findKey(links, { belowElement: null })
    return lastElementId ? +lastElementId : 0
})
