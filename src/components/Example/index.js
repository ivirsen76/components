import React from 'react'
import PropTypes from 'prop-types'
import prism from 'prismjs'
import style from './style.module.css'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/themes/prism.css'

export default class Example extends React.Component {
    static propTypes = {
        example: PropTypes.object,
    }

    state = {
        showCode: false,
    }

    toggleCode = () => {
        this.setState(state => ({ showCode: !state.showCode }))
    }

    render() {
        const { example } = this.props
        const { showCode } = this.state

        const ExampleComponent = example.component

        return (
            <div>
                <h3 className={style.title}>{example.title}</h3>
                {example.description && <div className={style.desc}>{example.description}</div>}
                <div className={style.wrapper}>
                    <a className={style.codeLink} onClick={this.toggleCode}>
                        {'<>'}
                    </a>
                    {this.state.showCode && (
                        <div className={style.code}>
                            <pre
                                style={{ margin: '0' }}
                                dangerouslySetInnerHTML={{
                                    __html: prism.highlight(example.code, prism.languages.jsx),
                                }}
                            />
                        </div>
                    )}
                    <div className={`${style.component} ${showCode && style.withCode}`}>
                        <ExampleComponent />
                    </div>
                </div>
            </div>
        )
    }
}
