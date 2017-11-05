import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'
import prism from 'prismjs'
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
                <h2>{example.title}</h2>
                <div className={`${style.component} ${showCode && style.withCode}`}>
                    <ExampleComponent />
                    <div className={style.codeLink}>
                        <a onClick={this.toggleCode}>{'<>'}</a>
                    </div>
                </div>
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
            </div>
        )
    }
}
