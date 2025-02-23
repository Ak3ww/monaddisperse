import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

// Logo SVG (already defined in the previous response)
const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
    <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2ZM15.44 27.1492C13.5012 26.6183 8.28864 17.455 8.81704 15.5066C9.34544 13.5581 18.4634 8.31979 20.4021 8.8508C22.341 9.38173 27.5535 18.5449 27.0252 20.4934C26.4968 22.4418 17.3787 27.6802 15.44 27.1492Z" fill="#836EF9" />
    <path d="M57.2952 21.5466V21.5407L48.2488 4.77274C48.0707 4.44268 47.5786 4.52173 47.5117 4.89112L43.0065 29.7945C42.9623 30.0385 43.1489 30.2632 43.3957 30.2632H46.8814C47.0727 30.2632 47.2365 30.1257 47.2707 29.9366L49.8943 15.4059L56.9464 28.9168C57.0945 29.2006 57.4989 29.2006 57.6471 28.9168L64.6991 15.4059L67.3227 29.9366C67.3569 30.1257 67.5207 30.2632 67.712 30.2632H71.1977C71.4445 30.2632 71.6311 30.0385 71.5869 29.7945L67.0817 4.89112C67.0149 4.52173 66.5227 4.44268 66.3446 4.77274L57.2952 21.5466Z" fill="black" />
    <path d="M86.2443 5.24121C79.0685 5.24121 73.4473 10.8451 73.4473 18.0005C73.4473 25.1559 79.0685 30.7629 86.2443 30.7629C93.4016 30.7629 99.0088 25.1574 99.0088 18.0005C99.0088 10.8436 93.4016 5.24121 86.2443 5.24121ZM86.2443 26.4906C81.5649 26.4906 77.8986 22.7609 77.8986 18.0005C77.8986 13.2401 81.5649 9.51353 86.2443 9.51353C90.9052 9.51353 94.5575 13.2417 94.5575 18.0005C94.5575 22.7593 90.9052 26.4906 86.2443 26.4906Z" fill="black" />
    <path d="M118.732 20.928L103.726 4.69711C103.482 4.43241 103.041 4.60642 103.041 4.96772V29.8657C103.041 30.0852 103.218 30.2632 103.437 30.2632H107.064C107.283 30.2632 107.46 30.0852 107.46 29.8657V15.0466L122.432 31.3082C122.676 31.5736 123.118 31.3998 123.118 31.0381V6.14014C123.118 5.92056 122.941 5.74255 122.722 5.74255H119.127C118.909 5.74255 118.732 5.92056 118.732 6.14014V20.928Z" fill="black" />
    <path d="M126.964 30.2628H130.86C131.014 30.2628 131.154 30.1727 131.219 30.0319L134.137 23.6813H143.468L146.32 30.0289C146.384 30.1713 146.525 30.2628 146.68 30.2628H150.907C151.198 30.2628 151.39 29.9563 151.263 29.6923L139.292 4.79589C139.148 4.49642 138.723 4.49642 138.579 4.79589L126.608 29.6923C126.481 29.9563 126.673 30.2628 126.964 30.2628ZM135.966 19.7411L138.866 13.4168L141.711 19.7411H135.966Z" fill="black" />
    <path d="M160.717 5.74219H154.732C154.513 5.74219 154.336 5.9202 154.336 6.13977V29.8653C154.336 30.0849 154.513 30.2629 154.732 30.2629H160.717C168.138 30.2629 172.75 25.5649 172.75 18.001C172.75 10.4371 168.138 5.74219 160.717 5.74219ZM160.717 26.056H158.787V9.91628H160.717C165.535 9.91628 168.298 12.8633 168.298 18.001C168.298 23.12 165.535 26.056 160.717 26.056Z" fill="black" />
  </svg>
);

