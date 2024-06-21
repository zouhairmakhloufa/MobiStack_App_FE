import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Input,
  Row,
  Col,
  Button,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { Check, ChevronDown, Trash } from 'react-feather';
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"
import Swal from 'sweetalert2'; // Pour la confirmation avant suppression
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { getUserData } from '../utility/Utils';

export default function TableQuestion() {

  const user = getUserData()

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuestionName, setSearchQuestionName] = useState('');
  const [searchUserName, setSearchUserName] = useState('');
  const [searchQuestionType, setSearchQuestionType] = useState('');

  useEffect(() => {
    getAllQuestion()
  }, [])

  const getAllQuestion = () => {
    axios.get('http://localhost:5000/api/question/getWithCommentCount')
      .then((res) => {
        if (user.role === "admin") {
          setQuestions(res.data.data);
          setFilteredQuestions(res.data.data);
        } else {
          console.log(user);
          let newQuestion = []
          for (let i = 0; i < res.data.data.length; i++) {
            console.log(res.data.data[i].user_id._id);

            if (res.data.data[i].user_id._id === user.id) {
              newQuestion.push(res.data.data[i])
            }

          }
          setQuestions(newQuestion);
          setFilteredQuestions(newQuestion);

        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }


  const confirmDelete = (questionId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteQuestion(questionId); // Call deletion function
      }
    });
  };

  const deleteQuestion = (questionId) => {
    axios
      .delete(`http://localhost:5000/api/question/delete/${questionId}`) // Adjust endpoint
      .then(() => {
        const updatedQuestions = questions.filter((q) => q._id !== questionId);
        setQuestions(updatedQuestions);
        setFilteredQuestions(updatedQuestions);
      })
      .catch((error) => {
        console.error('Error deleting question:', error);
      });
  };
  // Handle filter changes
  const handleQuestionNameFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuestionName(value);

    setFilteredQuestions(
      questions.filter((question) =>
        question.name.toLowerCase().includes(value)
      )
    );
  };
  const handleQuestionTypeFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuestionType(value);

    setFilteredQuestions(
      questions.filter((question) =>
        question.type.toLowerCase().includes(value)
      )
    );
  };

  const handleUserNameFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchUserName(value);

    setFilteredQuestions(
      questions.filter(
        (question) =>
          `${question.user_id.firstName.toLowerCase()} ${question.user_id.lastName.toLowerCase()}`.includes(
            value
          )
      )
    );
  };





  const columns = [
    { name: 'Question Name', selector: (row) => row.name, sortable: true },
    { name: 'Question Type', selector: (row) => row.type, sortable: true },
    { name: 'Created At', selector: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    {
      name: 'User',
      selector: (row) => `${row.user_id.firstName} ${row.user_id.lastName}`,
      sortable: true,
    },
    {
      name: 'Trusted Replied',
      selector: (row) => (
        <Fragment>
          <div className='h-100 d-flex justify-content-center align-items-center'>
            <div className={`avatar p-50 m-0 mb-1 ${row.hasTrustedComment ? `bg-light-success` : "bg-light-secondary"
              }`} >
              <Check size={18} />
            </div>
          </div>
        </Fragment>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => (
        <Button
          className="btn btn-outline-danger"
          color="light"
          onClick={() => confirmDelete(row._id)}
          size="sm"
        >
          <Trash size={16} />
        </Button>
      ),
      sortable: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Questions </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="mb-2">
          <Col>
            <Label>Filtre par Nom de Question</Label>
            <Input
              type="text"
              value={searchQuestionName}
              onChange={handleQuestionNameFilter}
              placeholder="Saisissez le nom de la question"
            />
          </Col>
          <Col>
            <Label>Filtre par Nom de l'Utilisateur</Label>
            <Input
              type="text"
              value={searchUserName}
              onChange={handleUserNameFilter}
              placeholder="Saisissez le nom de l'utilisateur"
            />
          </Col>
          <Col>
            <Label>Filtre par Type de Question</Label>
            <Input
              type="text"
              value={searchQuestionType}
              onChange={handleQuestionTypeFilter}
              placeholder="Saisissez le type de question"
            />
          </Col>
        </Row>
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            columns={columns}
            data={filteredQuestions}
            sortIcon={<ChevronDown size={10} />}
          />
        </div>
      </CardBody>
    </Card>
  )
}
