import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];

export default function DisperseUI() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [file, setFile] = useState(null);
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

  const parseData = (input) => {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      const parts = line.split(/[ ,]+/);
      return { address: parts[0], amount: parseEther(parts[1]) };
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setData(parseData(e.target.result));
    };
    reader.readAsText(file);
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Monad Token Disperser</h1>

      {/* ✅ Connect Wallet Button */}
      {!walletAddress ? (
        <Button onClick={connectWallet} className="mb-4">
          Connect Wallet
        </Button>
      ) : (
        <p className="mb-4 text-sm">Connected: {walletAddress}</p>
      )}

      <Input type="file" onChange={handleFileUpload} className="mb-4" />
      <Textarea
        placeholder="Enter address and amount manually, separated by space or comma (one per line)"
        value={manualData}
        onChange={handleManualInput}
        className="mb-4"
        style={{ height: '500px', minHeight: '400px', width: '100%' }}  // Increased height!
      />

      {data.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <h2 className="font-semibold mb-2">Parsed Addresses</h2>
          <ul className="text-sm">
            {data.map((d, i) => (
              <li key={i}>{d.address} - {formatEther(d.amount)} MON</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={handleSend} disabled={!walletAddress || loading || data.length === 0}>
        {loading ? "Sending..." : "Send Tokens"}
      </Button>
    </div>
  );
}
