import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export interface SubscriptionManagerProps {
  subscriptions: string[];
  subscribeMessage: (ps: string) => void;
  unsubscribeMessage: (ps: string) => void;
}

export const SubscriptionManager = forwardRef(
  (props: SubscriptionManagerProps, ref) => {
    const [show, setShow] = useState(false);
    const [checkedItems, setCheckedItems] = useState(
      new Array(props.subscriptions.length).fill(false)
    );

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useImperativeHandle(ref, () => ({
      openModal: () => handleShow(),
    }));

    const handleCheckChange = (position: number) => {
      let updatedCheckedItems = [...checkedItems];
      updatedCheckedItems[position] = !updatedCheckedItems[position];
      if (updatedCheckedItems[position] === true) {
        props.subscribeMessage(props.subscriptions[position]);
      } else {
        props.unsubscribeMessage(props.subscriptions[position]);
      }
      setCheckedItems(updatedCheckedItems);
    };

    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Subscription Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {props.subscriptions.map((item, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={item}
                  checked={checkedItems[index]}
                  onChange={() => handleCheckChange(index)}
                />
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
);
