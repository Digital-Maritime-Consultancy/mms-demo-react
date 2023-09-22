import { Button, ListGroup, Modal } from "react-bootstrap"
import { IApplicationMessage, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType, Receive } from "../../generated/mmtp";
import { Agent } from "../../model/Agent";
import {v4 as uuidv4} from "uuid";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { MessageWindow } from "../MessageWindow";
import { FileInput } from "../FileInput";

export interface ChatModalProp {
    ownMrn: string;
    mrnStoreUrl: string;
    message?: IApplicationMessage;
    sendMessage: (msg: Uint8Array, mode: MessageMode, endPoint: string) => void;
}

export enum MessageMode {
    None = 0,
    Direct,
    Multicast
};

export const ChatModal = (
    {
        ownMrn,
        mrnStoreUrl,
        message,
        sendMessage
    }: ChatModalProp
    ) =>
    {
        const [bytes, setBytes] = useState<Uint8Array>();
        const [mode, setMode] = useState<MessageMode>(MessageMode.None);
        const [agents, setAgents] = useState<Agent[]>([]);
        const [subjects, setSubjects] = useState(["Horses", "Boats", "MCP", "Weather"]);
        const [destination, setDestination] = useState("");
        const encoder = new TextEncoder();
        const [fileName, setFileName] = useState("");
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        let fileInputRef: any= useRef();

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
                        .then((resp: Agent[]) => setAgents(resp));
                        setMode(MessageMode.Direct);
                    break;
                case "subject":
                    setMode(MessageMode.Multicast);
                    break;
                default:
                    break;
            }
        }

        const handleSend = () => {
            if (bytes && destination) {
                sendMessage(bytes, mode, destination);
                if (textareaRef.current) {
                    textareaRef.current.value = "";
                }
                if(fileInputRef && fileInputRef.current){
                    fileInputRef.current.resetFileInput();
                }
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
                        <MessageWindow message={message}></MessageWindow>
                    </div>
                </div>
                <div className="col">
                    <label htmlFor="msgArea" className="form-label">Write Message Here</label>
                    <textarea className="form-control my-2" id="msgArea" ref={textareaRef} onChange={(e) => setBytes(encoder.encode(e.currentTarget.value))}></textarea>
                    <FileInput ref={fileInputRef} setBytes={setBytes} />

                    <label htmlFor="receiver" className="form-label">Receiver of Message</label>
                    <select className="form-select" id="receiver" onChange={(e) => onSelectChange(e.currentTarget.value)}>
                        <option value="">---Please choose a receiver type---</option>
                        <option value="mrn">MRN</option>
                        <option value="subject">Subject</option>
                    </select>
                    { mode === MessageMode.Direct &&
                    <select className="form-select" id="receiverMrn" onChange={e => setDestination(e.currentTarget.value)}>
                        <option value="">---Please select an MRN---</option>
                        {
                            agents.map((agent, idx) => <option key={idx} value={agent.mrn}>{agent.mrn}</option>)
                        }
                    </select>
                    }
                    {
                        mode === MessageMode.Multicast &&
                        <select className="form-select" id="subjectSelect" onChange={e => setDestination(e.currentTarget.value)}>
                            <option value="">---Please select a subject---</option>
                            {
                                subjects.map((subject, idx) => <option key={idx} value={subject}>{subject}</option>)
                            }
                        </select>
                    }
                    <button disabled={!(bytes && destination)} className="btn btn-primary my-2" id="sendBtn" onClick={handleSend}>Send</button>
                </div>
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