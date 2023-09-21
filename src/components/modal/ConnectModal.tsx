import { useState } from "react";
import { Button, Modal } from "react-bootstrap";


export interface ConnectModalProp {
    mrnStoreUrl: string;
    createConnection: (edgeRouter: string, ownMrn: string) => boolean;
}

export const ConnectModal = (
    {
        mrnStoreUrl,
        createConnection,
    }: ConnectModalProp
    ) =>
    {
        const [showModal, setShowModal] = useState(true);
        const [edgeRouter, setEdgeRouter] = useState("");
        
        
        const [name, setName] = useState("");
        const mrnPrefix = "urn:mrn:mcp:device:idp1:org1:";

        const handleCloseModal = () => {
            setShowModal(false);
        };

        const connect = () => {
            if (edgeRouter === "") {
                alert("You need to choose an Edge Router to connect to!");
                return ;
            } else if (!edgeRouter.startsWith("ws")) {
                setEdgeRouter("ws://" + edgeRouter);
            }
        
            if (name === "") {
                alert("You need to enter name");
                return ;
            }
            const ownMrn = mrnPrefix + name;
            const rst = createConnection(edgeRouter, ownMrn);
            if (rst) {
                setShowModal(false);
            }
        }

        return showModal ? <div
        className="modal show"
        style={{ display: 'block', position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%)"  }}
      >
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Connect to MMS Edge Router</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
  
          <div className="container" id="connectContainer">
            <label htmlFor="edgeRouterAddr" className="form-label">Edge Router URL</label>
            <select className="form-select" id="edgeRouterAddr" onChange={(e) => setEdgeRouter(e.currentTarget.value)}>
                <option value="">--Please choose an Edge Router--</option>
                <option value="ws://20.196.198.157:8888">Korea Edge Router </option>
                <option value="ws://20.91.195.244:8888">EU Edge Router</option>
            </select>
            <label htmlFor="nameField" className="form-label my-2">Write your name here</label>
            <input type="text" className="form-control" id="nameField" onChange={(e) => setName(e.currentTarget.value)} />
        </div>
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={connect}>Connect</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div> : <></>
    }
    