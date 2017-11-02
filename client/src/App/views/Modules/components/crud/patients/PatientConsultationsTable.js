import React, { Component } from 'react';
import axios from 'axios';
import changeCase from 'change-case';
import { Table } from 'semantic-ui-react';
import PatientConsultationRow from './PatientConsultationRow';
import TablePagination from '../../../../components/TablePagination';
import constants from '../../../../../../constants';

class PatientConsultationsTable extends Component{
  constructor(props){
    super(props);
    this.state = {
      data:[],
      fields: [],
      address:'',
      activeItem: 1,
      itemPerPage: 5,
      currentUrl: '/modules/patients'
    }
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemClickRight = this.handleItemClickRight.bind(this);
    this.handleItemClickLeft = this.handleItemClickLeft.bind(this);
  }

  componentDidMount(){
    const fields = ['date', 'payment', 'balance', 'remarks'];
    this.setState({ fields: fields });
    this.getConsultations();
  }

  getConsultations(){
    const id = this.props.patientId;
    const table = 'patients';
    const serverUrl = constants.server_url.app + '/' + table;
    axios.get(`${serverUrl}/${id}/consultations`)
    .then(response => {
      this.setState({data: response.data})
  })
  .catch(err => console.log(err));
  }

  handleItemClick(e, {name}){
    name = parseInt(name, 10);
    this.setState({ activeItem: name });
  }

  handleItemClickRight(e){
    const pageNumbers = [];
    const { itemPerPage } = this.state;
    for (let i = 1; i <= Math.ceil(this.state.data.length / itemPerPage); i++) {
      pageNumbers.push(i);
    }
    let item = this.state.activeItem + 1;
    if (this.state.activeItem === pageNumbers.length){
      item = this.state.activeItem;
    }
    this.setState({ activeItem: item });
  }

  handleItemClickLeft(e){
    let item = this.state.activeItem - 1;
    if (this.state.activeItem === 1){
      item = this.state.activeItem;
    }
    this.setState({ activeItem: item });
  }

  render(){
    const { data, fields, activeItem, itemPerPage } = this.state;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemPerPage); i++) {
      pageNumbers.push(i);
    }
    const indexOfLast = activeItem * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    let currentData = this.state.data.slice(indexOfFirst, indexOfLast);
    let headers = fields.map((field,index) => {
      return (
        <Table.HeaderCell
          key={index}
        >
          {changeCase.titleCase(field)}
        </Table.HeaderCell>
      )
    });
    let body;
    if (currentData.length === 0 ){
      body = (
        <Table.Row>
          <td>
            No records found
          </td>
        </Table.Row>
      )
    } else {
      body = currentData.map((rows, index) => {
        return(
          <PatientConsultationRow
            data={rows}
            fields={fields}
            key={index}
          />
        )
      });
    }


    return (
      <div>
        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              { headers }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { body }
          </Table.Body>

          <TablePagination
            fields={fields}
            activeItem={activeItem}
            pageNumbers={pageNumbers}
            handleItemClick={this.handleItemClick}
            handleItemClickLeft={this.handleItemClickLeft}
            handleItemClickRight={this.handleItemClickRight}
          />
        </Table>
      </div>
    )
  }
}

export default PatientConsultationsTable;
