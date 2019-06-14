import './styles.scss'

import { Col, Input, Row } from 'reactstrap'
import React, { Component } from 'react'

import { FaArrowCircleRight } from 'react-icons/fa'
import SectionButton from 'containers/SectionButton'
import SectionIcon from 'containers/SectionIcon'
import SectionOther from 'containers/SectionOther'
import SectionPicture from 'containers/SectionPicture'
import SectionText from 'containers/SectionText'
import cx from 'classnames'
import { dataType } from 'utils/constants'

class Chat extends Component {

  handleInputKeyPress = curIndex => ({which}) => which === 13 && (this.handleSelectAnswer(curIndex)())

  getAnswerRef = ref => {
    this.answerRef = ref
  }

  handleSelectAnswer = (curIndex, answerFromChild) => () => {
    clearTimeout(this.timer)
    clearTimeout(this.timerNextStep)

    if (this.answerRef) {
      if (!this.answerRef.disabled) { //Check if answer input field is disabled
        const answer = this.answerRef.value
        if (answer.length === 0) {
          this.showErrorText('Empty')
        } else {
          this.props.handleSelectAnswer(curIndex, answer)
        }
      } else {
        if (typeof answerFromChild !== 'undefined') {
          this.props.handleSelectAnswer(curIndex, answerFromChild)
        } else{
          this.showErrorText('No Choose')
        }
      }
    }
  }

  showErrorText = errorText => this.setState({ errorText }, this.autoEraseError)

  autoEraseError = () => this.timer = setTimeout(() => this.setState({ errorText: null }), 1500)

  constructor(props) {
    super(props)
    this.state = { errorText: null }
  }

  componentDidMount() {
    const questionList = this.getQuestionList()
    const last = questionList.length - 1
    const lastQuestion = questionList[last]
    const answer =
      lastQuestion.type === dataType.other ? 1
        : lastQuestion.type === dataType.picture ? 'petdog'
        : undefined

    if (answer) {
      const { isMobile, unitIndex } = this.props
      const questionIndex = isMobile ? unitIndex : last
      this.timerNextStep = setTimeout(() => {
        this.handleSelectAnswer(questionIndex, answer)()
      }, 3000)
    }

    this.answerRef.focus();
  }

  getQuestionList = () => {
    const { isMobile, unitIndex } = this.props
    const questionList =
      isMobile ? this.props.data.filter((question, index) => index === unitIndex)
        : this.props.data.filter((question, index) =>
          (typeof question.answer !== 'undefined') || index === 0 || index <= unitIndex)

    return questionList

  }
  
  render() {
    const { isMobile, unitIndex } = this.props
    const questionList = this.getQuestionList()
    
    const lastQuestion = questionList[questionList.length-1]
    const curIndex = isMobile ? unitIndex : questionList.length - 1
    const disabled = 
      lastQuestion.type !== dataType.text && lastQuestion.type !== dataType.number
    const visibleIconQuestion = unitIndex === 0 ? false : true

    return(
      <>
        <div className='px-3'>
          {questionList.map((question, index) => {
              switch (question.type) {
                case dataType.text:
                case dataType.number:
                  return (
                    <SectionText
                      key={index}
                      question={question}
                    />
                  )          
                case dataType.button:
                  return ( 
                    <SectionButton
                      key={index}
                      questionIndex={ isMobile ? unitIndex : index}
                      handleSelectAnswer={this.handleSelectAnswer}
                      question={question}
                    />
                  )
                case dataType.picture:
                  return (
                    <SectionPicture
                      key={index} 
                      questionIndex={ isMobile ? unitIndex : index}
                      handleSelectAnswer={this.handleSelectAnswer}
                      question={question}
                    />
                  )
                case dataType.other:
                  return (
                    <SectionOther
                      key={index} 
                      questionIndex={ isMobile ? unitIndex : index}
                      handleSelectAnswer={this.handleSelectAnswer}
                      question={question}
                    />
                  )
                case dataType.icon:
                default:
                  return (
                    visibleIconQuestion && <SectionIcon
                      key={index}
                      isMobile={isMobile}
                      questionIndex={ isMobile ? unitIndex : index}
                      handleSelectAnswer={this.handleSelectAnswer}
                      question={question}
                    />
                  )
              }
            })
          }
        </div>
        <div>
          <p className='text-danger'>
            &nbsp;{ this.state.errorText }&nbsp;
          </p>
          <div className='w-100 border border-dark' style={{height: 65}}>
            <Row className="m-0 h-100">
              <Col xs='11' className="p-0 align-center">
                <Input
                  type={lastQuestion.type === dataType.number ? dataType.number : dataType.text}
                  className="w-100 h-100 border-0"
                  onKeyUp={this.handleInputKeyPress(curIndex) }
                  disabled={disabled}
                  innerRef={this.getAnswerRef}
                  defaultValue={!disabled ? lastQuestion.answer : ''}
                />
              </Col>
              <Col xs='1' className={cx(
                "p-0 align-center",
                "d-flex align-self-center justify-content-center")}
              >
                <FaArrowCircleRight 
                  onClick={this.handleSelectAnswer(curIndex, lastQuestion.answer)} 
                  size={24}
                  disabled={lastQuestion.type !== dataType.text && lastQuestion.type !== dataType.number} 
                />
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }
}

export default Chat