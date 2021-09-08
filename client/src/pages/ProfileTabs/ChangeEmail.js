import React from "react";
import CustomModal from "../../components/CustomModal";
import { Form, Col, Button, Card } from "react-bootstrap";
import { setCookie } from "../../cookies";
const client = require("../../clientRequests");

export default class ChangeEmail extends React.Component
{
    changeEmailComplete = false;
    constructor(props)
    {
        super(props)
        this.state =
        {
            fields:
            {
                newEmail: "",
                password: ""
            },
            errors:
            {
                newEmail: "",
                password: "",
                isValid: false
            },
            modal:
            {
                show: false,
                title: "Съобщение",
                body: ""
            },
        }
    }
    submitForm = async (event) =>
    {
      
      event.preventDefault();
      this.validate();
      if(this.state.errors.isValid)
      {
          const fields = this.state.fields;
          let res = await client.postRequestToken("/user/changeEmail", fields);
          if(res === true)
          {
            this.openModal("Имейл адресът е сменен успешно! Моля проверете новата си поща и след това влезте в профила с новия имейл адрес!");
            setCookie("authorization", "", 1);
            this.changeEmailComplete = true;
          }
          else
          {
            this.openModal("Въвели сте неправилна парола!");
          }
      }
    }
    validate()
    {
        const fields = this.state.fields;
        let errors =
        {
            newEmail: "",
            password: "",
            isValid: true

        };
        const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if(!isEmail.test(fields["newEmail"]))
        {
            errors["newEmail"] = "Новият имейл е невалиден!";
            errors["isValid"] = false;
        }
        if(!checkPass.test(fields["password"]) || fields["password"].length < 8)
        {
            errors["password"] = "Паролата е невалидна!";
            errors["isValid"] = false;
        }
        this.setState({errors});

    }
    openModal = (body) =>
    { 
        let modal = this.state.modal;
        modal.show = true;
        modal.body = body;
        this.setState({modal});
    }
    closeModal = () =>
    { 
        let modal = this.state.modal;
        modal.show = false;
        this.setState({modal});
        if(this.changeEmailComplete)
        {
            window.location.href = "/login";
        }
    }
    handleOnChangeValue = (event) =>
    {
        let fields = this.state.fields;
        fields[event.target.id] = event.target.value;
        this.setState({fields});
        this.validate();
    }
    render()
    {
        return(
            <div>
                <CustomModal show={this.state.modal.show} title={this.state.modal.title} body={this.state.modal.body} closeModal={this.closeModal}></CustomModal>
                <Card body>
                    <Form onSubmit={this.submitForm}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="newEmail">
                                <Form.Label>Нов имейл</Form.Label>
                                <Form.Control type="text" value={this.state.fields.newEmail} onChange={this.handleOnChangeValue}/>
                                <span className="text-danger">{this.state.errors.newEmail}</span>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="password">
                                <Form.Label>Парола</Form.Label>
                                <Form.Control type="password" value={this.state.fields.password} onChange={this.handleOnChangeValue}/>
                                <span className="text-danger">{this.state.errors.password}</span>
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" type="submit">
                            Влизане
                        </Button>
                    </Form>
                </Card>
            </div>
        )

    }
}