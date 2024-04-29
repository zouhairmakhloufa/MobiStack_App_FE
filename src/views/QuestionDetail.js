import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'
import '@styles/react/libs/editor/editor.scss'
import axios from 'axios'
import { EditorState, convertFromRaw } from 'draft-js';
import { useParams } from 'react-router-dom'

export default function QuestionDetail() {
    const [question, setQuestion] = useState({})
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const params=useParams()

    useEffect(() => {
        getQuestionById()


    }, [])

    const getQuestionById = () => {
        axios.get('http://localhost:5000/api/question/getById/'+params.id)
            .then((res) => {
                setQuestion(res.data.data);
                // Convert question content to EditorState
                const contentState = convertFromRaw(res.data.data.questionContent);
                const newEditorState = EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
            })
            .catch((error) => {
                console.error('Error fetching question:', error);
            });
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>{question.name} </CardTitle>
                </CardHeader>
                <CardBody>
                    <Editor
                        editorState={editorState}
                        readOnly={true}
                        toolbarHidden={true}
                    />

                </CardBody>
            </Card>
        </div>
    )
}
