import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "./../../actions/userActions";
import { withAlert } from "react-alert";
import { withRouter } from "react-router-dom";
import "./Login.css";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleLogin = (e) => {
    e.preventDefault();
    let { email, password } = this.state;
    this.props.handleLogin({ email, password });
    setTimeout(() => {
      let { statusCode, message } = this.props.message;
      let { error, success } = this.props.alert;
      if (statusCode === 200) {
        success(message);
        this.props.history.push("/admin");
      } else {
        error(message);
      }
    }, 600);
  };
  render() {
    return (
      <div>
        <>
          <legend>Form title</legend>

          <div class="form-group">
            <label for="">email</label>
            <input
              onChange={this.handleOnChange}
              name="email"
              type="text"
              placeholder="email field"
            />
          </div>
          <div class="form-group">
            <label for="">password</label>
            <input
              onChange={this.handleOnChange}
              name="password"
              type="text"
              placeholder="password field"
            />
          </div>
          <button
            onClick={this.handleLogin}
            type="submit"
            class="btn btn-primary"
          >
            LOGIN
          </button>
        </>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    message: state.message,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: (obj) => {
      dispatch(actions.handleLogin(obj));
    },
  };
};
export default withRouter(
  withAlert()(connect(mapStateToProps, mapDispatchToProps)(Login))
);
