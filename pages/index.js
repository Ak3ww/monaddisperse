// pages/index.js

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Notification from '../components/Notification'; // ✅ Keeping Your Notification Component

// ✅ Keep Original Logo
const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
        <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2Z" fill="#836EF9" />
    </svg>
);

// ✅ Keep Original Styles
const styles = {
    container: {
        padding: "30px",
        maxWidth: "650px",
        margin: "30px auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        fontFamily: 'Inter, sans-serif',
        color: "#333",
    },
    button: {
        backgroundColor: "#836EF9",
        color: "white",
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
    },
    sendButton: {
        backgroundColor: "#3498db",
        color: "white",
        padding: "12px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        width: "100%",
    },
};

// ✅ Keep Twitter Logo
const TwitterLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.664-1.48 2.028-2.54-0.904.535-1.906.901-2.952 1.111-0.847-.88-2.061-1.43-3.379-1.43-2.54 0-4.601 2.06-4.601 4.601 0 0.36 0.041 0.71 0.113 1.055" />
    </svg>
);

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = ["function disperse(address[] recipients, uint256[] amounts) external payable"];

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fix Vercel Deployment Issue
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
            toast.info("Transaction pending...");

            const receipt = await tx.wait();
            const txHash = receipt.hash;
            const explorerUrl = `https://testnet.monadexplorer.com/tx/${txHash}`;

            // ✅ Show Clickable Success Notification
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
            <Notification>  {/* ✅ Keep Notification Wrapper */}
                <div style={styles.container}>
                    {/* ✅ Keep Logo */}
                    <div style={{ textAlign: "center", marginBottom: "25px" }}>
                        <Logo />
                    </div>

                    <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "600", color: "#2c3e50" }}>Monad Disperser</h1>

                    {/* ✅ Restore Wallet Connect Button */}
                    {!walletAddress ? (
                        <button style={styles.button} onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    ) : (
                        <div>
                            <p>Connected: {walletAddress}</p>
                        </div>
                    )}

                    {/* ✅ Restore Input Fields */}
                    {walletAddress && (
                        <div>
                            <label>Recipients and amounts</label>
                            <Textarea
                                placeholder="0x123...abc 1.23\n0x456...def 4.56"
                                value={manualData}
                                onChange={(e) => setManualData(e.target.value)}
                            />
                        </div>
                    )}

                    {/* ✅ Restore Send Button */}
                    {walletAddress && (
                        <button style={styles.sendButton} onClick={handleSend} disabled={loading || data.length === 0}>
                            {loading ? "Sending..." : "Send Tokens"}
                        </button>
                    )}

                    {/* ✅ Restore Footer */}
                    <footer style={{ marginTop: "30px", textAlign: "center" }}>
                        Created with ❤️ by Rolf
                        <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                            <TwitterLogo />
                        </a>
                    </footer>
                </div>
            </Notification>
        </div>
    );
}
