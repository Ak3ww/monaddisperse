import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../styles/DisperseUI.module.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
    "function disperse(address[] recipients, uint256[] amounts) external payable"
];

// ✅ Monad Logo SVG
const MonadLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
        <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2ZM15.44 27.1492C13.5012 26.6183 8.28864 17.455 8.81704 15.5066C9.34544 13.5581 18.4634 8.31979 20.4021 8.8508C22.341 9.38173 27.5535 18.5449 27.0252 20.4934C26.4968 22.4418 17.3787 27.6802 15.44 27.1492Z" fill="#836EF9" />
        <path d="M57.2952 21.5466V21.5407L48.2488 4.77274C48.0707 4.44268 47.5786 4.52173 47.5117 4.89112L43.0065 29.7945C42.9623 30.0385 43.1489 30.2632 43.3957 30.2632H46.8814C47.0727 30.2632 47.2365 30.1257 47.2707 29.9366L49.8943 15.4059L56.9464 28.9168C57.0945 29.2006 57.4989 29.2006 57.6471 28.9168L64.6991 15.4059L67.3227 29.9366C67.3569 30.1257 67.5207 30.2632 67.712 30.2632H71.1977C71.4445 30.2632 71.6311 30.0385 71.5869 29.7945L67.0817 4.89112C67.0149 4.52173 66.5227 4.44268 66.3446 4.77274L57.2952 21.5466Z" fill="black" />
    </svg>
);

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('darkMode', !isDarkMode ? 'enabled' : 'disabled');
    };

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

    return (
        <div className={`${inter.className} ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* ✅ Header with Monad Logo & Dark Mode Toggle */}
            <header className={styles.header}>
                <MonadLogo />
                <button className={styles.darkModeToggle} onClick={toggleDarkMode}>
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </header>

            {/* ✅ Existing UI remains unchanged */}
            <div className={styles.container}>
                <h1 className={styles.heading}>Monad Disperser</h1>

                {!walletAddress ? (
                    <button className={styles.button} onClick={connectWallet}>
                        Connect Wallet
                    </button>
                ) : (
                    <div className={styles.walletInfo}>
                        <p style={{ fontSize: "14px", color: "#777" }}>Connected: {walletAddress}</p>
                        <button className={styles.disconnectButton} onClick={() => setWalletAddress(null)}>Disconnect</button>
                    </div>
                )}

                <footer className={styles.footer}>
                    Created with love ❤️ by rolf
                    <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M23.643 4.937a10.015 10.015 0 01-2.825.775 4.948 4.948 0 002.165-2.723 9.72 9.72 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.64 3.16a4.902 4.902 0 001.523 6.573 4.903 4.903 0 01-2.229-.616v.061a4.924 4.924 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.927 4.927 0 004.6 3.417 9.868 9.868 0 01-6.102 2.104c-.396 0-.779-.023-1.161-.067a13.933 13.933 0 007.548 2.213c9.056 0 14.01-7.497 14.01-13.986 0-.213-.006-.425-.016-.637a9.935 9.935 0 002.457-2.548z" />
                        </svg>
                    </a>
                </footer>
            </div>
        </div>
    );
}
