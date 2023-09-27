import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Alert, Container } from "react-bootstrap";
import { IApplicationMessage } from "../generated/mmtp";
import { payloadToHtmlElem } from "../util/PayloadHandler";
import { payloadToRC } from "../util/PayloadToRC";
import { Subscription } from "./BrowserAgent";
import ReceivedMessage from "./ReceivedMessage";
import "./ReceiveManager.css";

export interface ReceiveManagerProp {
  messages: IApplicationMessage[];
  subscriptions: Subscription[];
  setMessages: Dispatch<SetStateAction<IApplicationMessage[]>>;
  reply: (mrn: string) => void;
}

export const ReceiveManager = ({
  messages,
  subscriptions,
  setMessages,
  reply,
}: ReceiveManagerProp) => {
  var enc = new TextEncoder();

  return (
    <>
      {messages.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 48,
            right: 0,
            zIndex: 9997,
            maxHeight: "90vh",
          }}
        >
          <div className="style-regular-expanded-true">
            <div className="container-content-title">
              <div className="container-brilliance-title">
                <div className="title-title">
                  <div className="title2-title">Received messages</div>
                </div>
              </div>
              <div className="container-ack-title">
                <div className="button-ack-title">
                  <div
                    className="button-title"
                    onClick={() => setMessages([])}
                  >
                    <div className="content-title">
                      <div className="textbox-title">
                        <div className="label-title">Remove all</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-wrapper">
              {messages.map((m, idx) => (
                <ReceivedMessage
                  key={idx}
                  subscriptions={subscriptions}
                  message={m}
                  setMessages={setMessages}
                  reply={reply}
                ></ReceivedMessage>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiveManager;
