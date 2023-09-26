import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MMSAgent } from "../../model/MMSAgent";

export interface ConnectModalProp {
  mrnStoreUrl: string;
  createConnection: (edgeRouter: string, ownMrn: string) => boolean;
  setMrn: (mrn: string) => void;
}

export const ConnectModal = forwardRef(
  ({ mrnStoreUrl, createConnection, setMrn }: ConnectModalProp, ref) => {
    const [showModal, setShowModal] = useState(true);
    const [edgeRouter, setEdgeRouter] = useState("");

    const [name, setName] = useState("");
    const mrnPrefix = "urn:mrn:mcp:device:idp1:org1:";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue.includes(" ")) {
        alert("Space is not allowed in your MRN");
        e.target.value = inputValue.replace(/\s/g, "");
      }
      setName(e.currentTarget.value.toLowerCase());
      setMrn(mrnPrefix + e.currentTarget.value.toLowerCase());
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const checkDuplication = (mrn: string) => {
      fetch(mrnStoreUrl + "/mrns", {
        mode: "cors",
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((resp: MMSAgent[]) => {
          if (resp.filter((e) => e.mrn === mrn).length > 0) {
            alert("The given MRN has already registered!");
            return;
          }
          createConnection(edgeRouter, mrn);
          setShowModal(false);
        });
    };

    const initialize = () => {
      setEdgeRouter("");
      setName("");
    };
    const handleOpenModal = () => {
      initialize();
      setShowModal(true);
    };

    useImperativeHandle(ref, () => ({
      openModal: () => handleOpenModal(),
    }));

    const connect = () => {
      if (edgeRouter === "") {
        alert("You need to choose an Edge Router to connect to!");
        return;
      } else if (!edgeRouter.startsWith("ws")) {
        setEdgeRouter("ws://" + edgeRouter);
      }

      if (name === "") {
        alert("You need to enter name");
        return;
      } else if (name.includes(" ")) {
        alert("Space is not allowed in your MRN");
        return;
      }
      const ownMrn = mrnPrefix + name;
      checkDuplication(ownMrn);
    };

    return showModal ? (
      <div
        className="modal show"
        style={{
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Connect to MMS Network</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="container" id="connectContainer">
              <label htmlFor="edgeRouterAddr" className="form-label">
                Edge Router URL
              </label>
              <select
                className="form-select"
                id="edgeRouterAddr"
                onChange={(e) => setEdgeRouter(e.currentTarget.value)}
              >
                <option value="">--Please choose an Edge Router--</option>
                <option value="ws://20.196.198.157:8888">
                  Korea Edge Router{" "}
                </option>
                <option value="ws://20.91.195.244:8888">EU Edge Router</option>
              </select>
              <label htmlFor="nameField" className="form-label my-2">
                Write your name here
              </label>
              <input
                type="text"
                className="form-control"
                id="nameField"
                onChange={handleInputChange}
              />
              <label htmlFor="nameField" className="form-label my-2">
                Your MRN will be..
              </label>
              <input
                type="text"
                disabled
                className="form-control"
                value={mrnPrefix + name}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={connect}>
              Connect
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    ) : (
      <></>
    );
  }
);
