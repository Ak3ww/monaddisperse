import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];

export default function DisperseUI() {
  const [file, setFile] = useState(null);
  const [manualData, setManualData] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseData = (input) => {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      const parts = line.split(/[ ,]+/);
      return { address: parts[0], amount: ethers.utils.parseEther(parts[1]) };
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const addresses = data.map(d => d.address);
      const amounts = data.map(d => d.amount);
      const totalAmount = amounts.reduce((acc, amount) => acc.add(amount), ethers.BigNumber.from(0));

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
      <Input type="file" onChange={handleFileUpload} className="mb-4" />
      <Textarea 
        placeholder="Enter address and amount manually, separated by space or comma (one per line)"
        value={manualData} 
        onChange={handleManualInput} 
        className="mb-4"
      />
      {data.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <h2 className="font-semibold mb-2">Parsed Addresses</h2>
          <ul className="text-sm">
            {data.map((d, i) => (
              <li key={i}>{d.address} - {ethers.utils.formatEther(d.amount)} MON</li>
            ))}
          </ul>
        </div>
      )}
      <Button onClick={handleSend} disabled={loading || data.length === 0}>
        {loading ? "Sending..." : "Send Tokens"}
      </Button>
    </div>
  );
}
