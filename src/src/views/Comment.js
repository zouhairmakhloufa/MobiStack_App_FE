import React, { useEffect, useState } from 'react'
import { Editor } from 'draft-js'
import { EditorState, convertFromRaw } from 'draft-js';
import '@styles/react/libs/editor/editor.scss'
import decorator from './Decorator'; // Import your custom decorator

export default function Comment({ comment }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if (comment?.blocks && comment?.entityMap !== undefined) {
            const contentState = convertFromRaw(comment);
            const newEditorState = EditorState.createWithContent(contentState,decorator);
            setEditorState(newEditorState);
        } 
    }, [comment]);

    return (
        <Editor
            editorState={editorState}
            readOnly={true}
            toolbarHidden={true}
        />
    )
}
