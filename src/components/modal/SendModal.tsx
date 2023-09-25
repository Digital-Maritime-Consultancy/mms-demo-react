import { Button, Container, Row } from "react-bootstrap";
import { Agent } from "../../model/Agent";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FileInput } from "../FileInput";
import { MessageMode } from "../BrowserAgent";
import "./SendModal.css";

export interface SendModalProp {
  ownMrn: string;
  mode: MessageMode;
  mrnStoreUrl: string;
  subjects: string[];
  sendMessage: (msg: Uint8Array, mode: MessageMode, endPoint: string) => void;
}

export const SendModal = forwardRef((props: SendModalProp, ref) => {
  const [show, setShow] = useState(false);
  const [bytes, setBytes] = useState<Uint8Array>();
  const [_mode, setMode] = useState<MessageMode>(props.mode);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [destination, setDestination] = useState("");
  const encoder = new TextEncoder();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  let fileInputRef: any = useRef();

  useEffect(() => {
    fetchMrns();
  }, [props.mode]);

  useEffect(() => {
  }, [destination]);

  const handleShow = (mode: MessageMode) => {
    fetchMrns();
    setMode(mode);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setBytes(new Uint8Array());
  }

  useImperativeHandle(ref, () => ({
    openModal: (mode: MessageMode, recipientMrn?: string) => {
      handleShow(mode);
      setDestination(recipientMrn!);
    },
  }));

  const fetchMrns = () => {
    fetch(props.mrnStoreUrl + "/mrns", {
      mode: "cors",
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((resp: Agent[]) =>
        setAgents(resp.filter((e) => e.mrn !== props.ownMrn))
      );
  };

  const onSelectChange = (selected: string) => {
    switch (selected) {
      case "mrn":
        setMode(MessageMode.Direct);
        break;
      case "subject":
        setMode(MessageMode.Multicast);
        break;
      default:
        break;
    }
  };

  const handleSend = () => {
    if (bytes && destination) {
      props.sendMessage(bytes, _mode, destination);
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.resetFileInput();
      }
      setBytes(undefined);
    }
  };

  return (
    <>
      {show && (
        <div
          className="show"
          style={{ position: "fixed", bottom: "0", left: "48px", zIndex: 9999 }}
        >
          <div className="modal-window-send">
            <Container fluid>
              <Row className="top-area-send align-middle">
                <div className="border-bottom-send" />
                <span className="title-send align-middle">Send message</span>
              </Row>
              <Row>
                <Row>
                  <label htmlFor="receiver" className="form-label">
                    Receiver of Message
                  </label>
                  {_mode === MessageMode.None && (
                    <select
                      className="form-select"
                      id="receiver"
                      onChange={(e) => onSelectChange(e.currentTarget.value)}
                    >
                      <option value="">
                        ---Please choose a receiver type---
                      </option>
                      <option value="mrn">MRN</option>
                      <option value="subject">Subject</option>
                    </select>
                  )}
                  {_mode === MessageMode.Direct && (
                    <select
                      className="form-select"
                      id="receiverMrn"
                      value={destination}
                      onChange={(e) => setDestination(e.currentTarget.value)}
                    >
                      <option value={""}>
                        ---Please select an MRN---
                      </option>
                      {agents.map((agent, idx) => (
                        <option key={idx} value={agent.mrn}>
                          {agent.mrn}
                        </option>
                      ))}
                    </select>
                  )}
                  {_mode === MessageMode.Multicast && (
                    <select
                      className="form-select"
                      id="subjectSelect"
                      onChange={(e) => setDestination(e.currentTarget.value)}
                    >
                      <option value="">---Please select a subject---</option>
                      {props.subjects.map((subject, idx) => (
                        <option key={idx} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  )}
                </Row>
                <Row>
                  <label htmlFor="msgArea" className="form-label">
                    Write Message Here
                  </label>
                  <textarea
                    className="form-control my-2"
                    id="msgArea"
                    ref={textareaRef}
                    onChange={(e) =>
                      setBytes(encoder.encode(e.currentTarget.value))
                    }
                  ></textarea>
                  <FileInput ref={fileInputRef} setBytes={setBytes} />
                </Row>
                <Row className="">
                  <Button
                    disabled={!(bytes && destination && bytes.length)}
                    className="me-2 button4-send my-2"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                  <Button
                  variant="secondary"
                    className="button4-send my-2"
                    onClick={() => close()}
                  >
                    Close
                  </Button>
                </Row>
              </Row>
            </Container>
          </div>
        </div>
      )}
    </>
  );
});
