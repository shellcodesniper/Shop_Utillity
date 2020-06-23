import React from 'react'
import {
  Button,
  Checkbox,
  Form,
  Container,
  Segment,
  Dimmer,
  Loader,
  Grid
} from "semantic-ui-react";
import {
  Redirect
} from "react-router-dom";

import "stylesheets/main.css";
const {
  ipcRenderer
} = window;



class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: '',
      username : localStorage.getItem("username"),
      password : localStorage.getItem("password"),
      loading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("response_crawler_login", function (event, data) {
      this.setState(
          { loading:false }
        )
      if(data === "NOT_LOGGED_IN") {
        const options = {
          type: "question",
          buttons: ["확인"],
          title: "에러!",
          message: "로그인중 문제가 발생하였습니다.",
          detail: "아이디 / 비밀번호를 다시 확인해보세요",
        };
        ipcRenderer.send("request_show_message_box", options);
      }
      else {
        this.setState({redirectUrl: '/home'})
      }
    }.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      { loading:true }
    )

    if (this.state.username !== "" && this.state.password !== "") {
      localStorage.setItem("username", this.state.username);
      localStorage.setItem("password", this.state.password);
    }
    
    let reqdata = {username:this.state.username, password:this.state.password}
    ipcRenderer.send("request_crawler_login", reqdata);
    console.log(this.state.username, this.state.password);
  }
  handleChange(event) {
    switch (event.target.name) {
      case "username":
        this.setState({username:event.target.value})
        break;
      case "password":
        this.setState({password:event.target.value})
        break;
      default:
        break;
    }
  }

  render (){
    if(this.state.redirectUrl !== ""){
      console.log("redirect to ", this.state.redirectUrl)
      return (<Redirect to={this.state.redirectUrl}/>)
    }
      
    return (
      <Container className="fullWidth">
        <Grid columns={2} verticalAlign='middle' centered className="centered fullWidth">
          <Grid.Row>
            <Grid.Column>
              <Segment>
                {this.state.loading &&
                <Dimmer active className="dimmerColoring">
                  <Loader size='massive'>로그인중</Loader>
                </Dimmer>
                }
                <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                  <Form.Field>
                    <label>스토어팜 아이디</label>
                    <input name="username" value={this.state.username} placeholder='스토어팜 아이디' />
                  </Form.Field>
                  <Form.Field>
                    <label>스토어팜 비밀번호</label>
                    <input name="password" value={this.state.password} placeholder='스토어팜 비밀번호' />
                  </Form.Field>
                  <Form.Field>
                  </Form.Field>
                  <Button type='submit'>Submit</Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      
    );
  }
}

export default Main;