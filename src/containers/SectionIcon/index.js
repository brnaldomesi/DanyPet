import React, { Component } from 'react'

import { FaArrowCircleRight } from 'react-icons/fa'
import Question from 'containers/Question'
import { xor } from 'lodash'

class SectionIcon extends Component {
  
  constructor(props) {
    super(props)
    const { question: { answer } } = props
    
    this.state = { answer }
  }

  handleSelectAnswer = (questionIndex, index) => () => {
    const answer = xor([index], this.state.answer)
    this.setState({ answer })
    this.props.handleSelectAnswer(questionIndex, answer)()
  }

  render() {
    const { question, isMobile, questionIndex } = this.props
    
    return (
      <div className='py-4'>
        <Question
          question={question}
        />
        <div className='my-3 d-flex flex-wrap'>
        {true &&
          question.choice.map((item, index) => { 
            return (
            <div 
              style={{width: isMobile ? '33%' : '25%'}} 
              className='text-center pointer my-1' 
              key={index}
            >
              <FaArrowCircleRight 
                color={question.answer.includes(index) ? 'blue' : 'dark'} 
                onClick={this.handleSelectAnswer(questionIndex, index)} 
                size={70}
              />
              <div>{item.title}</div>
            </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}

export default SectionIcon