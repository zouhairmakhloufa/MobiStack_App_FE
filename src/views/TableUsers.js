import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Label,
  Input,
  Row,
  Col,
  Badge,
  Button,

} from "reactstrap"
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash } from 'react-feather';
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"
import Swal from 'sweetalert2'; // Pour la confirmation avant suppression
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useNavigate } from 'react-router-dom';


export default function TableUsers() {

  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');

  useEffect(() => {
    getAllUser()
  }, [])

  const getAllUser = () => {
    axios.get('http://localhost:5000/api/user/getAll')
      .then((res) => {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);


      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }

  const deleteUser = (userId) => {
    axios
      .delete(`http://localhost:5000/api/user/delete/${userId}`) // Assurez-vous que votre API prend en charge la suppression par ID
      .then(() => {
        // Mettre à jour les états après suppression
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        console.log(`User with ID ${userId} deleted`);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const confirmDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId); // Appeler la fonction de suppression
      }
    });
  };

  // Handle filter changes
  const handleEmailFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchEmail(value);

    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(value)
      )
    );
  };

  const handleRoleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchRole(value);

    setFilteredUsers(
      users.filter((user) =>
        user.role.toLowerCase().includes(value)
      )
    );
  };

  const handleFirstNameFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchFirstName(value);

    setFilteredUsers(
      users.filter((user) =>
        user.firstName.toLowerCase().includes(value)
      )
    );
  };

  const handleLastNameFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchLastName(value);

    setFilteredUsers(
      users.filter((user) =>
        user.lastName.toLowerCase().includes(value)
      )
    );
  };

  // DataTable columns
  const columns = [
    {
      name: 'Avatar',
      selector: (row) => <img src={row.avatar || defaultAvatar} style={{ borderRadius: '50%' }} alt="Avatar" width={40} height={40} />,
      sortable: false,
    },
    { name: 'First Name', selector: (row) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row) => row.lastName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    {
      name: 'Role', selector: (row) => <Badge color={row.role == 'admin' ? 'light-success' : 'light-primary'}>
        {row.role}    </Badge>, sortable: true
    },
    {
      name: 'Actions',
      selector: (row) => (
        <div className='d-flex justify-content-center gap-1'>
          <Button
            className="btn btn-outline-danger"
            color="light"
            onClick={() => confirmDelete(row._id)}
            size="sm"
          >
            <Trash size={16} />
          </Button>

          <Button
            className="btn btn-outline-info mr-2"
            color="light"
            onClick={() => navigate('/edit-user/' + row._id)}
            size="sm"
          >
            <Edit size={16} />
          </Button>
        </div>

      ),
      sortable: false,
    },

  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle> Users </CardTitle>
      </CardHeader>
      <CardBody>
        <CardBody>
          <Row className="mb-2">
            <Col>
              <Label>First Name</Label>
              <Input
                type="text"
                value={searchFirstName}
                onChange={handleFirstNameFilter}
                placeholder="Filter by first name"
              />
            </Col>
            <Col>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={searchLastName}
                onChange={handleLastNameFilter}
                placeholder="Filter by last name"
              />
            </Col>
            <Col>
              <Label>Email</Label>
              <Input
                type="text"
                value={searchEmail}
                onChange={handleEmailFilter}
                placeholder="Filter by email"
              />
            </Col>
            <Col>
              <Label>Role</Label>
              <Input
                type="text"
                value={searchRole}
                onChange={handleRoleFilter}
                placeholder="Filter by role"
              />
            </Col>

          </Row>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              columns={columns}
              data={filteredUsers}
              sortIcon={<ChevronDown size={10} />}
            />
          </div>
        </CardBody>
      </CardBody>
    </Card>
  )
}
