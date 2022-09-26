import axios from "axios";
require("dotenv").config();

export async function ipfsPinJson(jb){
    
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
        return { tokenuri: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash };
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
}