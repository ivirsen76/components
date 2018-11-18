import React from 'react'
import Tree from '@ieremeev/tree'

export default () => {
    const Component = (
        <div className="ui message" style={{ padding: '0.7em 1.5em' }}>
            Content
        </div>
    )
    const data = {
        id: 1,
        children: [
            { id: 2, component: Component },
            {
                id: 4,
                component: Component,
                isAdult: true,
                children: [
                    { id: 5, component: Component },
                    { id: 6, component: Component },
                    {
                        id: 8,
                        component: Component,
                        isAdult: true,
                        children: [
                            { id: 9, component: Component },
                            { id: 10, component: Component },
                        ],
                    },
                ],
            },
            { id: 3, component: Component },
            { id: 7, component: Component },
        ],
    }

    return <Tree tree={data} dragDropType="BUILDER" onDrop={() => {}} />
}
