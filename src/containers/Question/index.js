import './styles.scss'

import { Col, Row } from 'reactstrap'
import React, { Component } from 'react'

import { MdBrightness1 } from 'react-icons/md'
import cx from 'classnames'
import { dataType } from 'utils/constants'

class Question extends Component {

  render() {
    const { question } = this.props
    
    return(
      <>
        <Row>
          <Col xs='1'><MdBrightness1 size={28} /></Col>
          <Col xs='11' className='font-weight-bold pre-wrap'>{question.content}</Col>
        </Row>
        {(question.type === dataType.text || question.type === dataType.number) && question.answer &&
        <Row className='px-2 py-2'>
          <Col 
            className={cx(
              "btn-secondary",
              "d-flex align-items-center justify-content-center answer")} 
            xs={{ size:3, offset:9 }}
          >
            {question.answer}
          </Col>
        </Row>
        }
      </>
    )
  }
}

export default Question