import './style.css';
import { connectToServer } from './socket-client';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
    <span>offline</span>
  </div>
`;

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
connectToServer();
