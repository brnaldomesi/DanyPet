import React, { Component } from 'react'

import {Col} from 'reactstrap'
import { MdChevronLeft } from 'react-icons/md'

class Header extends Component {

  render() {
    const { isMobile } = this.props

    return (
      <>
        {isMobile &&
          <Col xs="2" style={{zIndex: 9}} onClick={this.props.handleBackButton}>
            <MdChevronLeft size={48} />
          </Col>
        }
        <Col md="12" className='font-weight-bold absolute'>LOGO</Col>
      </>
    )
  }
}

export default Header