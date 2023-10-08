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
      <rw.RWGet endpoint='https://jsonplaceholder.typicode.com/posts' initiateSignal={initiateWith}>
        {isDivVisible && <div>Additional Division to show when there is an event from GET request</div>}
        <rw.RWEvent onProgress={() => {
          // alert('Retrieving posts...');
          showDiv(false);
        }} onCompleted={(data, index) => {
          // alert('Posts fetched successfully. - ' + data?.length);
          showDiv(true);
        }} />
        <rw.RWInProgress>The request is in progress</rw.RWInProgress>
        <rw.RWComplete>The request has been completed</rw.RWComplete>
        <rw.RWIterate>
          <div>
            <rw.RWCondition condition={(data, index) => {
              return index % 2 === 0;
            }}>
              <rw.RWIfTrue>Pratham -
                <rw.RWDataItem fieldname='title' /></rw.RWIfTrue>
              <rw.RWElse>Bharat -
                <rw.RWDataItem fieldname='userId' /></rw.RWElse>
            </rw.RWCondition>
            <rw.RWComponent
              component={<button><rw.RWDataItem select={(dataItem, index) => 'Click Me - ' + index} /></button>}
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
        </rw.RWIterate>

        <rw.RWData filter={(data, index) => data.userId === 1}>
          <PrintName name={name}></PrintName>
          <div>
            <rw.RWIterate>
              <div>
                <rw.RWDataItem select={(dataItem) => dataItem.title + ' - ' + dataItem.userId} />
              </div>
            </rw.RWIterate>
            <button onClick={() => { setName('HAHAHA!') }}>Update name</button>
          </div>
        </rw.RWData>
        {/* Timer sample */}
        <rw.RWTimer internal={2000}>
          <p><MyDate /></p>
        </rw.RWTimer>
        <rw.RWTimer internal={2000} until={(data, index) => index < 10}>
          <p>Timeout Counter: <rw.RWDataItem select={(data, index) => index} /></p>
        </rw.RWTimer>
      </rw.RWGet>

      <Modal show={Boolean(postId)} onHide={handleClose}>
        <rw.RWGet endpoint={`https://jsonplaceholder.typicode.com/posts/${postId}/comments`} initiateSignal>
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <rw.RWIterate>
              <p>EMAIL: <rw.RWDataItem fieldname='email' /></p>
              <p><rw.RWDataItem fieldname='body' /></p>
            </rw.RWIterate>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </rw.RWGet>
      </Modal>

      <rw.RWCondition condition={() => Boolean(editPost)}>
        <rw.RWIfTrue>
          <rw.RWData data={editPost}>
            <EditForm handleCloseEditForm={handleCloseEditForm} />
          </rw.RWData>
        </rw.RWIfTrue>
      </rw.RWCondition>
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
