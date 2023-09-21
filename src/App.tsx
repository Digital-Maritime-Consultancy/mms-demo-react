import React, { useState } from 'react';
import './App.css';
import { Map } from './components/map/Map';
import { Container, Row, Col } from 'react-bootstrap';
import { ConnectModal } from './components/modal/ConnectModal';
import { ChatModal } from './components/modal/ChatModal';
import NotificationManager from './components/NotificationManager';
import { Connect, IApplicationMessage, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType, Subscribe } from './generated/mmtp';
import {v4 as uuidv4} from "uuid";

function App() {

  const positions = [
    [55.861712, 18.327088],
    [47.868875, -12.742407],
    [35.241517, 18.312502],
    [7.850053, 63.290722],
    [7.850053, 89.457135],
    [-17.129407, 53.791924],
    [-35.066228, 29.910334],
    [-4.066803, 5.974220],
    [-14.038273, -37.348317],
    [13.339791, -77.486885],
    [4.312337, -85.805490],
    [25.436071, -90.126157],
    [40.907583, -65.084172],
    [60.061709, -39.815700],
    [59.123792, -56.849503],
    [59.694008, -85.866946],
    [57.705063, -145.278025],
    [-35.769383, 129.381788],
    [-17.165930, 152.207484],
    [6.822055, 134.232301],
    [35.381628, 123.633018],
    [35.719810, 130.123741],
    [18.278910, 64.846807],
    [15.058621, 114.025606],
    [-2.560821, 95.633267],
    [42.699235, 15.595237],
    [40.952470, 11.251319],
    [33.692219, 30.861006],
    [21.229574, 38.013682],
    [61.788313, 19.807018],
    [77.221531, 11.867044],
    [-74.513058, -42.201186],
    [56.366564, 11.620382],
    [59.952401, 3.395286],
  ];

  const mrnStoreUrl = "http://20.91.195.244";
  const [ownMrn, setOwnMrn] = useState("");
  const [lastSentMessage, setLastSentMessage] = useState<MmtpMessage>();
  const [reconnectToken, setReconnectToken] = useState("");
  const [ws, setWs] = useState<WebSocket>();
  const fileBytesArray = new TextEncoder().encode("FILE"); // The bytes of the word "FILE"

  const arraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
  }
  const createConnection = (edgeRouter: string, ownMrn: string): boolean => {

    const ws = new WebSocket(edgeRouter);

    setWs(ws);

    ws.addEventListener("open", () => {
        let initialized = false;

        ws.onmessage = async (msgEvent) => {
            console.log("Message received:", msgEvent.data);
            const data = msgEvent.data as Blob;
            const bytes = await data.arrayBuffer();
            const response = MmtpMessage.decode(new Uint8Array(bytes));
            console.log(response);

            if (lastSentMessage && response.responseMessage?.responseToUuid !== lastSentMessage!.uuid) {
                alert("The UUID of the last sent message does not match the UUID being responded to");
            }
            if (!initialized) {
                // do something
                setReconnectToken(response!.responseMessage!.reconnectToken!);

                const subMsg = MmtpMessage.create({
                    msgType: MsgType.PROTOCOL_MESSAGE,
                    uuid: uuidv4(),
                    protocolMessage: ProtocolMessage.create({
                        protocolMsgType: ProtocolMessageType.SUBSCRIBE_MESSAGE,
                        subscribeMessage: Subscribe.create({
                            directMessages: true
                        })
                    })
                });
                msgBlob = MmtpMessage.encode(subMsg).finish();

                setLastSentMessage!(subMsg);
                initialized = true;

                ws.send(msgBlob);

                /*
                disconnectBtn.addEventListener("click", () => {
                    const disconnectMsg = MmtpMessage.create({
                        msgType: MsgType.PROTOCOL_MESSAGE,
                        uuid: uuidv4(),
                        protocolMessage: ProtocolMessage.create({
                            protocolMsgType: ProtocolMessageType.DISCONNECT_MESSAGE,
                            disconnectMessage: Disconnect.create()
                        })
                    });

                    msgBlob = MmtpMessage.encode(disconnectMsg).finish();

                    lastSentMessage = disconnectMsg;
                    ws.send(msgBlob);
                });

                */
                await fetch(mrnStoreUrl + "/mrn", {
                    method: "POST",
                    body: JSON.stringify({mrn: ownMrn, edgeRouter: edgeRouter}),
                    mode: "cors",
                    headers: {"Content-Type": "application/json"}
                });
                return true;
            } else {
                if (response.msgType == MsgType.RESPONSE_MESSAGE) {
                    const msgs = response!.responseMessage!.applicationMessages;
                    msgs!.forEach(msg => {
                        showReceivedMessage(msg);
                    })
                }
            }
        };

        const connectMsg = MmtpMessage.create({
            msgType: MsgType.PROTOCOL_MESSAGE,
            uuid: uuidv4(),
            protocolMessage: ProtocolMessage.create({
                protocolMsgType: ProtocolMessageType.CONNECT_MESSAGE,
                connectMessage: Connect.create({
                    ownMrn: ownMrn
                })
            })
        });
        if (reconnectToken) {
            connectMsg!.protocolMessage!.connectMessage!.reconnectToken = reconnectToken;
        }
        let msgBlob = MmtpMessage.encode(connectMsg).finish();

        setLastSentMessage!(connectMsg);
        ws.send(msgBlob);
    });

    ws.addEventListener("close", evt => {
        if (evt.code !== 1000) {
            alert("Connection to Edge Router closed unexpectedly: " + evt.reason);
            return false;
        }
        fetch(mrnStoreUrl + "/mrn/" + ownMrn, {
            method: "DELETE",
            mode: "cors"
        }).then(() => {});
    });
      return true;
    }

  function showReceivedMessage(msg: IApplicationMessage) {
    const payload = msg.body!;
    const decoder = new TextDecoder();
    if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
        for (let i = 4; i < payload.length; i++) {
            if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
                const fileNameBytes = payload.subarray(4, i);
                const fileName = decoder.decode(fileNameBytes);
                const content = payload.subarray(i + 4);

                /*
                incomingArea.append(`${msg.header.sender} sent: `);
                const downloadLink = document.createElement("a");
                downloadLink.href = "#";
                downloadLink.textContent = fileName;
                downloadLink.onclick = (e) => {
                    let hidden_a = document.createElement('a');
                    hidden_a.setAttribute('href', 'data:application/octet-stream;base64,' + bytesToBase64(content));
                    hidden_a.setAttribute('download', fileName);
                    document.body.appendChild(hidden_a);
                    hidden_a.click();

                    e.preventDefault();
                };
                incomingArea.append(downloadLink);
                incomingArea.append('\n');
                */
                break;
            }
        }
    } else {
        const text = decoder.decode(payload);
        console.log(text);
        //incomingArea.append(`${msg.header.sender} sent: ${text}\n`);
    }
  }
  return (
    <Container fluid className="h-100 d-inline-block side-panel-minimized d-flex flex-column">
      <ConnectModal mrnStoreUrl={mrnStoreUrl} createConnection={createConnection}></ConnectModal>
      
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

                </div>
              </div>
              <div className="textbox">
                <div className="label">Direct</div>
              </div>
            </div>
            <div className="dividers"></div>
            <div className="tab">
              <div className="button-frame">
                <div className="button">
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
              <div className="textbox">
                <div className="label">Multicast</div>
              </div>
            </div>
            <div className="dividers"></div>
            <div className="tab">
              <div className="button-frame">
                <div className="button">
                <svg
                  className="_01-close"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                    fill="#1A1A1A"
                  />
                </svg>
                </div>
              </div>
              <div className="textbox">
                <div className="label">Disconnect</div>
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
          <NotificationManager></NotificationManager>
          <ChatModal mrnStoreUrl={mrnStoreUrl} ownMrn={ownMrn} ws={ws}></ChatModal>
          <Map positions={positions}></Map>
        </Col>
      </Row>
    </Container>
    
  );
}

export default App;
