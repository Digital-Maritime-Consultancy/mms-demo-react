import React from 'react';
import './App.css';
import { Map } from './components/Map';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="h-100 d-inline-block side-panel-minimized d-flex flex-column">
      <Row className="topbar">
        <Col xs={3}>
            <div className="title-area">
              <div className="menu-button">
                <div className="button-frame">
                  <img width="45" height="32" src="https://maritimeconnectivity.net/wp-content/uploads/2021/06/cropped-MCP-Logo-1.png" alt="" decoding="async" data-variant="logo"  />
                </div>
              </div>
              <div className="titles">
                <div className="app">
                  <div className="app-title">MCP Consortium</div>
                </div>
                <div className="section-title">IALA MMS Demo 2023</div>
              </div>
            </div>
          </Col>
        <Col md="auto">
        
        </Col>
      </Row>
      <Row className="flex-grow-1">
        <Col xs={1} className="side-card-panel">
        <div className="container-content">
          <div className="container-cards">
            <div className="tab">
              <div className="button-frame">
                <div className="button">
                  <svg
                    className="leading-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.61214 10.516L10.516 1.61214C11.3322 0.795953 12.6678 0.795953 13.484 1.61214L22.3879 10.516C23.204 11.3322 23.204 12.6678 22.3879 13.484L13.484 22.3879C12.6678 23.204 11.3322 23.204 10.516 22.3879L1.61214 13.484C0.795953 12.6678 0.795953 11.3322 1.61214 10.516ZM12 3L3 12L12 21L21 12L12 3Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Label</div>
              </div>
            </div>
            <div className="dividers"></div>
            <div className="tab">
              <div className="button-frame">
                <div className="button">
                  <svg
                    className="leading-icon2"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.61214 10.516L10.516 1.61214C11.3322 0.795953 12.6678 0.795953 13.484 1.61214L22.3879 10.516C23.204 11.3322 23.204 12.6678 22.3879 13.484L13.484 22.3879C12.6678 23.204 11.3322 23.204 10.516 22.3879L1.61214 13.484C0.795953 12.6678 0.795953 11.3322 1.61214 10.516ZM12 3L3 12L12 21L21 12L12 3Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Label</div>
              </div>
            </div>
            <div className="dividers"></div>
            <div className="tab">
              <div className="button-frame">
                <div className="button">
                  <svg
                    className="leading-icon3"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.61214 10.516L10.516 1.61214C11.3322 0.795953 12.6678 0.795953 13.484 1.61214L22.3879 10.516C23.204 11.3322 23.204 12.6678 22.3879 13.484L13.484 22.3879C12.6678 23.204 11.3322 23.204 10.516 22.3879L1.61214 13.484C0.795953 12.6678 0.795953 11.3322 1.61214 10.516ZM12 3L3 12L12 21L21 12L12 3Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Label</div>
              </div>
            </div>
            <div className="tab">
              <div className="button-frame">
                <div className="button2">
                  <svg
                    className="leading-icon4"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.61214 10.516L10.516 1.61214C11.3322 0.795953 12.6678 0.795953 13.484 1.61214L22.3879 10.516C23.204 11.3322 23.204 12.6678 22.3879 13.484L13.484 22.3879C12.6678 23.204 11.3322 23.204 10.516 22.3879L1.61214 13.484C0.795953 12.6678 0.795953 11.3322 1.61214 10.516ZM12 3L3 12L12 21L21 12L12 3Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Label</div>
              </div>
            </div>
            <div className="tab">
              <div className="button-frame">
                <div className="button">
                  <svg
                    className="leading-icon5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.61214 10.516L10.516 1.61214C11.3322 0.795953 12.6678 0.795953 13.484 1.61214L22.3879 10.516C23.204 11.3322 23.204 12.6678 22.3879 13.484L13.484 22.3879C12.6678 23.204 11.3322 23.204 10.516 22.3879L1.61214 13.484C0.795953 12.6678 0.795953 11.3322 1.61214 10.516ZM12 3L3 12L12 21L21 12L12 3Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Label</div>
              </div>
            </div>
          </div>
          <div className="panel-controls">
            <div className="button-expand">
              <div className="button-frame">
                <div className="button3">
                  <svg
                    className="leading-icon6"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59L13.1698 12L8.58984 7.41Z"
                      fill="black"
                      fillOpacity="0.55"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Col>
        <Col style={{ backgroundColor: '#f819fa' }} className="p-0">
          <Map></Map>
          
        </Col>
      </Row>
    </Container>
    
  );
}

export default App;
