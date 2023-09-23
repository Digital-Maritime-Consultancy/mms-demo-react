import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./SubscriptionManager.css";

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
        {show && (
          <div
            className="show"
            style={{ position: "fixed", top: "48px", left: "48px", zIndex: 9999 }}
          >
            <div className="cards">
              <div className="top-area">
                <div className="right-buttons">
                  <div className="expand">
                    <div className="button-frame">
                      <div className="button" onClick={handleClose}>
                        <svg
                          className="leading-icon"
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 6.91L17.59 5.5L12 11.09L6.41 5.5L5 6.91L10.59 12.5L5 18.09L6.41 19.5L12 13.91L17.59 19.5L19 18.09L13.41 12.5L19 6.91Z"
                            fill="black"
                            fillOpacity="0.55"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-bottom"></div>
                <div className="card-label">

                  <svg
                    className="_15-pa-list"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12.9917V10.9933V11V12.9983V12.9917Z"
                      fill="#1A1A1A"
                    />
                    <path
                      d="M2.0198 8.99833V7H18.5L15 9L2.0198 8.99833Z"
                      fill="#1A1A1A"
                    />
                    <path d="M2 12.9983V11H9V13L2 12.9983Z" fill="#1A1A1A" />
                    <path d="M2 4.99833V3H19.8218V4.99833H2Z" fill="#1A1A1A" />
                    <path
                      d="M15.4901 16.75H16.2401L19.9901 19V8.5L16.2401 10.75H12.4901C11.6617 10.75 10.9901 11.4216 10.9901 12.25V15.25C10.9901 16.0784 11.6617 16.75 12.4901 16.75H13.2401V19.75H15.4901V16.75Z"
                      fill="#1A1A1A"
                    />
                  </svg>

                  <div className="title">Subscriptions</div>
                </div>
              </div>
              <div className="content-area">
                <div className="content-frame">
                  <Form>
                    {props.subscriptions.map((item, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        className="label"
                        label={item}
                        checked={checkedItems[index]}
                        onChange={() => handleCheckChange(index)}
                      />
                    ))}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
