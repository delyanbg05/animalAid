import React from "react";
import CustomModal from "../components/CustomModal";
import { Form, Col, Button, Card } from "react-bootstrap";
const client = require("../clientRequests");

export default class RequestForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: "",
      },
      errors: {
        email: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const fields = this.state.fields;
      let res = await client.postRequest("/user/requestForgotPassword", fields);
      if (res === true) {
        this.openModal(
          "Моля проверете имейл адреса си и отворете линка за смяна на паролата!"
        );
      } else if (res === "TOO_EARLY") {
        this.openModal(
          "Имате право да изпращате само по една заявка за забравена парола на 24 часа! Моля опитайте отново след 24 часа!"
        );
      } else {
        this.openModal("Не съществува профил с този имейл адрес!");
      }
    }
  };
  validate() {
    const fields = this.state.fields;
    let errors = {
      email: "",
      isValid: true,
    };
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!isEmail.test(fields["email"])) {
      errors["email"] = "Имейлът е невалиден!";
      errors["isValid"] = false;
    }

    this.setState({ errors });
  }
  openModal = (body) => {
    let modal = this.state.modal;
    modal.show = true;
    modal.body = body;
    this.setState({ modal });
  };
  closeModal = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
  };
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  render() {
    return (
      <div>
        <CustomModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></CustomModal>
        <h3 className="text-center">Забравена парола</h3>
        <Card body>
          <Form onSubmit={this.submitForm}>
            <Form.Row>
              <Form.Group as={Col} controlId="email">
                <Form.Label>Имейл</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.fields.email}
                  onChange={this.handleOnChangeValue}
                />
                <span className="text-danger">{this.state.errors.email}</span>
              </Form.Group>
            </Form.Row>
            <Button
              variant="primary"
              type="submit"
              disabled={!this.state.errors.isValid}
            >
              Заявка за забравена парола
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}
