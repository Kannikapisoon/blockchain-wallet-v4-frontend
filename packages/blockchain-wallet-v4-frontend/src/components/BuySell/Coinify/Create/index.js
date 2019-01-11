import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import Create from './template'

const { CREATE, VERIFY } = model.components.coinify.REGISTER_STATES

class CreateContainer extends PureComponent {
  state = {
    create: this.props.emailVerified ? CREATE : VERIFY,
    uniqueEmail: true,
    codeSent: false
  }
  componentDidMount () {
    if (!this.props.emailVerified)
      this.props.securityCenterActions.updateEmail(this.props.email)
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      // eslint-disable-next-line
      this.setState({ create: CREATE })
    }
    if (
      !prevProps.emailVerified &&
      this.props.emailVerified
    ) {
      this.props.coinifyFrontendActions.coinifyNotAsked()
    }
  }

  render () {
    const { handleSignup, email, signupError, ...rest } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        email={email}
        country={this.props.country}
        updateCreate={step => this.setState({ create: step })}
        updateUniqueEmail={unique => this.setState({ uniqueEmail: unique })}
        updateCodeSent={sent => this.setState({ codeSent: sent })}
        {...this.state}
        {...rest}
      />
    )
  }
}

CreateContainer.propTypes = {
  emailVerified: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  coinifyFrontendActions: bindActionCreators(
    actions.components.coinify,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  getData,
  mapDispatchToProps
)(CreateContainer)
