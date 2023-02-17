import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Form, Row, Table } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../CommanPage/TextValidator';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import useSession from 'react-session-hook';
// const ntools = require('nodetools');

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const EditEmailTemplate = (props) => {

    const session = useSession();
    const { register, handleSubmit, errors } = useForm();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState(EditorState.createEmpty());
    const [id, setId] = useState("");
    const [token] = useState(session.token);
    const [issubmit, setIsubmit] = useState(false);

    const onSumbit = async e => {
        setIsubmit(true);
        let postJson = {
            title: title,
            slug: slug,
            content: draftToHtml(convertToRaw(content.getCurrentContent()))
        };
        console.log(postJson);
        let path = apiUrl.updateEmailTemplate + '/' + `${id}`;
        const fr = await Helper.put(postJson, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setIsubmit(false);
                props.history.push('/email-templates');
                Toast.fire({
                    type: "success",
                    title: res.msg,
                })

            } else {
                Toast.fire({
                    type: "error",
                    title: res.msg,
                });
                setIsubmit(false);
            }
        } else {
            Toast.fire({
                type: "error",
                title: res.error,
            });
            setIsubmit(false);
        }
    }
    useEffect(() => {
        updateData();
    }, []);

    const updateData = () => {
        if (props.location.state != undefined) {
            const stateObj = props.location.state;
            console.log(stateObj);
            if (props.location.state != undefined) {
                setTitle(stateObj.title);
                setSlug(stateObj.slug);
                setId(stateObj.id);
                const contentBlock = htmlToDraft(stateObj.content);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    console.log(editorState);
                    setContent(editorState);
                }
            }
        } else {
            props.history.push('/email-templates');
        }
    }
    const onEditorStateChange = async (editorState) => {
        setContent(editorState);
    };
    return (
        <React.Fragment>
            <ValidatorForm onSubmit={onSumbit}>
                <Card>
                    <CardHeader>
                        <CardTitle><h4>Edit Email Template</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>Title</Label>
                                    <TextValidator type="text" name="title" className="form-control" placeholder="Page Title"
                                        onChange={(e) => { setTitle(e.target.value) }}
                                        value={title}
                                        validators={['required']}
                                        errorMessages={['This field is required']} />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>Page Content</Label>
                                    <Editor
                                        editorState={content}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                        onEditorStateChange={onEditorStateChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" color="primary">Submit {issubmit === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>}</Button>
                    </CardFooter>
                </Card>
            </ValidatorForm>
        </React.Fragment>
    );
}

export default EditEmailTemplate;
