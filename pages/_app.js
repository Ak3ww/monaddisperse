import { useState } from "react";
import '../styles/globals.css';
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Home() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const notifyTransaction = (txHash) => {
    toast.success(
      <a
        href={`https://testnet.monadexplorer.com/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        ✅ Transaction Completed! Click to View
      </a>
    );
  };

  const sendTransaction = async () => {
    if (!window.ethereum) {
      toast.error("No Ethereum provider found!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount),
      });

      toast.info("Transaction sent, waiting for confirmation...");
      await tx.wait();

      notifyTransaction(tx.hash);
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
      <h1 className="text-2xl font-bold">Monad Batch Transfer</h1>
      <Input
        type="text"
        placeholder="Recipient Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Amount (in MON)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={sendTransaction}>Send MON</Button>
    </div>
  );
}
