// pages/index.js

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, BigNumber } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Notification from '../components/Notification'; // ✅ Keeping Notification Component

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = ["function disperse(address[] recipients, uint256[] amounts) external payable"];

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fix Vercel Deployment (Ensure window.ethereum is accessed only on the client)
    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            console.log("Ethereum provider found.");
        }
    }, []);

    const connectWallet = async () => {
        if (typeof window === "undefined" || !window.ethereum) {
            toast.error("MetaMask is required.");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setWalletAddress(await signer.getAddress());
        } catch (error) {
            toast.error("Wallet connection failed.");
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
        setManualData("");
        setData([]);
    };

    const parseData = (input) => {
        return input.split("\n").map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length !== 2) return null;
            try {
                return { address: parts[0], amount: parseEther(parts[1]) };
            } catch {
                return null;
            }
        }).filter(Boolean);
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
            const totalAmount = amounts.reduce((acc, amount) => acc.add(amount), BigNumber.from(0));

            const tx = await contract.disperse(addresses, amounts, { value: totalAmount });
            toast.info("Transaction pending...");

            const receipt = await tx.wait();
            const txHash = receipt.hash; // ✅ Fix: Use correct transaction hash property
            const explorerUrl = `https://testnet.monadexplorer.com/tx/${txHash}`;

            // ✅ Display Clickable Notification with Transaction Hash
            toast.success(
                <div>
                    ✅ Transaction Successful!{" "}
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                        View on Monad Explorer
                    </a>
                </div>,
                { position: toast.POSITION.TOP_CENTER, autoClose: 5000 }
            );

        } catch (error) {
            toast.error(`Transaction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Notification>  {/* ✅ Keeping Your Original Notification Component */}
                <div style={{ padding: "30px", maxWidth: "650px", margin: "30px auto", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", fontFamily: 'Inter, sans-serif', color: "#333" }}>
                    <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "600", color: "#2c3e50" }}>Monad Disperser</h1>

                    {/* ✅ Wallet Connect Button (Restored) */}
                    {!walletAddress ? (
                        <button style={{ backgroundColor: "#836EF9", color: "white", padding: "10px 16px", borderRadius: "6px" }} onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    ) : (
                        <div>
                            <p>Connected: {walletAddress}</p>
                            <button style={{ backgroundColor: "#e74c3c", color: "white", padding: "10px 16px", borderRadius: "6px" }} onClick={disconnectWallet}>
                                Disconnect
                            </button>
                        </div>
                    )}

                    {walletAddress && (
                        <div>
                            <label>Recipients and amounts</label>
                            <Textarea
                                placeholder="0x123...abc 1.23\n0x456...def 4.56"
                                value={manualData}
                                onChange={handleManualInput}
                            />
                        </div>
                    )}

                    {data.length > 0 && (
                        <div>
                            <h2>Parsed Addresses</h2>
                            <ul>
                                {data.map((d, i) => (
                                    <li key={i}>
                                        {d.address} - {formatEther(d.amount)} MON
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {walletAddress && (
                        <button onClick={handleSend} disabled={loading || data.length === 0}>
                            {loading ? "Sending..." : "Send Tokens"}
                        </button>
                    )}

                    {/* ✅ Twitter Footer (Restored) */}
                    <footer style={{ marginTop: "30px", textAlign: "center" }}>
                        Created with ❤️ by Rolf
                        <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.664-1.48 2.028-2.54-0.904.535-1.906.901-2.952 1.111-0.847-.88-2.061-1.43-3.379-1.43-2.54 0-4.601 2.06-4.601 4.601 0 0.36 0.041 0.71 0.113 1.055-3.825-.192-7.212-2.025-9.479-4.805-0.497 0.842-0.781 1.823-0.781 2.834 0 1.591 0.812 2.994 2.043 3.826" />
                            </svg>
                        </a>
                    </footer>
                </div>
            </Notification>
        </div>
    );
}
