import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import * as rw from 'the-react-way';

export default function EditForm(props: { handleCloseEditForm: () => void }) {
    let [formDataObj, updateFormData] = useState({});
    // const handleCloseEditForm = () => showEditForm(null);

    const handleSubmit = (e: any, data: any) => {
        e.preventDefault();
        const myFormData = new FormData(e.target);
        const formDataObj = Object.fromEntries(myFormData.entries());
        formDataObj.id = data.id;
        formDataObj.userId = data.userId;

        updateFormData(formDataObj);
        console.log(e, data, myFormData);
    }

    return <Modal show={true} onHide={props.handleCloseEditForm}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <rw.RWComponent
                component={
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <rw.RWComponent
                                component={<Form.Control name='title' type="text" placeholder="Enter title here..." />}
                                valueProps={{
                                    defaultValue: (post) => post.title
                                }} />
                            <Form.Text className="text-muted">
                                Any sample text with suggestions about the data to enter.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Body</Form.Label>
                            <rw.RWComponent
                                component={<Form.Control as="textarea" rows={3} name='body' type="text" placeholder="Post body goes here..." />}
                                valueProps={{
                                    defaultValue: (post) => post.body
                                }} />
                            <Form.Text className="text-muted">
                                Any sample text with suggestions about the data to enter.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <rw.RWComponent
                                component={<Form.Check type="checkbox" label="Check me out" />}
                                valueProps={{
                                    defaultChecked: (post) => post.id % 2 === 0
                                }} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                }
                callbackProps={{
                    onSubmit: handleSubmit
                }}
            />
            <rw.RWComponent
                component={<rw.RWPut endpoint='' initiateSignal={formDataObj || undefined} body={formDataObj} />}
                valueProps={{
                    endpoint: (post) => `https://jsonplaceholder.typicode.com/posts/${post.id}`
                }} />
        </Modal.Body>
        {/* 
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseEditForm}>
                Close
            </Button>
            <Button variant="primary" onClick={props.handleCloseEditForm}>
                Save Changes
            </Button>
        </Modal.Footer> */}
    </Modal>;
}