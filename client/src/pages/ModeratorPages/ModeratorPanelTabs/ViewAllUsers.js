import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ListGroup,
  Col,
  Row,
  Spinner,
  Pagination,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class ViewAllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      users: [],
      numPages: 0,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
    };
    this.getUsers(1);
  }
  getUsers = async (page, search) => {
    let url = `/moderator/getAllUsers/${page}`;
    if (search === true)
      url += `/${encodeURIComponent(this.state.searchQuery)}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({ page: page, numPages: data.numPages, users: data.users });
    } else {
      this.setState({ page: 1, numPages: 1, users: [] });
    }
  };
  handleOnChangeValue = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  search = (event) => {
    event.preventDefault();
    if (this.state.searchQuery === "") {
      this.setState({ search: false, lastSearchQuery: "" });
      this.getUsers(1, false);
    } else {
      this.setState({ search: true, lastSearchQuery: this.state.searchQuery });
      this.getUsers(1, true);
    }
  };
  openUser = async (id) => {
    this.props.navigate(`/moderator/viewUser?id=${id}`);
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.users.length === 0}>
        <Pagination.Item
          onClick={() => this.getUsers(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <li className="page-item">
          <span className="page-link bg-primary text-secondary">
            {this.state.page}
          </span>
        </li>
        <Pagination.Item
          onClick={() => this.getUsers(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <Row>
          <Form onSubmit={this.search} className="mw-75">
            <div className="d-flex">
              <div className="col-sm-8">
                <FloatingLabel controlId="searchQuery" label="Търсене">
                  <Form.Control
                    placeholder="Търсене"
                    type="text"
                    value={this.state.searchQuery}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
              </div>
              <div className="align-self-center ms-3">
                <Button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </Button>
              </div>
            </div>
          </Form>
        </Row>
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={this.state.users.length !== 0 || this.state.numPages === 0}
        >
          Няма намерени потребители!
        </h4>
        <div className="text-center mt-3" hidden={this.state.numPages > 0}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <ListGroup>
          {this.state.users.map((user) => (
            <ListGroup.Item
              key={user._id}
              id={user._id}
              onClick={() => {
                this.openUser(user._id);
              }}
            >
              <Row>
                <Col xs={3} sm={2}>
                  <img
                    className="rounded-circle"
                    src={`${API_URL}/user/img/${user.imgFileName}`}
                    height="60px"
                    weight="60px"
                    alt="avatar"
                    crossOrigin={window.location.origin}
                  />
                </Col>
                <Col>
                  {user.name.first} {user.name.last}
                  <br />
                  <span className="text-muted">
                    {user.email}, {user.phoneNumber}, {user.city.type}{" "}
                    {user.city.name}, {user.city.region}
                  </span>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {pagination}
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <ViewAllUsers {...props} navigate={navigate} />;
}
