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
    '0x0000000000000000000000000000000000000000'
  );
  console.log(address);

  console.log(address);

  const [latestEstimationData, setLatestEstimationData] = useState(null);
  const [latestSendData, setLatestSendData] = useState(null);

  const whitelistAddressAndMintNFT = async () => {

    const addresses = [etherspotAddress];
    const api_key = 'gasless_mint_demo';
    const chainId = 80001;
    const returnedValue = await fetch('https://arka.etherspot.io/whitelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "params": [addresses, chainId, api_key] })
    })
      .then((res) => {
        return res.json()
      }).catch((err) => {
        console.log(err);
      });

	  console.log('Value returned: ', returnedValue);

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
            api_key: "gasless_mint_demo",
            context: { mode: "sponsor" }
          }}
        >
          <EtherspotBatch chainId={80001}>
            <EtherspotContractTransaction 
            contractAddress={'0x09C84f517E3Ff7347b2902b3055Bb4ac90745f3b'}
            abi={['function mint(address)']}
            methodName={'mint'}
            // REPLACE_HERE
            params={['0x35D2ae3D5F55eD223f471aD660baF89eCDEb13E0']}
            value={'0'} 
            >
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
                <button onClick={whitelistAddressAndMintNFT} color="success">
                  Mint NFT
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
