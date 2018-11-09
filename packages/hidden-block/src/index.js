import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

/** Collapsable hidden block */
export default class extends React.Component {
    static propTypes = {
        /** Link title */
        title: PropTypes.node,

        /** Show the hidden block or not. <br> This prop depends on the handleClick prop: <br> If handleClick is null then it will be the default value. <br> If handleClick is a function then it will be the actual value. */
        show: PropTypes.bool,

        /** Callback function that runs when clicking the link. */
        handleClick: PropTypes.func,

        children: PropTypes.node,
    }

    static defaultProps = {
        title: 'Hidden block',
        show: false,
    }

    state = {
        show: this.props.show,
    }

    clicked = e => {
        e && e.preventDefault()

        if (this.props.handleClick) {
            this.props.handleClick()
        } else {
            this.setState(state => ({ show: !state.show }))
        }
    }

    isShow = () => (this.props.handleClick ? this.props.show : this.state.show)

    render() {
        return (
            <div>
                <svg className={style.arrow} viewBox="240 240 544 544">
                    <g>
                        <path
                            d={
                                this.isShow()
                                    ? 'M224 384l288 288 288-288h-576z'
                                    : 'M384 800l288-288-288-288v576z'
                            }
                        />
                    </g>
                </svg>
                <a href="" onClick={this.clicked}>
                    {this.props.title}
                </a>
                {this.isShow() && <div className={style.body}>{this.props.children}</div>}
            </div>
        )
    }
}
