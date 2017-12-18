import React from 'react'
import Button from '@ieremeev/button'

export default () => (
    <div>
        <Button title="Default" />
        <Button className="ui primary compact button" title="Primary" />
        <Button className="ui secondary compact button" title="Secondary" />
        <Button className="ui red compact button" title="Red" />
        <Button className="ui green compact button" title="Green" />
    </div>
)
