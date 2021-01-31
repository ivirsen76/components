import React from 'react'
import Button from '@ieremeev/button'

export default () => (
    <div>
        <Button title="Default" />
        <Button className="btn btn-sm btn-secondary" title="Secondary" />
        <Button className="btn btn-sm btn-success" title="Success" />
        <Button className="btn btn-sm btn-danger" title="Danger" />
        <Button className="btn btn-sm btn-warning" title="Warning" />
    </div>
)
