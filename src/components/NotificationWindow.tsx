import React, { Dispatch, forwardRef, SetStateAction, useImperativeHandle, useState } from "react";
import { IApplicationMessage } from "../generated/mmtp";
import { payloadToRC } from "../util/PayloadToRC";

export interface NotificationWindowProp {
    message: IApplicationMessage;
    setMessages: Dispatch<SetStateAction<IApplicationMessage[]>>;
    reply: (mrn: string) => void;
}

export const NotificationWindow = forwardRef(
    (props: NotificationWindowProp, ref) => {
  const [show, setShow] = useState(true);

  const deleteOne = () => 
    props.setMessages(prevMessages => prevMessages.filter((msg) => msg !== props.message));
  
  return (
    <div className="notification-list-item" hidden={!show}>
      <div className="frame-2016">
        <div className="container-icon-notify">
          <div className="container-icon2-notify">
            <div className="app-button-notify">
              <div className="button-frame-notify">
                <div className="button-notify">
                  {!(props.message.header?.recipients) ? (
                    <svg
                      className="_15-pa"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 10.5V12.5H22V10.5H18ZM16 17.11C16.96 17.82 18.21 18.76 19.2 19.5C19.6 18.97 20 18.43 20.4 17.9C19.41 17.16 18.16 16.22 17.2 15.5C16.8 16.04 16.4 16.58 16 17.11ZM20.4 5.1C20 4.57 19.6 4.03 19.2 3.5C18.21 4.24 16.96 5.18 16 5.9C16.4 6.43 16.8 6.97 17.2 7.5C18.16 6.78 19.41 5.85 20.4 5.1ZM4 8C2.9 8 2 8.9 2 10L2 12.84C2 13.94 2.9 14.84 4 14.84H4.5V18.84H7.5V14.84H8L13 18.5V4.5L8 8H4ZM15.5 11.5C15.5 10.17 14.92 8.97 14 8.15V14.84C14.92 14.03 15.5 12.83 15.5 11.5Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="_15-contacts"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 3H2C0.9 3 0 3.9 0 5V19C0 20.1 0.9 21 2 21H22C23.1 21 23.99 20.1 23.99 19L24 5C24 3.9 23.1 3 22 3ZM8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6ZM14 18H2V17C2 15 6 13.9 8 13.9C10 13.9 14 15 14 17V18ZM17.85 14H19.49L21 16L19.01 17.99C17.7 17.01 16.73 15.61 16.28 14C16.1 13.36 16 12.69 16 12C16 11.31 16.1 10.64 16.28 10C16.73 8.38 17.7 6.99 19.01 6.01L21 8L19.49 10H17.85C17.63 10.63 17.5 11.3 17.5 12C17.5 12.7 17.63 13.37 17.85 14Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="icon2-notify">
              <svg
                className="icon3-notify"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33335 1.66666C2.41288 1.66666 1.66669 2.41286 1.66669 3.33333V13.3333C1.66669 14.2538 2.41288 15 3.33335 15H6.66669L10 18.3333L13.3334 15H16.6667C17.5872 15 18.3334 14.2538 18.3334 13.3333V3.33333C18.3334 2.41286 17.5872 1.66666 16.6667 1.66666H3.33335Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="frame-1824">
          <div className="frame-1822">
            <div className="text-time">{!props.message.header?.recipients
      ? props.message.header?.subject!
      : props.message.header?.sender!}</div>
            <div className="text-time2">
              {!(props.message.header?.recipients) ? "multicast" : "direct"}
            </div>
          </div>
          <div className="frame-1825">
            <div className="text-message">{payloadToRC(props.message.body!)!}</div>
          </div>
        </div>
      </div>
      <div className="container-actions">
        {(props.message.header?.recipients) && (
          <div className="container-ack2">
            <div className="button-ack-bottom">
              <div className="button-bottom" onClick={() => props.reply(props.message.header?.sender!)}>
                <div className="content-bottom">
                  <div className="textbox-bottom">
                    <div className="label-bottom">Reply</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container-ack2">
          <div className="button-ack-bottom">
            <div className="button-bottom" onClick={() => deleteOne()}>
              <div className="content-bottom">
                <div className="textbox-bottom">
                  <div className="label-bottom">Dismiss</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NotificationWindow;
