import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

/** Tree view */
export default class Tree extends React.Component {
    static propTypes = {
        data: PropTypes.array,
    }

    static defaultProps = {
        data: [],
    }

    state = {
        expanded: [],
    }

    toggleExpanded = id => {
        this.setState(state => {
            let newExpanded
            if (state.expanded.includes(id)) {
                newExpanded = state.expanded.filter(item => item !== id)
            } else {
                newExpanded = [...state.expanded, id]
            }

            return { expanded: newExpanded }
        })
    }

    renderFolder = folder => {
        const isExpanded = this.state.expanded.includes(folder.id)
        const hasChildren = !!folder.children

        return (
            <div>
                <div>
                    {hasChildren ? (
                        <i
                            className={`caret ${isExpanded ? 'down' : 'right'} icon ${style.icon}`}
                            onClick={this.toggleExpanded.bind(this, folder.id)}
                        />
                    ) : (
                        <i className={style.fakeIcon} />
                    )}
                    <i className="folder icon" />
                    {folder.title}
                </div>
                {isExpanded && hasChildren && this.renderChildren(folder.children)}
            </div>
        )
    }

    renderFile = file => (
        <div className={style.file}>
            <i className="file outline icon" />
            {file.title}
        </div>
    )

    renderChildren = children => {
        return (
            <div className={style.children}>
                {children.map(child => (
                    <div key={child.id}>
                        {child.type === 'folder' && this.renderFolder(child)}
                        {child.type === 'file' && this.renderFile(child)}
                    </div>
                ))}
            </div>
        )
    }

    render() {
        return <div className={style.wrapper}>{this.renderChildren(this.props.data)}</div>
    }
}
