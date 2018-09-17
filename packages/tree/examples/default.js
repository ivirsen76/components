import React from 'react'
import Tree from '@ieremeev/tree'

export default () => {
    const data = [
        {
            id: 1,
            title: 'Student books',
            type: 'folder',
            children: [
                { id: 2, title: 'Face2Face', type: 'folder' },
                { id: 3, title: 'Inside out', type: 'folder' },
                {
                    id: 4,
                    title: 'English file',
                    type: 'folder',
                    children: [
                        { id: 5, title: 'Another', type: 'folder' },
                        { id: 6, title: 'Begginer', type: 'file' },
                        { id: 7, title: 'Intermediate', type: 'file' },
                    ],
                },
            ],
        },
        {
            id: 10,
            title: 'Vocabulary',
            type: 'folder',
            children: [
                { id: 11, title: 'Adjectives', type: 'file' },
                { id: 12, title: 'Verbs', type: 'file' },
            ],
        },
    ]
    return <Tree data={data} />
}
