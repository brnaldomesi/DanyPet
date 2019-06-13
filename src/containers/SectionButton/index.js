import { Button, Col, Row } from 'reactstrap'
import React, { Component } from 'react'

import Question from 'containers/Question'
import cx from 'classnames'
import { dataType } from 'utils/constants'

class SectionButton extends Component {
  
  render() {
    const { question, questionIndex } = this.props
    const mdVal = question.type === dataType.button ? 12 / question.choice.length : 6
    
    return(
      <div className='py-4'>
        <Question
          question={question}
        />
        <Row className='my-3'>
        {true &&
          question.choice.map((item, index) => { 
            return (
            <Col xs='12' className='text-center my-2' md={mdVal} key={index}>
              <Button 
                outline={question.answer !== index} 
                color={question.answer === index ? 'primary' : 'secondary'} 
                onClick={this.props.handleSelectAnswer(questionIndex, index)} 
                className={cx('py-3', 'xlg')}
              >
                <div className={cx({'my-2': item.description})}>{item.title}</div>
                <div className='pre-wrap'>{item.description}</div>
              </Button>
            </Col>
            )
          })
        }
        </Row>
      </div>
    )
  }
}

export default SectionButton