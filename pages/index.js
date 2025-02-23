import { useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];

export default function DisperseApp() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [manualData, setManualData] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required.");
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

  const handleManualInput = (event) => {
    setManualData(event.target.value);
    setData(parseData(event.target.value));
  };

  const handleSend = async () => {
    if (!walletAddress || data.length === 0) return;
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Monad Token Disperser</h1>
        {!walletAddress ? (
          <button onClick={connectWallet} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Connect Wallet
          </button>
        ) : (
          <p className="text-sm text-gray-600 mb-4 text-center">Connected: {walletAddress}</p>
        )}

        <textarea
          placeholder="Enter addresses & amounts (one per line)"
          value={manualData}
          onChange={handleManualInput}
          className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mt-4"
        />

        {data.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 border rounded-md">
            <h2 className="text-sm font-semibold mb-2">Recipients</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              {data.map((d, i) => (
                <li key={i} className="flex justify-between">
                  <span>{d.address}</span>
                  <span>{formatEther(d.amount)} MON</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!walletAddress || loading || data.length === 0}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send Tokens"}
        </button>
      </div>
    </div>
  );
}
