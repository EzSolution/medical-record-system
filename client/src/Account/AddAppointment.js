import React, { Component } from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import axios from "axios";

class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      date: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAppointment = this.handleAppointment.bind(this);
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = () => this.setState({ open: false });

  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAppointment() {
    const newAppointment = {
      date: this.state.date,
      time: this.state.time,
      lastName: this.props.patient.lastName,
      firstName: this.props.patient.firstName
    };
    const url = process.env.REACT_APP_URL+'/appointments';
    axios
      .request({
        method: "post",
        url: url,
        data: newAppointment
      })
      .then(response => {
        const currentDate = new Date();
        const newLog = {
          activity: "Added appointment: " + this.props.patient.lastName,
          date: currentDate,
          user: localStorage.userName
        };
        const url2 = process.env.REACT_APP_URL+'/logs';
        axios.request({
          method: "post",
          url: url2,
          data: newLog
        });
      });

    this.setState({ open: false });
  }

  render() {
    const { open, dimmer } = this.state;

    return (
      <div>
        <span onClick={this.show("blurring")} fluid positive>
          Add Appointment
        </span>

        <Modal dimmer={dimmer} open={open} onClose={this.close}>
          <Modal.Header>
            Add Appointment with {this.props.patient.lastName}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                onChange={this.handleChange}
                value={this.state.date}
                label="Date"
                name="date"
                type="date"
              />
              <Form.Input
                onChange={this.handleChange}
                value={this.state.time}
                label="Time"
                name="time"
                type="text"
              />
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button negative onClick={this.close}>
              Cancel
            </Button>

            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Yes"
              onClick={this.handleAppointment}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default AddAppointment;
