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
                    <li>Generator to create first component structure</li>
                    <li>Automatic documentation using React component and examples</li>
                    <li>Hot reloading to see the updates in browser immediately</li>
                    <li>All examples are tested automatically using Jest snapshot testing</li>
                    <li>Build scripts to precompile the code for publishing</li>
                    <li>Auto generator readme file</li>
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
