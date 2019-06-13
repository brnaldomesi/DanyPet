import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'reactstrap';
import React from 'react'
import Routes from './routes'
import { createBrowserHistory } from 'history';

const history = createBrowserHistory()

export default () => (
  <Container fluid>
    <Routes history={history} />
  </Container>
)
