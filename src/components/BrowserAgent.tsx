import React, { useEffect, useRef, useState } from "react";
import { Map } from "./map/Map";
import { Container, Row, Col } from "react-bootstrap";
import { ConnectModal } from "./modal/ConnectModal";
import { SendModal } from "./modal/SendModal";
import NotificationManager from "./NotificationManager";
import {
  ApplicationMessage,
  ApplicationMessageHeader,
  Connect,
  Disconnect,
  IApplicationMessage,
  MmtpMessage,
  MsgType,
  ProtocolMessage,
  ProtocolMessageType,
  Receive,
  Recipients,
  Send,
  Subscribe,
  Unsubscribe,
} from "../generated/mmtp";
import { v4 as uuidv4 } from "uuid";
import { disconnect } from "process";
import { SubscriptionManager } from "./SubscriptionManager";
import { InfoModal } from "./modal/InfoModal";

export interface BrowserAgentProp {
  positions: number[][];
}

export enum MessageMode {
  None = 0,
  Direct,
  Multicast,
}

export const BrowserAgent = ({ positions }: BrowserAgentProp) => {
  const mrnStoreUrl = "http://20.91.195.244";
  const [ownMrn, setOwnMrn] = useState("");
  const [connected, setConnected] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<
    IApplicationMessage[]
  >([]);
  const [lastSentMessage, setLastSentMessage] = useState<MmtpMessage>();
  const [subjects, setSubjects] = useState([
    "Urn:mrn:mcp:service:dk-dmi:weather_on_route",
    "Boats",
    "MCP",
    "Weather",
  ]);
  const [reconnectToken, setReconnectToken] = useState("");
  const [ws, setWs] = useState<WebSocket>();
  let subModalRef: any = useRef();
  let connModalRef: any = useRef();
  let sendModalRef: any = useRef();
  let infoModalRef: any = useRef();
  let handleId: NodeJS.Timer;

  useEffect(() => {
    if (connected) {
      handleId = setInterval(checkReceivedMsg, 5000);
    } else {
      clearInterval(handleId);
    }

    return () => {
      clearInterval(handleId);
      disconnect();
    };
  }, [connected]);

  const initialize = () => {
    setReceivedMessages([]);
    setConnected(false);
    openConnModal();
    setOwnMrn("");
  };

  const isWebSocketNotWorking = (): boolean => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      initialize();
      return true;
    }
    return false;
  };

  const checkReceivedMsg = () => {
    if (isWebSocketNotWorking()) return;
    const receive = MmtpMessage.create({
      msgType: MsgType.PROTOCOL_MESSAGE,
      uuid: uuidv4(),
      protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.RECEIVE_MESSAGE,
        receiveMessage: Receive.create({}),
      }),
    });
    const bytes = MmtpMessage.encode(receive).finish();
    setLastSentMessage(receive);
    ws!.send(bytes);
  };

  const subscribeMessage = (ps: string) => {
    if (isWebSocketNotWorking()) return;
    const subMsg = MmtpMessage.create({
      uuid: uuidv4(),
      msgType: MsgType.PROTOCOL_MESSAGE,
      protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.SUBSCRIBE_MESSAGE,
        subscribeMessage: Subscribe.create({
          subject: ps,
        }),
      }),
    });
    const subMsgBytes = MmtpMessage.encode(subMsg).finish();
    setLastSentMessage(subMsg);
    ws!.send(subMsgBytes);
  };

  const unsubscribeMessage = (ps: string) => {
    if (isWebSocketNotWorking()) return;
    const unsubMsg = MmtpMessage.create({
      uuid: uuidv4(),
      msgType: MsgType.PROTOCOL_MESSAGE,
      protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.UNSUBSCRIBE_MESSAGE,
        unsubscribeMessage: Unsubscribe.create({
          subject: ps,
        }),
      }),
    });
    const unsubMsgBytes = MmtpMessage.encode(unsubMsg).finish();
    setLastSentMessage(unsubMsg);
    ws!.send(unsubMsgBytes);
  };

  const sendMessage = (bytes: Uint8Array, mode: MessageMode, dest: string) => {
    if (isWebSocketNotWorking()) return;
    let sendMsg = MmtpMessage.create({
      msgType: MsgType.PROTOCOL_MESSAGE,
      uuid: uuidv4(),
      protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.SEND_MESSAGE,
        sendMessage: Send.create({
          applicationMessage: ApplicationMessage.create({
            header: ApplicationMessageHeader.create({
              bodySizeNumBytes: bytes.byteLength,
              sender: ownMrn,
            }),
            body: bytes,
          }),
        }),
      }),
    });

    if (mode === MessageMode.Direct) {
      sendMsg!.protocolMessage!.sendMessage!.applicationMessage!.header!.recipients =
        Recipients.create({
          recipients: [dest],
        });
    } else if (mode === MessageMode.Multicast) {
      sendMsg!.protocolMessage!.sendMessage!.applicationMessage!.header!.subject =
        dest;
    }

    const toBeSent = MmtpMessage.encode(sendMsg).finish();
    setLastSentMessage(sendMsg);
    ws!.send(toBeSent);
  };

  const disconnect = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) return;
    const disconnectMsg = MmtpMessage.create({
      msgType: MsgType.PROTOCOL_MESSAGE,
      uuid: uuidv4(),
      protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.DISCONNECT_MESSAGE,
        disconnectMessage: Disconnect.create(),
      }),
    });

    var msgBlob = MmtpMessage.encode(disconnectMsg).finish();

    setLastSentMessage(disconnectMsg);
    ws!.send(msgBlob);

    initialize();
  };

  const createConnection = (edgeRouter: string, ownMrn: string): boolean => {
    const _ws = new WebSocket(edgeRouter);

    _ws.addEventListener("open", () => {
      let initialized = false;

      _ws.onmessage = async (msgEvent) => {
        const data = msgEvent.data as Blob;
        const bytes = await data.arrayBuffer();
        const response = MmtpMessage.decode(new Uint8Array(bytes));

        if (
          lastSentMessage &&
          response.responseMessage?.responseToUuid !== lastSentMessage!.uuid
        ) {
          alert(
            "The UUID of the last sent message does not match the UUID being responded to"
          );
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
                directMessages: true,
              }),
            }),
          });
          msgBlob = MmtpMessage.encode(subMsg).finish();

          setLastSentMessage!(subMsg);
          initialized = true;

          _ws.send(msgBlob);

          await fetch(mrnStoreUrl + "/mrn", {
            method: "POST",
            body: JSON.stringify({ mrn: ownMrn, edgeRouter: edgeRouter }),
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          });
          return true;
        } else {
          if (response.msgType == MsgType.RESPONSE_MESSAGE) {
            const msgs = response!.responseMessage!.applicationMessages;
            msgs!.forEach((msg: IApplicationMessage) => {
              showReceivedMessage(msg);
            });
          }
        }
      };

      const connectMsg = MmtpMessage.create({
        msgType: MsgType.PROTOCOL_MESSAGE,
        uuid: uuidv4(),
        protocolMessage: ProtocolMessage.create({
          protocolMsgType: ProtocolMessageType.CONNECT_MESSAGE,
          connectMessage: Connect.create({
            ownMrn: ownMrn,
          }),
        }),
      });
      if (reconnectToken) {
        connectMsg!.protocolMessage!.connectMessage!.reconnectToken =
          reconnectToken;
      }
      let msgBlob = MmtpMessage.encode(connectMsg).finish();

      setLastSentMessage!(connectMsg);
      _ws.send(msgBlob);
    });

    _ws.addEventListener("close", (evt) => {
      if (evt.code !== 1000) {
        alert("Connection to Edge Router closed unexpectedly: " + evt.reason);
        initialize();
        return false;
      }
      fetch(mrnStoreUrl + "/mrn/" + ownMrn, {
        method: "DELETE",
        mode: "cors",
      }).then(() => {});
    });

    setWs(_ws);
    setConnected(true);
    return true;
  };

  const showReceivedMessage = (msg: IApplicationMessage) => {
    if (!receivedMessages.includes(msg)) {
      setReceivedMessages((prevMessages) => [...prevMessages, msg]);
    }
  };

  const openSubModal = () => {
    if (subModalRef && subModalRef.current) {
      subModalRef.current.openModal();
    }
  };

  const openConnModal = () => {
    if (connModalRef && connModalRef.current) {
      connModalRef.current.openModal();
    }
  };

  const openInfoModal = () => {
    if (infoModalRef && infoModalRef.current) {
        infoModalRef.current.openModal();
    }
  };

  const openSendModal = (mode: MessageMode, mrn?: string) => {
    if (sendModalRef && sendModalRef.current) {
      sendModalRef.current.openModal(mode, mrn);
    }
  };

  const triggerReply = (mrn: string) => {
    openSendModal(MessageMode.Direct, mrn);
  };

  return (
    <Container
      fluid
      className="h-100 d-inline-block side-panel-minimized d-flex flex-column"
    >
      <ConnectModal
        mrnStoreUrl={mrnStoreUrl}
        createConnection={createConnection}
        setMrn={setOwnMrn}
        ref={connModalRef}
      ></ConnectModal>

      <InfoModal ref={infoModalRef}></InfoModal>

      <Row className="topbar">
        <Col xs={3}>
          <div className="title-area">
            <div className="menu-button">
              <div className="button-frame">
                <img
                  width="45"
                  height="32"
                  src="https://maritimeconnectivity.net/wp-content/uploads/2021/06/cropped-MCP-Logo-1.png"
                  alt=""
                  decoding="async"
                  data-variant="logo"
                />
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
        <Col xs={9} className="d-flex justify-content-end align-items-center">
          {connected && ownMrn}
        </Col>
      </Row>
      <Row className="flex-grow-1">
        <Col xs={1} className="side-card-panel-main">
          <div className="container-content-main">
            <div className="container-cards-main">
              <div className="tab-main">
                <div
                  className="button-frame-main"
                  onClick={() => openSendModal(MessageMode.Direct)}
                >
                  <div className="button-main">
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
                <div className="textbox-main">
                  <div className="label-main">Direct</div>
                </div>
              </div>
              <div className="dividers"></div>
              <div className="tab-main">
                <div
                  className="button-frame"
                  onClick={() => openSendModal(MessageMode.Multicast)}
                >
                  <div className="button-main">
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
                <div className="textbox-main">
                  <div className="label-main">Multicast</div>
                </div>
              </div>
              <div className="dividers"></div>
              <div className="tab-main">
                <div className="button-frame-main" onClick={openSubModal}>
                  <div className="button-main">
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
                      <path
                        d="M2 4.99833V3H19.8218V4.99833H2Z"
                        fill="#1A1A1A"
                      />
                      <path
                        d="M15.4901 16.75H16.2401L19.9901 19V8.5L16.2401 10.75H12.4901C11.6617 10.75 10.9901 11.4216 10.9901 12.25V15.25C10.9901 16.0784 11.6617 16.75 12.4901 16.75H13.2401V19.75H15.4901V16.75Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </div>
                </div>
                <div className="textbox-main">
                  <div className="label-main">Subscription</div>
                </div>
              </div>
              <div className="dividers"></div>
              <div className="tab-main">
                <div className="button-frame-main" onClick={() => disconnect()}>
                  <div className="button-main">
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
                <div className="textbox-main">
                  <div className="label-main">Disconnect</div>
                </div>
              </div>
            </div>
            <div className="panel-controls">
              <div className="tab-main">
                <div className="button-frame-main" onClick={() => openInfoModal()}>
                  <div className="button-main">
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col style={{ backgroundColor: "#f819fa" }} className="p-0">
          <NotificationManager
            messages={receivedMessages}
            setMessages={setReceivedMessages}
            reply={(mrn: string) => triggerReply(mrn)}
          />
          <SubscriptionManager
            ref={subModalRef}
            subscriptions={subjects}
            subscribeMessage={subscribeMessage}
            unsubscribeMessage={unsubscribeMessage}
          />
          <SendModal
            ref={sendModalRef}
            mode={MessageMode.Direct}
            mrnStoreUrl={mrnStoreUrl}
            ownMrn={ownMrn}
            sendMessage={sendMessage}
            subjects={subjects}
          ></SendModal>
          <Map positions={positions}></Map>
        </Col>
      </Row>
    </Container>
  );
};
