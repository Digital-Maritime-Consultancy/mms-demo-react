import React, { useState } from "react";
import { Button, Alert, Container } from "react-bootstrap";
import { IApplicationMessage } from "../generated/mmtp";
import { payloadToHtmlElem } from "../util/PayloadHandler";
import { payloadToRC } from "../util/PayloadToRC";
import NotificationWindow from "./NotificationWindow";
import "./NotificationManager.css";

export interface NotificationManagerProp {
  multicastMessages: IApplicationMessage[];
  setMulticastMessages: (msgs: IApplicationMessage[]) => void;
}

export const NotificationManager = ({
  multicastMessages,
  setMulticastMessages,
}: NotificationManagerProp) => {
  var enc = new TextEncoder();

  return (
    <>
      {multicastMessages.length > 0 && (
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
                    onClick={() => setMulticastMessages([])}
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
              {multicastMessages.map((m, idx) => (
                <NotificationWindow
                  key={idx}
                  subject={
                    m.header?.subject !== undefined
                      ? m.header?.subject!
                      : m.header?.recipients?.recipients![0]!
                  }
                  content={payloadToRC(m.body!)!}
                  isMulticast={m.header?.subject !== undefined}
                ></NotificationWindow>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationManager;
