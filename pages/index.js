import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Button, useWeb3Modal } from "@web3modal/react";

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];

export default function DisperseUI() {
  const [file, setFile] = useState(null);
  const [manualData, setManualData] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();

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
    if (!window.ethereum || data.length === 0) return;
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
      
      const explorerUrl = `https://testnet.monadexplorer.com/tx/${tx.hash}?tab=Internal+Txns`;
      toast.success(<a href={explorerUrl} target="_blank" rel="noopener noreferrer">Transaction successful! View on Explorer</a>, { autoClose: 8000 });
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Monad Token Disperser</h1>
      <p className="text-gray-600 text-center mb-6">Easily distribute MON tokens to multiple recipients.</p>

      <div className="mb-4 text-center">
        <Web3Button onClick={open} />
      </div>
      
      <label className="block font-semibold mb-2">Upload CSV File:</label>
      <Input type="file" onChange={handleFileUpload} className="mb-4" />
      
      <label className="block font-semibold mb-2">Or Enter Data Manually:</label>
      <Textarea 
        placeholder="Enter wallet addresses separated by space or comma, followed by the amount. Example:\n0x123...abc 10\n0x456...def 20"
        value={manualData} 
        onChange={handleManualInput} 
        className="mb-4 h-96 resize-none border-gray-300 border rounded-lg p-2 w-full text-sm"
      />
      
      {data.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <h2 className="font-semibold mb-2">Parsed Addresses</h2>
          <ul className="text-sm">
            {data.map((d, i) => (
              <li key={i} className="mb-1">{d.address} - {formatEther(d.amount)} MON</li>
            ))}
          </ul>
        </div>
      )}
      
      <Button onClick={handleSend} disabled={loading || data.length === 0} className="w-full py-3 text-lg font-semibold">
        {loading ? "Sending..." : "Send Tokens"}
      </Button>
    </div>
  );
}
