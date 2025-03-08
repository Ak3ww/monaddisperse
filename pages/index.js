import { useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/DisperseUI.module.css";

// Smart contract details
const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
    "function disperse(address[] recipients, uint256[] amounts) external payable",
];

// Monad Logo Component (Updated)
const MonadLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
        <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2ZM15.44 27.1492C13.5012 26.6183 8.28864 17.455 8.81704 15.5066C9.34544 13.5581 18.4634 8.31979 20.4021 8.8508C22.341 9.38173 27.5535 18.5449 27.0252 20.4934C26.4968 22.4418 17.3787 27.6802 15.44 27.1492Z" fill="#836EF9" />
    </svg>
);

// Twitter Logo (SVG)
const TwitterLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.658 4.658 0 002.046-2.569 9.205 9.205 0 01-2.91 1.112 4.604 4.604 0 00-7.847 4.19 13.058 13.058 0 01-9.448-4.79 4.606 4.606 0 001.424 6.15 4.568 4.568 0 01-2.085-.572v.058a4.61 4.61 0 003.693 4.517 4.575 4.575 0 01-2.079.08 4.61 4.61 0 004.3 3.192A9.241 9.241 0 010 19.541a12.988 12.988 0 007.025 2.06c8.42 0 13.027-7.026 13.027-13.127 0-.2-.006-.4-.014-.597a9.186 9.186 0 002.248-2.34z"/>
    </svg>
);

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // Handle dark mode toggle (Fixed)
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark-mode");
    };

    // Wallet Connection
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
        setTransactionHash(null);
    };

    // Parsing user input into address-amount pairs
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
        setTransactionHash(null);

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

            const addresses = data.map(d => d.address);
            const amounts = data.map(d => d.amount);
            const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0n);

            const tx = await contract.disperse(addresses, amounts, { value: totalAmount });
            const txReceipt = await tx.wait();

            const explorerUrl = `https://testnet.monadexplorer.com/tx/${txReceipt.hash}?tab=Internal+Txns`;
            setTransactionHash(txReceipt.hash);

            toast.success(
                <div>
                    Transaction successful! 
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                        View on Explorer
                    </a>
                </div>,
                { position: toast.POSITION.TOP_CENTER, autoClose: 5000 }
            );
        } catch (error) {
            console.error("Transaction Error:", error);
            toast.error(`Transaction failed: ${error.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <header className={styles.header}>
                <MonadLogo />
                <h2 className={styles.heading}>Monad Disperser</h2>
                <button className={styles.darkModeButton} onClick={toggleDarkMode}>
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </header>

            {!walletAddress ? (
                <button className={styles.button} onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div className={styles.walletInfo}>
                    <p>Connected: {walletAddress}</p>
                    <button className={styles.disconnectButton} onClick={disconnectWallet}>Disconnect</button>
                </div>
            )}

            {walletAddress && (
                <div>
                    <label className={styles.label}>Recipients and amounts</label>
                    <Textarea
                        placeholder={`0xf39Fd6e51f71033a1b5584204Cc305234DDb44 1.23\n0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 4.56`}
                        value={manualData}
                        onChange={handleManualInput}
                        className={styles.textarea}
                    />
                </div>
            )}

            {walletAddress && (
                <button className={styles.sendButton} onClick={handleSend} disabled={loading || data.length === 0}>
                    {loading ? "Sending..." : "Send Tokens"}
                </button>
            )}

            <footer className={styles.footer}>
                Created with love ❤️ by rolf
                <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                    <TwitterLogo />
                </a>
            </footer>
        </div>
    );
}
