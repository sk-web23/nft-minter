import { useEffect, useState } from "react";
import { connectWallet, mintNFT } from "./interact";

const Minter = (props) => {
  const walletListener =  () => {
    if(window.ethereum){
      window.ethereum.on("accountsChanged", (accounts) => {
        if(accounts.length>0){
          setStatus("Write a message in text field above");
          setWallet(accounts[0]);
        }else{
          setWallet("")
          setStatus("🦊 Connect to MetaMask using the top right button.")
        }
      })
    }
    else{
     
       return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      }
    }
  }
  //State variables
  const [walletAddress, setWallet] = useState(window.localStorage.getItem("wallet")!==null?window.localStorage.getItem("wallet"):'');
  const [status, setStatus] = useState(window.localStorage.getItem("status")!==null?window.localStorage.getItem("status"):'');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url1, setURL] = useState("");
 
  useEffect( () => {
     window.localStorage.setItem("status", "Connected");
     window.localStorage.setItem("wallet", walletAddress);
     walletListener();
  }, [status, walletAddress]);


  const onMintPressed = async () => { //TODO: implement
    console.log(url1);
    const {status, url} = await mintNFT(url1, name, description);
    setStatus(status);
    setURL(url);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={async () => {const response = await connectWallet(); setStatus(response.status); setWallet(response.address) }}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
