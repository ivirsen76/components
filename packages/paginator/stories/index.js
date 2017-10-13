import React from 'react'
import Paginator from '../src'
import { storiesOf } from '@kadira/storybook' // eslint-disable-line

const stories = storiesOf('paginator', module)

stories.add('first page', () => <Paginator total={50} />)

stories.add('middle page', () => <Paginator total={50} currentPage={12} />)

stories.add('last page', () => <Paginator total={50} currentPage={50} />)

stories.add('just a few pages', () => <Paginator total={3} />)
