import { Col, Row } from 'reactstrap'
import React, { Component } from 'react'

import { MdBrightness1 } from 'react-icons/md'
import { dataType } from 'utils/constants'

class SectionPicture extends Component {

  handleFileChange = evt => {
    var file = evt.target.files[0]
    
    this.getBase64(file, (result) => {
      this.handleSelectAnswer(result)
    });
  }

  handleSelectAnswer = result => {
    const { questionIndex } = this.props
    this.props.handleSelectAnswer(questionIndex, result)()
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  render() {
    const { question } = this.props
    
    return(
      <div className='py-4'>
        <Row>
          <Col xs='1'><MdBrightness1 size={28} /></Col>
          <Col xs='11' className='font-weight-bold pre-wrap'>
          {question.type === dataType.picture && question.answer && 
            <img src={question.answer} alt='pet' />
          }
          {question.type === dataType.picture && !question.answer && 
            <input type='file' onChange={this.handleFileChange} accept="image/*" />
          }
          </Col>
        </Row>
      </div>
    )
  }
}

export default SectionPicture