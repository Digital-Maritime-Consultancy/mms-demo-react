import React, { useState } from 'react';
import { Button, Alert, Container } from 'react-bootstrap';
import NotificationWindow from './NotificationWindow';

function NotificationManager() {
  const [show, setShow] = useState(true);

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }}>
        <Container>
            <NotificationWindow></NotificationWindow>
            <NotificationWindow></NotificationWindow>
            <NotificationWindow></NotificationWindow>
        </Container>
      
      {!show && <Button onClick={() => setShow(true)}>Show Notification</Button>}
    </div>
  );
}

export default NotificationManager;