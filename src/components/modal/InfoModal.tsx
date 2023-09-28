import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";

export const InfoModal = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  useImperativeHandle(ref, () => ({
    openModal: () => handleOpenModal(),
  }));

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
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="MMS">
              <p>
                MMS is a messaging service intended to offer transparent
                seamless information transfer across different communication
                links in a carrier agnostic and geolocation-context sensitive
                manner.
              </p>

              <p>
                The MMS allows maritime stakeholders to send and receive
                authenticated/authorized messages in an efficient, reliable and
                seamless manner to solve problems of the current maritime
                wireless data communication systems. It is the intention to
                include demonstrations of the use of MMS both over VDES and
                plain internet connection.
              </p>
            </Tab>
            <Tab eventKey="configuration" title="Demo">
              <p>
                This demonstration aims to show the user connecting to the MMS
                network using MRN and exchanging messages through MMS. When a
                user enters an MRN, an MMS Agent assigned with that MRN is
                created and connected to the selected region's MMS Edge Router.
              </p>
              <p>
                Then the Edge Router enables communications over MMS Routers (so
                called MMS network) where the user can send a message from one
                Edge Router to other Agents connected to another Edge Router.
              </p>
              <p>
                Currently there are two message types: Direct message (MRN
                Addressed Message) and Multicast message (Subject-cast
                Messages). Direct messages are messages send from a specific MCP
                MRN to a specific MCP MRN whereas Multicast are messages
                broadcasted from a specific MCP MRN on a specific subject tag.
              </p>
            </Tab>
            <Tab eventKey="inaction" title="In action">
              <p>
                In operational MMS setup, each of vessel will have an MMS Edge
                Router on board for connection. Application will have MMS Agent
                embeded in order to make a connection to the Edge Router.
              </p>
            </Tab>
            <Tab eventKey="progress" title="Progress">
              <p>
                Currently MCC MMS Working Group is working for both
                standardization and implementation of MMS. This demonstration is
                a working prototype of current version of MMS specification for
                all components, e.g., MMS Agent and Edge Router, and protocol so
                called MMTP (Maritime Message Transfer Protocol).
              </p>
            </Tab>
            <Tab eventKey="credit" title="Credit">
              <p>
                This demonstration is maintained by{" "}
                <a href="https://maritimeconnectivity.net/" target="blank">
                  MCP Consortium
                </a>
                .
              </p>
              <p>
                The interface is powered by{" "}
                <a href="https://www.openbridge.no/" target="blank">
                  OpenBridge
                </a>
                ,{" "}
                <a href="https://react.dev/" target="blank">
                  React
                </a>{" "}
                and{" "}
                <a href="https://leafletjs.com/" target="blank">
                  Leaflet
                </a>
                .
              </p>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => handleCloseModal()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  ) : (
    <></>
  );
});
