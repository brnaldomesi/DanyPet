import React, { Component } from 'react'

import Question from 'containers/Question'

class SectionText extends Component {
  
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

export default SectionText