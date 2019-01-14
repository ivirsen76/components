import React from 'react'

export default class Component extends React.Component {
    render() {
        return (
            <div>
                <h1>About</h1>
                <p>My name is Igor Eremeev.</p>
                <p>This site is the demo of some packages which I&apos;ve created.</p>
                <p>
                    It&apos;s not only the demo site, it&apos;s also the development environment,
                    which I use to create components. It includes:
                </p>
                <ul>
                    <li>Interactive code examples</li>
                    <li>Generator to create first component structure</li>
                    <li>Automatic documentation using comments inside code</li>
                    <li>Hot reloading to see the updates in a browser immediately</li>
                    <li>Automatic testing and linting</li>
                    <li>Build scripts for compiling the code before publishing</li>
                </ul>

                <p>
                    <a href="https://github.com/ivirsen76/components">
                        <i className="github icon" />Source code
                    </a>
                </p>
            </div>
        )
    }
}
