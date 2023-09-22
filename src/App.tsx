import React, { useState } from 'react';
import './App.css';
import { Map } from './components/map/Map';
import { Container, Row, Col } from 'react-bootstrap';
import { ConnectModal } from './components/modal/ConnectModal';
import { ChatModal } from './components/modal/ChatModal';
import NotificationManager from './components/NotificationManager';
import { Connect, IApplicationMessage, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType, Subscribe } from './generated/mmtp';
import {v4 as uuidv4} from "uuid";
import { BrowserAgent } from './components/BrowserAgent';

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

  return (
    <BrowserAgent positions={positions} />
  );
}

export default App;