const styles = {
  container: {
    padding: "30px", // Increased padding
    maxWidth: "650px", // Increased width
    margin: "30px auto", // Increased margin
    backgroundColor: "#fff", // Brighter white
    borderRadius: "12px", // More rounded corners
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Softer shadow
    fontFamily: 'Inter, sans-serif',
    color: "#333", // Darker text
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "25px", // Increased margin
  },
  heading: {
    fontSize: "28px", // Increased font size
    fontWeight: "600", // Slightly lighter font weight
    marginBottom: "20px", // Increased margin
    color: "#2c3e50", // Darker color
    textAlign: "center",
  },
  walletInfo: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#836EF9", // Monad Purple
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px", // More rounded corners
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#6c56e7",
    },
  },
  disconnectButton: {
    backgroundColor: "#e74c3c", // Darker Red
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#c0392b",
    },
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500", // Slightly lighter font weight
    color: "#444",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd", // Lighter border
    fontSize: "15px",
    minHeight: "180px", // Adjusted height
    resize: "vertical",
    boxSizing: "border-box", // Ensure padding doesn't affect width
  },
  parsedAddresses: {
    backgroundColor: "#f0f0f0", // Lighter gray
    padding: "20px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  parsedAddressesTitle: {
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333",
  },
  parsedAddressList: {
    listStyleType: "none",
    padding: 0,
  },
  parsedAddressItem: {
    padding: "10px 0",
    borderBottom: "1px solid #eee", // Lighter border
    fontSize: "14px",
  },
  sendButton: {
    backgroundColor: "#3498db", // Slightly Different Blue
    color: "white",
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
  footer: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
    textAlign: "center",
    fontSize: "12px",
    color: "#777",
  },
  twitterLogo: {
    width: "20px",
    height: "20px",
    marginLeft: "5px",
    verticalAlign: "middle",
  },
};

const TwitterLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.664-1.48 2.028-2.54-
.904.535-1.906.901-2.952 1.111-.847-.88-2.061-1.43-3.379-1.43-2.54 0-4.601 2.06-4.601 4.601 0 .36.041.71.113 1.055-3.825-.192-7.212-2.025-9.479-4.805-.497.842-.781 1.823-.781 2.834 0 1.591.812 2.994 2.043 3.826-.752-.023-1.462-.23-2.09-.636v.058c0 2.213 1.57 4.052 3.646 4.462-.379.103-.783.159-1.198.159-.291 0-.575-.03-.845-.087.574 1.81 2.257 3.122 4.241 3.159-1.557 1.21-3.53 1.948-5.687 1.948-.365 0-.726-.021-1.084-.062 2.062 1.314 4.511 2.081 7.14 2.081 8.569 0 13.255-7.098 13.255-13.254 0-.201-.005-.402-.014-.602.916-.66 1.705-1.478 2.323-2.414z"/>
    </svg>
);

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];

export default function DisperseUI() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [manualData, setManualData] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Function to Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to connect a wallet.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWalletAddress(await signer.getAddress());
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setManualData("");
    setData([]);
  };

  const parseData = (input) => {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      const parts = line.split(/[ ,=]+/);
      return { address: parts[0], amount: parseEther(parts[1]) };
    });
  };

  const handleManualInput = (event) => {
    setManualData(event.target.value);
    setData(parseData(event.target.value));
  };

  const handleSend = async () => {
    if (!walletAddress || !window.ethereum || data.length === 0) return;
    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const addresses = data.map(d => d.address);
      const amounts = data.map(d => d.amount);
      const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0n);

      const tx = await contract.disperse(addresses, amounts, { value: totalAmount });
      await tx.wait();
      alert("Transaction successful!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <Logo />
      </div>

      <h1 style={styles.heading}>Monad Disperser</h1>

      {/* ✅ Connect Wallet Button */}
      {!walletAddress ? (
        <button style={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div style={styles.walletInfo}>
          <p style={{ fontSize: "14px", color: "#777" }}>Connected: {walletAddress}</p>
          <button style={styles.disconnectButton} onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}

      {/*Conditionally rendering textarea for address and amount*/}
      {walletAddress && (
        <div>
          <label style={styles.label}>Recipients and amounts</label>
          <p style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
            Enter one address and amount in ETH on each line.
          </p>

          <Textarea
              placeholder={`Wallet Address, Amount\nWallet Address Amount\nWallet Address=Amount`}
            value={manualData}
            onChange={handleManualInput}
            style={styles.textarea}
          />
        </div>
      )}

      {data.length > 0 && (
        <div style={styles.parsedAddresses}>
          <h2 style={styles.parsedAddressesTitle}>Parsed Addresses</h2>
          <ul style={styles.parsedAddressList}>
            {data.map((d, i) => (
              <li key={i} style={styles.parsedAddressItem}>
                {d.address} - {formatEther(d.amount)} MON
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        style={styles.sendButton}
        onClick={handleSend}
        disabled={!walletAddress || loading || data.length === 0}
      >
        {loading ? "Send Tokens" : "Sending..."}
      </button>
    
       <footer style={styles.footer}>
          Created with love ❤️ by rolf
          <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
            <TwitterLogo style={styles.twitterLogo} />
          </a>
        </footer>
    </div>
  );
}
