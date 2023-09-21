import { Button, ListGroup, Modal } from "react-bootstrap"
import { IApplicationMessage, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType, Receive } from "../../generated/mmtp";
import { Agent } from "../../model/Agent";
import {v4 as uuidv4} from "uuid";
import { Dispatch, SetStateAction } from "react";
import { IncomingWindows } from "../IncomingWindow";

export interface ChatModalProp {
    ownMrn: string;
    mrnStoreUrl: string;
    lastSentMessage?: MmtpMessage;
    setLastSentMessage?: Dispatch<SetStateAction<MmtpMessage | undefined>>;
    ws?: WebSocket;
}

export const ChatModal = (
    {
        ownMrn,
        mrnStoreUrl,
        lastSentMessage,
        setLastSentMessage,
        ws,
    }: ChatModalProp
    ) =>
    {
        const possibleSubscriptions = ["Horses", "Boats", "MCP", "Weather"];

        /*
        function showReceivedMessage(msg: IApplicationMessage) {
            const payload = msg.body;
            const decoder = new TextDecoder();
            if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
                for (let i = 4; i < payload.length; i++) {
                    if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
                        const fileNameBytes = payload.subarray(4, i);
                        const fileName = decoder.decode(fileNameBytes);
                        const content = payload.subarray(i + 4);
        
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
                        break;
                    }
                }
            } else {
                const text = decoder.decode(payload);
                incomingArea.append(`${msg.header.sender} sent: ${text}\n`);
            }
        }
        */

        const onReceive = () => {
            const receive = MmtpMessage.create({
                msgType: MsgType.PROTOCOL_MESSAGE,
                uuid: uuidv4(),
                protocolMessage: ProtocolMessage.create({
                    protocolMsgType: ProtocolMessageType.RECEIVE_MESSAGE,
                    receiveMessage: Receive.create({})
                })
            });
            const bytes = MmtpMessage.encode(receive).finish();
            console.log(setLastSentMessage);
            // setLastSentMessage!(receive);
            ws!.send(bytes);
        }
        
        const onSelectChange = (selected: string) => {
            switch (selected) {
                case "mrn":
                    //subjectSelect.hidden = true;
                    //receiverMrnSelect.hidden = false;
                    fetch(mrnStoreUrl + "/mrns", {
                        mode: "cors",
                        method: "GET"
                    })
                        .then(resp => resp.json())
                        .then((resp: Agent[]) => resp.forEach(agent => {
                            
                            if (agent.mrn !== ownMrn) {
                                const mrnOption = document.createElement("option");
                                mrnOption.value = agent.mrn;
                                mrnOption.textContent = agent.mrn;
                                //receiverMrnSelect.appendChild(mrnOption);
                            }
                        }));
                    break;
                case "subject":
                    //receiverMrnSelect.hidden = true;
                    //receiverMrnSelect.innerHTML = "<option value=\"\">---Please select an MRN---</option>";
                    //subjectSelect.hidden = false;
                    break;
                default:
                    //receiverMrnSelect.hidden = true;
                    //subjectSelect.hidden = true;
                    break;
            }
        }
        return <div
        className="show"
        style={{ position: 'fixed', bottom: "0", left: "0", zIndex: 9999}}
      >
        <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Chat</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <div className="container" id="msgContainer">
            <div className="row">
                <div className="col">
                    <label htmlFor="incomingArea" className="form-label">Incoming Messages</label>
                    <div className="container h-100">
                        <IncomingWindows></IncomingWindows>
                        <button className="btn btn-primary my-2 item" id="receiveBtn" onClick={onReceive}>Receive Messages</button>
                    </div>
                </div>
                <div className="col">
                    <label htmlFor="msgArea" className="form-label">Write Message Here</label>
                    <textarea className="form-control my-2" id="msgArea" ></textarea>
                    <div>
                        <label htmlFor="msgArea" className="form-label">Select File Here</label>
                        <input type="file" id="fileInput" />
                        <div className="container">
                            <div id="file-state-loaded" className="bg-success text-white py-2 px-3 mb-3">File loaded</div>
                            <div id="file-state-unloaded" className="bg-secondary text-white py-2 px-3">File not chosen</div>
                        </div>
                    </div>

                    <label htmlFor="receiver" className="form-label">Receiver of Message</label>
                    <select className="form-select" id="receiver" onChange={(e) => onSelectChange(e.currentTarget.value)}>
                        <option value="">---Please choose a receiver type---</option>
                        <option value="mrn">MRN</option>
                        <option value="subject">Subject</option>
                    </select>
                    <select className="form-select" id="receiverMrn">
                        <option value="">---Please select an MRN---</option>
                    </select>
                    <select className="form-select" id="subjectSelect">
                        <option value="">---Please select a subject---</option>
                    </select>
                    <button className="btn btn-primary my-2" id="sendBtn">Send</button>
                    <button className="btn btn-danger my-2" id="disconnectBtn">Disconnect</button>
                </div>
            </div>
            <div className="row my-2">
                <label htmlFor="subscriptions" className="form-label">Subscriptions</label>
                <ListGroup>
                    {possibleSubscriptions.map(e => <ListGroup.Item key={e}>{e}</ListGroup.Item>)}
                </ListGroup>
            </div>
        </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => {}}>Close</Button>
          <Button variant="primary" onClick={() => {}}>Connect</Button>
        </Modal.Footer>
      </Modal.Dialog>
      </div>
    }