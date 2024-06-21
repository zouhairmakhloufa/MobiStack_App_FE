import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardText, CardTitle, Col, Form, Input, Label, Row } from 'reactstrap'
import axios from 'axios'
import { getUserData } from '../utility/Utils'
import { useNavigate, useParams } from 'react-router-dom';
export default function EditUser() {

    const params =useParams()
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate()

    const userData = getUserData()

    useEffect(() => {

        getUserById()

    }, [])



    const getUserById = () => {
        axios.get('http://localhost:5000/api/user/getById/' + params?.id)
            .then((res) => {
                setUser(res.data.data)
            })
            .catch((error) => {
                console.error('Error fetching question:', error);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };
    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);

        if (avatar) {
            formData.append('avatar', avatar);
        }

        axios
            .put('http://localhost:5000/api/user/update/' + params?.id, formData)
            .then((res) => {
                console.log('Profile updated successfully:', res.data);
                navigate('/users')
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    return (
        <Card  >

            <CardBody>
                <Row>
                    <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
                        <CardTitle tag="h2" className="fw-bold mb-1">
                            Update Your Information🚀
                        </CardTitle>

                        <Form
                            className="auth-register-form mt-2"

                        >
                            <div className="mb-1">
                                <Label className="form-label" for="register-firstName">
                                    First Name
                                </Label>
                                <Input
                                    type="text"
                                    id="register-firstName"
                                    placeholder="johndoe"
                                    autoFocus
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleInputChange}

                                />
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-lastName">
                                    Last Name
                                </Label>
                                <Input
                                    type="text"
                                    id="register-lastName"
                                    placeholder="deLpie"
                                    autoFocus
                                    name="lastName"

                                    value={user.lastName}
                                    onChange={handleInputChange}


                                />
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-email">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="register-email"
                                    placeholder="john@example.com"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    name="email"


                                />
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="register-email">
                                    Avatar
                                </Label>
                                <Input
                                    type="file"
                                    onChange={handleAvatarChange}
                                    id="avatar-upload"

                                />
                            </div>


                            <Button type="button" onClick={handleSubmit} color="primary" block>
                                update
                            </Button>
                        </Form>


                    </Col>
                </Row>



            </CardBody>
        </Card>
    )
}
