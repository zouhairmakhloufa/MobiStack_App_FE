import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Card, CardHeader, CardTitle, CardBody, Button, Row, Col, Input, Label, Form } from 'reactstrap'
import '@styles/react/libs/editor/editor.scss'
import axios from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useParams } from 'react-router-dom'
import { getUserData } from '../utility/Utils';
import CardAction from '@components/card-actions'
import Comment from './Comment'
import { Check, Trash } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function QuestionDetail() {
    const user = getUserData()

    const [question, setQuestion] = useState({})
    const [comments, setComments] = useState([]);

    const [name, setName] = useState('')
    const [editorRead, setEditorRead] = useState(EditorState.createEmpty());
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const params = useParams()

    useEffect(() => {
        getQuestionById()
    }, [])

    const getQuestionById = () => {
        axios.get('http://localhost:5000/api/question/getById/' + params.id)
            .then((res) => {
                setQuestion(res.data.questions);
                setComments(res.data.comments);
                // Convert question content to EditorState
                if (res.data.questions.questionContent.blocks && res.data.questions.questionContent.entityMap !== undefined) {
                    const contentState = convertFromRaw(res.data.questions.questionContent);
                    const newEditorState = EditorState.createWithContent(contentState);
                    setEditorRead(newEditorState);
                }

            })
            .catch((error) => {
                console.error('Error fetching question:', error);
            });
    };

    const handleEditorChange = (state) => {
        setEditorState(state);
    };


    const uploadCallback = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const dataURL = reader.result;
                resolve({ data: { link: dataURL } });
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleAddComment = () => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        let data = {
            name: name,
            user_id: getUserData().id,
            commentContent: rawContentState,
            question_id: params.id
        }
        axios.post('http://localhost:5000/api/comment/add', data).then((res) => {
            getQuestionById()
            setName('');
            setEditorState(EditorState.createEmpty());
        })

    }
    const trustedComment = (comment) => {
        console.log("..........", comment);
        if (comment.user_id._id === user.id) {
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you trust this comment or not?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, I trust it!',
                cancelButtonText: 'No, I don\'t trust it',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.isConfirmed) {
                    comment.trusted = true
                    axios.put('http://localhost:5000/api/comment/update', comment).then((res) => {
                        console.log(res.data);
                    })
                    MySwal.fire({
                        icon: 'success',
                        title: 'Comment Trusted',
                        text: 'You have marked this comment as trusted.',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                } else if (result.dismiss === MySwal.DismissReason.cancel) {
                    MySwal.fire({
                        title: 'Cancelled',
                        text: 'You have marked this comment as not trusted.',
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                }
            })
        }




    }

    const handleDeleteComment = (commentId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:5000/api/comment/delete/${commentId}`)
                    .then(() => {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'The comment has been deleted.',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                        getQuestionById();  // Refresh comments after deletion
                    })
                    .catch((error) => {
                        console.error('Error deleting comment:', error);
                    });
            }
        });
    };

    return (
        <div>
            <Row>
                <Col sm='12'>
                    <h6 className='section-label'>Question</h6>
                    <CardAction
                        title={question.name}
                        actions={['collapse']}
                        endReload={endLoading => {
                            setTimeout(() => endLoading(), 2000)
                        }}
                    >

                        <CardBody>
                            <Editor
                                editorState={editorRead}
                                readOnly={true}
                                toolbarHidden={true}
                            />





                        </CardBody>
                    </CardAction>

                </Col>

                <Col sm='12'>
                    <h6 className='section-label'>COMMENT</h6>
                    {comments && comments.map((value, idx) => (

                        <Row>
                            <Col sm='1'>
                                <div className='h-100 d-flex justify-content-center align-items-center'>
                                    <div className={`avatar p-50 m-0 mb-1 ${value?.trusted ? `bg-light-success` : "bg-light-secondary"
                                        }`} >
                                        <Check size={28} onClick={() => trustedComment(value)} />
                                    </div>
                                </div>
                            </Col>

                            <Col sm={`${user.role === "admin" ? '10' : '11'}`}>
                                <CardAction
                                    title={value.name}
                                    actions={['collapse']}
                                    key={idx}
                                >

                                    <CardBody>
                                        <Comment comment={value.commentContent} />
                                    </CardBody>
                                </CardAction>
                            </Col>
                            {
                                user.role === "admin" ? <Col sm='1'>
                                    <div className='h-100 d-flex justify-content-center align-items-center'>

                                        <Button color='danger' onClick={() => handleDeleteComment(value._id)}>
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </Col> : null
                            }


                        </Row>

                    ))}


                </Col>

                <Col sm='12'>
                    <h6 className='section-label'>Leave a Comment</h6>
                    <Card>
                        <CardBody>
                            <Form className='form' onSubmit={e => e.preventDefault()}>
                                <Row>
                                    <Col sm='12'>
                                        <div className='mb-2'>
                                            <Input onChange={(e) => setName(e.target.value)} value={name} placeholder='Name' />
                                        </div>
                                    </Col>
                                    <Col sm='12'>
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={handleEditorChange}
                                            toolbar={{
                                                image: {
                                                    urlEnabled: true,
                                                    uploadEnabled: true,
                                                    alignmentEnabled: true,
                                                    uploadCallback: uploadCallback,
                                                    previewImage: false,
                                                    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                                    alt: { present: false, mandatory: false },
                                                    defaultSize: { height: 'auto', width: 'auto' },
                                                },
                                            }}
                                        />
                                    </Col>

                                    <Col sm='12'>
                                        <Button onClick={handleAddComment} color='primary'>Post Comment</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
