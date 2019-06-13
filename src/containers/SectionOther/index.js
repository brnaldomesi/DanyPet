import React, { Component } from 'react'

import Question from 'containers/Question'

class SectionOther extends Component {
  
  componentDidMount() {
    setTimeout(this.timeoutCallback, 2000)
  }

  timeoutCallback = () => this.props.handleSelectAnswer(this.props.questionIndex, 1)()
  
  render() {
    const { question } = this.props
    
    return(
      <div className='py-4'>
        <Question
          question={question}
        />
      </div>
    )
  }
}

export default SectionOther