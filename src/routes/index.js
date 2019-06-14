import './styles.scss'

import { Col, Row } from 'reactstrap'
import React, { Component } from 'react'
import { Redirect, Route, Router } from 'react-router-dom'
import { dataType, routeStr } from 'utils/constants'

import Chat from 'pages/Chat'
import FirstPage from 'pages/FirstPage'
import Header from 'containers/Header'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import cx from 'classnames'
import fp from 'lodash/fp'
import { withSize } from 'react-sizeme'

class Routes extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    size: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      /* State for Human */
      [routeStr.humanProfile]: [{
          type: dataType.text,
          content: `Hey! We're goint to ask you a few questions about your dog(s)` +
                   `so we can curate supplements personalized just for them!\n\n` +
                   `Let's get started. What's your name?`
        }, {
          type: dataType.number,
          content: `Nice to meet you #humanName! How many dogs do you have?`
      }],

      /* State for Pet */
      [routeStr.petProfile]: [{
          type: dataType.text,
          content: `What is your dog name?`
        }, {
          type: dataType.button,
          content: `What is #dogName's gender?`,
          choice: [{
              title: 'Girl'
            }, {
              title: 'Boy'
          }]
        }, {
          type: dataType.button,
          content: `#dogName is`,
          choice: [{
              title: 'Spayed'
            }, {
              title: 'Not Spayed'
          }]
        }, {
          type: dataType.button,
          content: `How active would you say #dogName is?`,
          choice: [{
              title: 'Couch Potato',
              description: `#dogGender enjoys a long\n snooze over a run\n at the park`
            }, {
              title: 'Moderate',
              description: `#dogGender gets some good\n experience about\n 3x a week`
          }]
        }, {
          type: dataType.picture,
          content: ''
        }, {
          type: dataType.other,
          content: 'Aww a lazy pup! Almost done now moving on to the details.' 
      }],

      /* State for Details */
      [routeStr.details]: [{
          type: dataType.button,
          content: `Does #dogName have any allegies?`,
          choice: [{
              title: 'Yes'
            }, {
              title: 'No'
          }]
        }, {
          type: dataType.icon,
          content: 'Poor.#dogName! Select #dogGenderPN known allergies',
          answer: [],
          choice: [{
              title: 'Allergy 1'
            }, {
              title: 'Allergy 2'
            }, {
              title: 'Allergy 3'
            }, {
              title: 'Allergy 4'
            }, {
              title: 'Allergy 5'
            }, {
              title: 'Allergy 6'
            }, {
              title: 'Allergy 7'
            }, {
              title: 'Allergy 8'
          }]
      }],
      unitIndex: 0, // Step index in each route
      curRoute: routeStr.humanProfile, //Current Route
      isFirstPage: true
    }
  }

  /* Handles routes */
  handleRoute = (route, prevRoute) => {
    const { history, size: { width } } = this.props
    
    if (width >= 768) { // Check resolution
      const answeredCount =
        fp.filter(item => typeof item.answer !== 'undefined')(this.state[route]).length
      const prevRouteAnsweredCount =
        fp.filter((item) => typeof item.answer !== 'undefined')(this.state[prevRoute]).length
      const prevRouteQuizCount = this.state[prevRoute].length
      const isPrevRouteFullyAnswered =
        prevRouteAnsweredCount === prevRouteQuizCount ? true :  false

      if (answeredCount > 0 || isPrevRouteFullyAnswered) { // Check whether enable next route
        this.setState({curRoute: route, unitIndex:0})
        history.push(`/${route}`)
      }
    } else {
      this.selectedNav = route
    }
  }

  /* Store answer */
  handleSelectAnswer = (unitIndex, answer) => {
    const { history } = this.props
    const curRoute = this.state.curRoute
    let inProgressState = fp.set(`[${unitIndex}].answer`, answer)(this.state[curRoute])
    
    if (curRoute === routeStr.humanProfile) { //If question is about human profile
      if (unitIndex === this.state.humanProfile.length - 1) { //Check if current question is last one in it's route
        //Store answer and go to next route
        this.setState({
          unitIndex: 0,
          curRoute: routeStr.petProfile,
          [routeStr.humanProfile]: inProgressState
        })
        history.push(`/${routeStr.petProfile}`)
      } else {
        //Store answer and go to next question
        const newContent =
          inProgressState[unitIndex + 1].content
            .replace('#humanName', answer)
            .replace(this.state.prevHumanName, answer)
        const newState = fp.set(`[${unitIndex + 1}].content`, newContent)(inProgressState)
        this.setState({
          unitIndex: unitIndex + 1,
          [routeStr.humanProfile]: newState,
          prevHumanName: answer
        })
      }
    } else if (curRoute === routeStr.petProfile) { //If question is about pet profile
      if (unitIndex === this.state.petProfile.length - 1) {
        
        let inDetailsProgressState = JSON.parse(JSON.stringify(this.state[routeStr.details]))
        inDetailsProgressState[0].content =
          inDetailsProgressState[0].content
            .replace('#dogName', this.state.dogName)
            .replace(this.state.prevDogName, this.state.dogName)

        inDetailsProgressState[1].content =
          inDetailsProgressState[1].content
            .replace('#dogName', this.state.dogName)
            .replace(this.state.prevDogName, this.state.dogName)

        inDetailsProgressState[1].content =
          inDetailsProgressState[1].content
            .replace('#dogGenderPN', this.state.dogGenderPN)
            .replace(this.state.prevDogGenderPN, this.state.dogGenderPN)

        this.setState({
          unitIndex: 0,
          curRoute: routeStr.details,
          [routeStr.petProfile]: inProgressState,
          [routeStr.details]: inDetailsProgressState,
          prevDogName: this.state.dogName,
          prevDogGenderPN: this.state.dogGenderPN
        })
        
        history.push(`/${routeStr.details}`)
      } else {
        const isAnswerNumber = Number.isInteger(answer)
        let dogName = this.state.dogName, dogGenderPN = this.state.dogGenderPN
        
        if (isAnswerNumber) { 
          if (unitIndex === 1) { //Answer is for pet gender
            const petGender = answer === 0 ? 'She' : 'He'
            const petOppositeGender = answer === 0 ? 'He' : 'She'
            dogGenderPN = answer === 0 ? 'her' : 'his'
  
            inProgressState = inProgressState.map(item => {
              if (typeof item.choice !== 'undefined') { // Question which has choice as element
                return {
                  ...item,
                  choice: item.choice.map(choice => {
                    if (typeof choice.description !== 'undefined') {
                      return {
                        ...choice,
                        description: choice.description
                          .replace('#dogGender', petGender)
                          .replace(petOppositeGender, petGender)
                      }
                    } else {
                      return choice
                    }
                  })
                } 
              } else {
                return item
              }
            })
          }
        } else {
          if (unitIndex === 0) {
            dogName = answer
            const prevDogName = this.state.dogName

            inProgressState = inProgressState.map(item => {
              return {
                ...item, 
                content: item.content
                  .replace('#dogName', answer)
                  .replace(prevDogName, answer)
              }
            })
          }
        }

        this.setState({
          unitIndex: unitIndex + 1,
          [routeStr.petProfile]: inProgressState,
          dogName,
          dogGenderPN
        })
      }
    } else if (curRoute === routeStr.details) {  //If question is about details
      if (answer === 0 && unitIndex === 0)
        unitIndex++

      if (unitIndex === 0)
        inProgressState[1].answer = []

      this.setState({
        unitIndex: unitIndex,
        [routeStr.details]: inProgressState
      })

    }
  }

  /* Handle start button in mobile resolution */
  handleStartButton = () => {
    const { history } = this.props
    this.setState({isFirstPage: false})
    history.push(`/${routeStr.humanProfile}`)
  }

  /* Handle back button in mobile resolution */
  handleBackButton = () => {
    const curRoute = this.state.curRoute
    const unitIndex = this.state.unitIndex
    const { history } = this.props

    if (curRoute === routeStr.humanProfile && unitIndex === 0) {
      this.setState({isFirstPage: true})
      history.push('/')
    } else {
      if (unitIndex > 0)
        this.setState({unitIndex: unitIndex-1})
      else {
        const targetRoute = 
          curRoute === routeStr.petProfile 
            ? routeStr.humanProfile 
            : routeStr.petProfile
        
        const lastIndex = this.state[targetRoute].length - 1
        this.setState({curRoute : targetRoute, unitIndex : lastIndex})
        history.push(`/${targetRoute}`)
      }
    }
  }

  /* Question and answer view component */
  chat = type => () => {
    const unitIndex = this.state.unitIndex
    const { size:{ width } } = this.props
    const isMobile = width < 768 ? true : false
    
    return (
      <Col
        xs='12' 
        md='6' 
        className={cx(
          "p-0", 
          "overflow-auto",
          "d-flex flex-column justify-content-between"
        )}
      >
        <Chat
          isMobile={isMobile}
          data={this.state[type]}
          unitIndex={unitIndex}
          handleSelectAnswer={this.handleSelectAnswer}
        />
      </Col>
    )
  }
  
  render() {
    const {history, size: { width } } = this.props
    const isMobile = width < 768 ? true : false
    const isFirstPage = this.state.isFirstPage
    const curRoute = this.state.curRoute
    
    return (
      <Router history={history}>
        {(!isMobile || (isMobile && !isFirstPage)) &&
        <Row className='headerRow'>
          <Header handleBackButton={this.handleBackButton} isMobile={isMobile} />
        </Row>
        }
        <Row className='contentRow'>
          {(!isMobile || (isMobile && isFirstPage)) &&
            <Col
              xs='12'
              md='6'
              className={cx(
                'px-5 py-4',
                'bg-dark text-white',
                'd-flex flex-column justify-content-between',
                { 'fullHeightView' : isMobile }
              )}
            >
              <FirstPage 
                isMobile={isMobile}
                curRoute={curRoute}
                handleRoute={this.handleRoute}
                handleStartButton={this.handleStartButton}
              />
            </Col>
          }
          <Route exact path='/' render={() => (
            (!isMobile &&
              <Redirect to='/humanProfile' />
            )
          )}/>
          <Route path='/humanProfile' component={this.chat(routeStr.humanProfile)} />
          <Route path='/petProfile' component={this.chat(routeStr.petProfile)} />
          <Route path='/details' component={this.chat(routeStr.details)} />
        </Row>
      </Router>
    )
  }
}

export default compose(
  withSize()
)(Routes)
