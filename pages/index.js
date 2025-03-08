// pages/index.js

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Dark Mode Toggle Icons
const SunIcon = () => <span style={{ fontSize: "20px" }}>☀️</span>;
const MoonIcon = () => <span style={{ fontSize: "20px" }}>🌙</span>;

// ✅ Logo SVG
const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
    <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2Z" fill="#836EF9" />
  </svg>
);

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = ["function disperse(address[] recipients, uint256[] amounts) external payable"];

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return typeof window !== "undefined" && localStorage.getItem("theme") === "dark";
    });

    // ✅ Apply Dark Mode Preference
    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "#222" : "#fff";
        document.body.style.color = darkMode ? "#fff" : "#000";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

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
        <div style={{ padding: "30px", maxWidth: "650px", margin: "30px auto", borderRadius: "12px", textAlign: "center" }}>
            {/* ✅ Header (Logo + Dark Mode Button) */}
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Logo />
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                        padding: "5px",
                    }}
                >
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </header>

            <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "20px", color: darkMode ? "#fff" : "#2c3e50" }}>Monad Disperser</h1>

            {/* ✅ Connect Wallet Button */}
            {!walletAddress ? (
                <button style={{ padding: "10px 16px", backgroundColor: "#836EF9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" }} onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <p>Connected: {walletAddress}</p>
            )}

            {/* ✅ Textarea for Addresses */}
            {walletAddress && (
                <div>
                    <label>Recipients and amounts</label>
                    <Textarea
                        placeholder="0x123...abc 1.23\n0x456...def 4.56"
                        value={manualData}
                        onChange={(e) => setManualData(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                            minHeight: "180px",
                            resize: "vertical",
                            boxSizing: "border-box",
                            backgroundColor: darkMode ? "#444" : "#fff",
                            color: darkMode ? "#fff" : "#000"
                        }}
                    />
                </div>
            )}

            {/* ✅ Send Button */}
            {walletAddress && (
                <button
                    style={{
                        padding: "12px 18px",
                        backgroundColor: "#3498db",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "100%",
                    }}
                    onClick={handleSend}
                    disabled={loading || data.length === 0}
                >
                    {loading ? "Sending..." : "Send Tokens"}
                </button>
            )}

            {/* ✅ Footer */}
            <footer style={{ marginTop: "30px", fontSize: "12px", color: darkMode ? "#bbb" : "#777" }}>
                Created with love ❤️ by Rolf
            </footer>
        </div>
    );
}
