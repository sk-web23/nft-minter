import axios from "axios"
require("dotenv").config()
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3("https://eth-ropsten.alchemyapi.io/v2/"+alchemyKey)

const contractABI = require("./contract-abi.json")
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE"
var tokenURI = "";
async function ipfsPinJson(jb){
    
    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
          'pinata_api_key': '353b5f504a7b20e7ce53', 
          'pinata_secret_api_key': 'ba6aeee228083b766327dd304e3cf575557a05c2b390b1b563ffb5c87903313f', 
          'Content-Type': 'application/json'
        },
        data : jb
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
         tokenURI = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash ;
      })
      .catch(function (error) {
        console.log(error);
      });
}
export const mintNFT = async (url, name, description) => {
    if( url.trim()==="" || name.trim()==="" || description.trim()===""){
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }else{
            const metadata = {}
            metadata.name = name
            metadata.image = url
            metadata.description = description
            console.log(metadata);
        await ipfsPinJson( JSON.stringify(metadata));
    
        if(tokenURI===null){
            return {
                success: false,
                status: "😢 Something went wrong while uploading your tokenURI.",
              }
        }
       console.log(tokenURI);
        window.contract = await new web3.eth.Contract(contractABI, contractAddress)
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            data: window.contract.methods
              .mintNFT(window.ethereum.selectedAddress, tokenURI)
              .encodeABI(), //make call to NFT smart contract
          }
          try {
            const txHash = await window.ethereum.request({
              method: "eth_sendTransaction",
              params: [transactionParameters],
            })
            return {
              success: true,
              status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
            }
          } catch (error) {
            return {
              success: false,
              status: "😥 Something went wrong: " + error.message,
            }
          }
    }
    
}
export async function connectWallet(){
    if(window.ethereum){
        try{
            const addresses = await window.ethereum.request({method:"eth_requestAccounts"});
            const obj = {
                message:"plz write a message",
                address:addresses[0]
            }
            return obj;
        }
        catch(err){
            return {
                address: "",
                status: "😥 " + err.message,
              }
        }    
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