import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as rw from 'the-react-way';
import EditForm from './EditForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  let [name, setName] = useState('');
  let [isDivVisible, showDiv] = useState(true);
  let [initiateWith, refresh] = useState(false);
  let [postId, showComment] = useState(0);
  let [editPost, showEditForm] = useState(null);

  const handleClose = () => { showComment(0) };
  const handleCloseEditForm = () => showEditForm(null);

  return (
    <div className="App">
      <button onClick={() => { refresh(!initiateWith); }}>Refresh</button>
      <rw.HttpGet endpoint='https://jsonplaceholder.typicode.com/posts' initiateSignal={initiateWith}>
        {isDivVisible && <div>Additional Division to show when there is an event from GET request</div>}
        <rw.RWEvent onProgress={() => {
          // alert('Retrieving posts...');
          showDiv(false);
        }} onCompleted={(data, index) => {
          // alert('Posts fetched successfully. - ' + data?.length);
          showDiv(true);
        }} />
        <rw.InProgress>The request is in progress</rw.InProgress>
        <rw.Complete>The request has been completed</rw.Complete>
        <rw.Iterate>
          <div>
            <rw.Condition condition={(data, index) => {
              return index % 2 === 0;
            }}>
              <rw.IfTrue>Pratham -
                <rw.Text fieldname='title' /></rw.IfTrue>
              <rw.Else>Bharat -
                <rw.Text fieldname='userId' /></rw.Else>
            </rw.Condition>
            <rw.RWComponent
              component={<button><rw.Text select={(dataItem, index) => 'Click Me - ' + index} /></button>}
              callbackProps={{
                onClick: (e: any, data: any, index: number) => {
                  // alert('You clicked a button. Data item index: ' + index);
                  showComment(data.id);
                }
              }} />
            <rw.RWComponent
              component={<button>Edit</button>}
              callbackProps={{
                onClick: (e: any, data: any, index: number) => {
                  // alert('You clicked a button. Data item index: ' + index);
                  showEditForm(data);
                }
              }} />
          </div>
        </rw.Iterate>

        <rw.RWDataContext filter={(data, index) => data.userId === 1}>
          <PrintName name={name}></PrintName>
          <div>
            <rw.Iterate>
              <div>
                <rw.Text select={(dataItem) => dataItem.title + ' - ' + dataItem.userId} />
              </div>
            </rw.Iterate>
            <button onClick={() => { setName('HAHAHA!') }}>Update name</button>
          </div>
        </rw.RWDataContext>
        {/* Timer sample */}
        <rw.Timer internal={2000}>
          <p><MyDate /></p>
        </rw.Timer>
        <rw.Timer internal={2000} until={(data, index) => index < 10}>
          <p>Timeout Counter: <rw.Text select={(data, index) => index} /></p>
        </rw.Timer>
      </rw.HttpGet>

      <Modal show={Boolean(postId)} onHide={handleClose}>
        <rw.HttpGet endpoint={`https://jsonplaceholder.typicode.com/posts/${postId}/comments`} initiateSignal>
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <rw.Iterate>
              <p>EMAIL: <rw.Text fieldname='email' /></p>
              <p><rw.Text fieldname='body' /></p>
            </rw.Iterate>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </rw.HttpGet>
      </Modal>

      <rw.Condition condition={() => Boolean(editPost)}>
        <rw.IfTrue>
          <rw.RWDataContext data={editPost}>
            <EditForm handleCloseEditForm={handleCloseEditForm} />
          </rw.RWDataContext>
        </rw.IfTrue>
      </rw.Condition>
    </div>
  );
}

function PrintName(props: { name: string }) {
  return <span>{props.name}</span>;
}

function MyDate() {
  return <>{new Date().toString()}</>;
}

export default App;
