import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";

class DeletePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      item: this.props.item,
      details: ""
    };

    this.getPatient = this.getPatient.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentWillMount() {
    this.getPatient();
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onDelete() {
    let patientId = this.props.match.params.id;
    const url = process.env.REACT_APP_URL+'/patients/' + patientId;
    axios
      .delete(url)
      .then(reponse => {
        //Add to logs
        const currentDate = new Date();
        const newLog = {
          activity: "Deleted Patient: " + this.state.details.lastName,
          date: currentDate,
          user: localStorage.userName
        };
        const url2 = process.env.REACT_APP_URL+'/logs';
        axios.request({
          method: "post",
          url: url2,
          data: newLog
        });

        this.props.history.push("/app/patients");
      });
  }

  getPatient() {
    let patientId = this.props.match.params.id;
    const url = process.env.REACT_APP_URL+'/patients/' + patientId;
    axios
      .get(url)
      .then(response => this.setState({ details: response.data }));
  }

  show = dimmer => () => this.setState({ dimmer, open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open, dimmer } = this.state;

    return (
      <span>
        <Modal dimmer={dimmer} open={open} onClose={this.close}>
          <Modal.Header>Delete Patient</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>Are you sure you want to delete?</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Link to="/app/patients" className="ui button negative">
              Cancel
            </Link>
            <Button onClick={this.onDelete} positive>
              Confirm
            </Button>
          </Modal.Actions>
        </Modal>
      </span>
    );
  }
}

export default DeletePatient;
