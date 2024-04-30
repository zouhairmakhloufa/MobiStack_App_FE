import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, Row, Col, Label, Input } from 'reactstrap'
import '@styles/react/libs/editor/editor.scss'
import { EditorState, convertToRaw } from 'draft-js';
import axios from 'axios'
import { getUserData } from '../utility/Utils';
export default function AddQuestion() {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [name, setName] = useState("");
    const [type, setType] = useState("");





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


    const handleAddQuestion = () => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        console.log("rawContentState",rawContentState);
        let data = {
            name: name,
            type: type,
            user_id: getUserData().id,
            questionContent: rawContentState
        }
        axios.post('http://localhost:5000/api/question/add', data).then((res) => {
            console.log(res.data);
        })

    }


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Question</CardTitle>
                </CardHeader>
                <CardBody>


                    <Form>
                        <Row>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='nameVertical'>
                                    Question Name
                                </Label>
                                <Input onChange={(e) => setName(e.target.value)} type='text' name='name' id='nameVertical' placeholder='First Name' />
                            </Col>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='select-basic'>
                                    Question Type
                                </Label>
                                <Input onChange={(e) => setType(e.target.value)} type='select' name='select' id='select-basic'>
                                    <option value=''>Select Type</option>
                                    <option value='Web development'>Web development</option>
                                    <option value='Mobile development'>Mobile development</option>
                                    <option value='Devops'>Devops</option>

                                </Input>
                            </Col>


                            <Col sm='12' className='mb-3'>
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
                                <div className='d-flex '>
                                    <Button color='primary' onClick={handleAddQuestion}>
                                        Add Question
                                    </Button>

                                </div>
                            </Col>
                        </Row>
                    </Form>


                </CardBody>
            </Card>
        </div>
    )
}
