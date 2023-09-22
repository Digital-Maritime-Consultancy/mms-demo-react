import React, { useState } from "react";

export interface NotificationWindowProp {
    subject: string;
    content: JSX.Element;
}

export const NotificationWindow = ({
    subject,
    content,
}: NotificationWindowProp) => {
  const [show, setShow] = useState(true);

  return (
    <div hidden={!show}>
      <div className="type-app-notification-size-multi-line">
        <div className="container-content-notify">
          <div className="container-icon-notify">
            <div className="container-icon2-notify">
              <div className="app-button-notify">
                <div className="button-frame-notify">
                  <div className="button-notify">
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
          <div className="container-message-notify">
            <div className="container-title-notify">
              <div className="text-time-notify">{subject}</div>
            </div>
            <div className="container-text-notify">
              <div className="text-message-notify">
                {content}
              </div>
            </div>
          </div>
        </div>
        <div className="frame-2017-notify">
          <div className="button-ack-notify">
            <div className="button2-notify" onClick={() => setShow(false)}>
              <div className="content-notify">
                <div className="textbox-notify">
                  <div className="label-notify">Dismiss</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationWindow;
