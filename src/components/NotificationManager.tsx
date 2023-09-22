import React, { useState } from 'react';
import { Button, Alert, Container } from 'react-bootstrap';
import { IApplicationMessage } from '../generated/mmtp';
import { payloadToHtmlElem } from '../util/PayloadHandler';
import { payloadToRC } from '../util/PayloadToRC';
import NotificationWindow from './NotificationWindow';

export interface NotificationManagerProp {
  multicastMessages: IApplicationMessage[];
}

export const NotificationManager = ({
  multicastMessages
}: NotificationManagerProp) => {
  const [show, setShow] = useState(true);
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }}>
        <Container >
          {
            multicastMessages.map((m, idx) => <NotificationWindow key={idx} subject={m.header?.subject!} content={payloadToRC(m.body!)!}></NotificationWindow>)
          }
        </Container>
      
      {!show && <Button onClick={() => setShow(true)}>Show Notification</Button>}
    </div>
  );
}

export default NotificationManager;