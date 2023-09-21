import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export const IncomingWindows = () => {
  const [text, setText] = useState('');
  const [strings, setStrings] = useState<string[]>([]);

  const addString = (str: string) => {
    setStrings([...strings, str]);
    setText(''); // reset textarea
  };

  return <>
        <div className="form-control h-75" id="incomingArea" style={{overflow: "auto"}} >
            <ul>
                {strings.map((str, index) => (
                <li key={index}>{str}</li>
                ))}
            </ul>
        </div>
        <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter text</Form.Label>
            <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={() => addString(text)}>
            Add String
            </Button>
        </Form>
    </>
}