// pages/index.js

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, BigNumber } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Prevents Vercel from crashing due to SSR (Server-Side Rendering)
useEffect(() => {
  if (typeof window !== "undefined" && window.ethereum) {
    console.log("Ethereum provider found.");
  }
}, []);

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = ["function disperse(address[] recipients, uint256[] amounts) external payable"];

// ✅ Twitter Logo Component
const TwitterLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.664-1.48 2.028-2.54-.904.535-1.906.901-2.952 1.111-.847-.88-2.061-1.43-3.379-1.43-2.54 0-4.601 2.06-4.601 4.601 0 .36.041.71.113 1.055-3.825-.192-7.212-2.025-9.479-4.805-.497.842-.781 1.823-.781 2.834 0 1.591.812 2.994 2.043 3.826-.752-.023-1.462-.23-2.09-.636v.058c0 2.213 1.57 4.052 3.646 4.462-.379.103-.783.159-1.198.159-.291 0-.575-.03-.845-.087.574 1.81 2.257 3.122 4.241 3.159-1.557 1.21-3.53 1.948-5.687 1.948-.365 0-.726-.021-1.084-.062 2.062 1.314 4.511 2.081 7.14 2.081 8.569 0 13.255-7.098 13.255-13.254 0-.201-.005-.402-.014-.602.916-.66 1.705-1.478 2.323-2.414z" />
    </svg>
);

// ✅ Header Logo Component
const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
        <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2Z" fill="#836EF9" />
    </svg>
);

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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
            const totalAmount = amounts.reduce((acc, amount) => acc.add(amount), BigNumber.from(0));

            const tx = await contract.disperse(addresses, amounts, { value: totalAmount });
            toast.info("Transaction pending...");

            const receipt = await tx.wait();
            const txHash = receipt.transactionHash;
            const explorerUrl = `https://testnet.monadexplorer.com/tx/${txHash}`;

            toast.success(
                <div>
                    ✅ Transaction Successful!{" "}
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                        View on Monad Explorer
                    </a>
                </div>
            );
        } catch (error) {
            toast.error(`Transaction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "650px", margin: "30px auto", backgroundColor: "#fff", borderRadius: "12px" }}>
            {/* ✅ Logo */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <Logo />
            </div>

            <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "600", color: "#2c3e50" }}>Monad Disperser</h1>

            {!walletAddress ? (
                <button style={{ backgroundColor: "#836EF9", color: "white", padding: "10px 16px", borderRadius: "6px" }} onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p>Connected: {walletAddress}</p>
                </div>
            )}

            {/* ✅ Twitter Footer */}
            <footer style={{ marginTop: "30px", textAlign: "center" }}>
                Created with ❤️ by Rolf
                <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                    <TwitterLogo />
                </a>
            </footer>
        </div>
    );
}
