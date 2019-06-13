import './styles.scss'

import { MdCheckBoxOutlineBlank, MdFiberManualRecord } from 'react-icons/md'
import React, { Component } from 'react'

import { Button } from 'reactstrap'
import { routeStr } from 'utils/constants'

class FirstPage extends Component {

  /* Handle Exit Button */
  handleExit = () => {
    var win = window.open("about:blank", "_self");
    win.close();
  }

  handleRoute = (route, prevRoute) => () => {
    this.props.handleRoute(route, prevRoute)
  }

  render() {
    const { curRoute, isMobile } = this.props
    
    return(
      <>
        <div>
          <label className='mb-5' onClick={this.handleExit}>Exit</label>
          <h1 className='mb-2'>This is a fun headline</h1>
          <h4 className='mb-5'>Intro copy that will help users navigate this experience.</h4>
          <ul className='no-style'>
            <li onClick={this.handleRoute(routeStr.humanProfile, routeStr.humanProfile)}>
              {(curRoute === 'humanProfile' || isMobile) ? 
                <MdFiberManualRecord />
              : <MdCheckBoxOutlineBlank className="blankIcon" />
              } Human Profile
            </li>
            <li onClick={this.handleRoute(routeStr.petProfile, routeStr.humanProfile)}>
              {(curRoute === 'petProfile' && !isMobile) ?
                <MdFiberManualRecord />
              : <MdCheckBoxOutlineBlank className="blankIcon" />
              } Pet Profile
            </li>
            <li onClick={this.handleRoute(routeStr.details, routeStr.petProfile)}>
              {(curRoute === 'details' && !isMobile) ?
                <MdFiberManualRecord />
              : <MdCheckBoxOutlineBlank className="blankIcon" />
              } Details
            </li>
          </ul>
        </div>
        {isMobile &&
        <Button
          className="my-5"
          color="primary"
          size="lg"
          block
          onClick={this.props.handleStartButton}
        >
          Get Started
        </Button>
        }
      </>
    )
  }
}

export default FirstPage