import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import {
  MainContainer,
  NxtWatchContainer,
  FormContainer,
  LoginLogo,
  Username,
  Password,
  LoginBtn,
  Input,
  Label,
  ShowPasswordContainer,
  CheckBox,
  ShowPassword,
  ErrorMsg,
} from './styledComponents'

class Login extends Component {
  state = {
    darkMode: false,
    showErrMsg: false,
    errorMsg: '',
    username: '',
    password: '',
    showPassword: false,
  }

  submitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }

  SubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  showPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  renderPassword = () => {
    const {password, showPassword, darkMode} = this.state
    const passwordType = showPassword ? 'text' : 'password'
    return (
      <>
        <Label mode={darkMode} htmlFor="password">
          PASSWORD
        </Label>
        <Input
          mode={darkMode}
          id="password"
          placeholder="Password"
          type={passwordType}
          value={password}
          onChange={this.changePassword}
        />
      </>
    )
  }

  renderUsername = () => {
    const {username, darkMode} = this.state
    return (
      <>
        <Label mode={darkMode} htmlFor="username">
          USERNAME
        </Label>
        <Input
          mode={darkMode}
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={this.changeUsername}
        />
      </>
    )
  }

  renderShowPassword = () => {
    const {darkMode} = this.state
    return (
      <>
        <CheckBox type="checkBox" id="show" onClick={this.showPassword} />
        <ShowPassword mode={darkMode} htmlFor="show">
          Show Password
        </ShowPassword>
      </>
    )
  }

  render() {
    const {darkMode, showErrMsg, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <MainContainer mode={darkMode}>
        <NxtWatchContainer mode={darkMode}>
          <LoginLogo
            src={
              darkMode
                ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
                : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
            }
            alt=""
          />
          <FormContainer onSubmit={this.SubmitForm}>
            <Username>{this.renderUsername()}</Username>
            <Password>{this.renderPassword()}</Password>
            <ShowPasswordContainer>
              {this.renderShowPassword()}
            </ShowPasswordContainer>
            <LoginBtn type="submit">Login</LoginBtn>
            {showErrMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
          </FormContainer>
        </NxtWatchContainer>
      </MainContainer>
    )
  }
}
export default Login
