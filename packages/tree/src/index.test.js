import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from './index.js';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Component
            connectDropTarget={() => null}
            isOver={false}
            tree={{}}
            dragDropType="test"
            onDrop={() => {}}
        />,
        div
    );
});
