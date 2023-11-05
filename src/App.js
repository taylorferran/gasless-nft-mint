import { useState } from 'react';
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  useEtherspotTransactions,
  useWalletAddress,
} from '@etherspot/transaction-kit';

import logo from './etherspot-logo.svg';
import './App.css';
import { utils } from 'ethers';

function App() {
  const etherspotAddress = useWalletAddress();
  const { estimate, send } = useEtherspotTransactions();
  const [address, setAddress] = useState(
    '0x271Ae6E03257264F0F7cb03506b12A027Ec53B31'
  );
  const [latestEstimationData, setLatestEstimationData] = useState(null);
  const [latestSendData, setLatestSendData] = useState(null);

  const runEstimation = async () => {
    // Reset the latest send data
    setLatestSendData(null);

    // Perform the estimation
    const estimationData = await estimate();
    console.log('Estimation Data:', estimationData);

    /**
     * Sometimes the estimation fails. If the estimation fails,
     * it usually means the transaction could not be validated and
     * something, usually the transaction values, were invalid.
     */
    if (JSON.stringify(estimationData).includes('reverted')) {
      alert(
        'Sorry, an estimation error occured. This may happen if:\n\n- The address or amount entered were invalid\n- Your Etherspot Smart Wallet account has no funds\n\nPlease check these points and try again.'
      );

      return;
    }

    /**
     * Otherwise, we have a successful estimation! Lets set it
     * so we can display / yse it later.
     */
    setLatestEstimationData(estimationData);
  };

  /**
   * The send method will now submit this transaction to
   * Etherspot. Etherspot will queue, submit and monitor your
   * transaction to ensure that it eventually reaches the
   * blockchain.
   */
  const runSend = async () => {

    // Lets send this transaction!
    await estimate();
    const sendResult = await send();
    console.log('Send Data:', sendResult);

    if (JSON.stringify(sendResult).includes('reverted')) {
      alert(
        'There was a problem trying to send your transaction. This can happen for a variety of reasons, but the most common problems are bad blockchain conditions or an out of date estimate.\n\nPlease try to estimate, then send again.'
      );

      return;
    }

    setLatestSendData(sendResult);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-wallet-address-label">
          Your Etherspot wallet address (Polygon Mumbai testnet)
        </p>
        <p className="App-wallet-address">{etherspotAddress}</p>
        <EtherspotBatches
            paymaster={{
            url: "https://arka.etherspot.io",
            api_key: "arka_public_key",
            context: { mode: "sponsor" }
          }}
        >
          <EtherspotBatch chainId={80001}>
            <EtherspotContractTransaction 
              to={address} 
              value={amount}>
                
              <p className="App-info">
                This is the destination blockchain address. Always remember that
                the blockchain address you are sending to must ALWAYS be on the
                SAME blockchain. In our case, <b>Polygon Testnet</b>, also known
                as <b>Mumbai</b>.
              </p>

              <div className="App-form-control">
                <label className="App-label" htmlFor="addressInput">
                  Destination Address on Polygon Testnet (aka Mumbai)
                </label>
                <input
                  className="App-text-input"
                  id="addressInput"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              {!!latestEstimationData && !latestSendData && (
                <p className="App-transaction-details">
                  Estimated transaction cost:
                  <br />
                  <strong>
                    Test MATIC{' '}
                    {utils.formatEther(
                      latestEstimationData[0].estimatedBatches[0].cost
                    )}
                  </strong>
                </p>
              )}

              {!!latestSendData && (
                <p className="App-transaction-details">
                  <strong>Your transaction was sent!</strong>
                  <br />
                  Your transaction will soon appear{' '}
                  <a
                    target="_blank"
                    href={`https://mumbai.polygonscan.com/address/${etherspotAddress}#internaltx`}
                  >
                    here
                  </a>
                  !
                </p>
              )}

              <div className="App-form-buttons-control">
                <button onClick={runEstimation} color="primary">
                  Estimate
                </button>
                <button onClick={runSend} color="success">
                  Send
                </button>
              </div>
            </EtherspotContractTransaction>
          </EtherspotBatch>
        </EtherspotBatches>
      </header>
    </div>
  );
}

export default App;
