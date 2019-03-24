import React, { Component } from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";

let fromPatient;

class AddPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      date: "",
      prescription: "",
      patientId: ""
    };

    this.onAdd = this.onAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onAdd() {
    fromPatient = this.props.match.params.id;

    const newPrescription = {
      date: this.state.date,
      prescription: this.state.prescription,
      patientId: fromPatient
    };
    const url = process.env.REACT_APP_URL+'/prescriptions';
    axios
      .request({
        method: "post",
        url: url,
        data: newPrescription
      })
      .then(response => {
        const currentDate = new Date();
        const newLog = {
          activity: "Added prescription to patient: " + fromPatient,
          date: currentDate,
          user: localStorage.userName
        };
        const url2 = process.env.REACT_APP_URL+'/logs';
        axios.request({
          method: "post",
          url: url2,
          data: newLog
        });
        this.props.history.push("/app/patients/");
      });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open, dimmer } = this.state;

    return (
      <span>
        <Modal dimmer={dimmer} open={open} onClose={this.close}>
          <Modal.Header>Add Prescription</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    onChange={this.handleChange}
                    value={this.state.date}
                    label="Date"
                    name="date"
                    type="date"
                    ref="date"
                  />
                  <Form.Input
                    onChange={this.handleChange}
                    value={this.state.prescription}
                    label="Prescription"
                    name="prescription"
                    type="text"
                    placeholder="Prescription"
                    ref="prescription"
                  />
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Link to="/app/patients" className="ui button negative">
              Cancel
            </Link>
            <Button onClick={this.onAdd} positive>
              Confirm
            </Button>
          </Modal.Actions>
        </Modal>
      </span>
    );
  }
}

export default AddPrescription;
