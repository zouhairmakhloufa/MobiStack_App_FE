import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Card, CardBody, Button, Row, Col, Input, Form } from 'reactstrap'
import '@styles/react/libs/editor/editor.scss'
import axios from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useParams } from 'react-router-dom'
import { getUserData } from '../utility/Utils';
import CardAction from '@components/card-actions'
import Comment from './Comment'

export default function QuestionDetail() {
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
            console.log(res.data);
        })

    }

    return (
        <div>
            <Row>
                <Col sm='12'>
                    <h1 className='section-label'>Question</h1>
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
                    <h3 className='section-label'>COMMENT</h3>
                    {comments && comments.map((value, idx) => (

                        <CardAction
                            title={value.name}
                            actions={['collapse']}

                            key={idx}
                        >

                            <CardBody>
                                <Comment comment={value.commentContent} />
                            </CardBody>
                        </CardAction>
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
                                            <Input onChange={(e) => setName(e.target.value)} placeholder='Name' />
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
