import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';

function NotificationWindow() {
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
                className="leading-icon-notify"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.00233 1H15.0023V4H18.0023C19.1023 4 20.0023 4.9 20.0023 6V10.62L21.2823 11.04C21.5423 11.12 21.7623 11.3 21.8823 11.54C22.0023 11.78 22.0223 12.06 21.9423 12.32L20.0523 19H20.0023C18.4023 19 16.9823 18.12 16.0023 17C15.0223 18.12 13.6023 19 12.0023 19C10.4023 19 8.98233 18.12 8.00233 17C7.02233 18.12 5.60233 19 4.00233 19H3.95233L2.05233 12.32C1.96233 12.06 1.99233 11.78 2.11233 11.54C2.23233 11.3 2.45233 11.12 2.71233 11.04L4.00233 10.62V6C4.00233 4.9 4.90233 4 6.00233 4H9.00233V1ZM13.0024 4V3H11.0024V4H13.0024ZM17.3823 11.88L12.0023 10.11L6.62225 11.86L4.22225 12.65L5.00107 16C5.56357 16 6.32761 15.8278 6.81747 15.5078L8.00233 14.5L9.41123 15.8008C9.87998 16.1758 10.7923 17 12.0023 17C13.2123 17 14.1222 16.0625 14.6222 15.7109L16.0024 14.5L17.0266 15.2723C17.6771 15.7399 18.4212 16 19.0011 16L19.7723 12.66L17.3823 11.88ZM6.00239 6V9.97L12.0024 8L18.0024 9.97V6H6.00239Z"
                  fill="black"
                  fillOpacity="0.55"
                />
                <path
                  d="M12.0024 20.96C13.3924 20.96 14.7824 20.53 16.0024 19.68C17.2224 20.53 18.6124 21 20.0024 21H22.0024V23H20.0024C18.6224 23 17.2624 22.66 16.0024 22.01C14.7424 22.66 13.3724 22.98 12.0024 22.98C10.6324 22.98 9.26239 22.65 8.00239 22.01C6.74239 22.65 5.38239 23 4.00239 23H2.00239V21H4.00239C5.39239 21 6.78239 20.53 8.00239 19.68C9.22239 20.53 10.6124 20.96 12.0024 20.96Z"
                  fill="black"
                  fillOpacity="0.55"
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
        <div className="text-time-notify">Subject: Weather</div>
      </div>
      <div className="container-text-notify">
        <div className="text-message-notify">
        Contrary to popular belief, Lorem Ipsum 
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