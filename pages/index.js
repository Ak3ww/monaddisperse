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

// Monad Logo Component
const MonadLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
        <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2ZM15.44 27.1492C13.5012 26.6183 8.28864 17.455 8.81704 15.5066C9.34544 13.5581 18.4634 8.31979 20.4021 8.8508C22.341 9.38173 27.5535 18.5449 27.0252 20.4934C26.4968 22.4418 17.3787 27.6802 15.44 27.1492Z" fill="#836EF9" />
        <text x="40" y="25" fontFamily="Inter" fontSize="24" fill="black">MONAD</text>
    </svg>
);

// Twitter Logo SVG
const TwitterLogo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={styles.twitterIcon}
    >
        <path d="M23.643 4.937a9.583 9.583 0 0 1-2.828.775 4.936 4.936 0 0 0 2.165-2.723 9.864 9.864 0 0 1-3.127 1.2 4.92 4.92 0 0 0-8.384 4.482A13.945 13.945 0 0 1 1.671 3.15a4.908 4.908 0 0 0-.666 2.475c0 1.708.87 3.217 2.188 4.103a4.904 4.904 0 0 1-2.228-.616v.061a4.921 4.921 0 0 0 3.946 4.827 4.932 4.932 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.417A9.867 9.867 0 0 1 .96 20.29 13.913 13.913 0 0 0 7.548 22c9.142 0 14.307-7.721 14.307-14.422 0-.22-.005-.437-.014-.653a10.235 10.235 0 0 0 2.502-2.588z" />
    </svg>
);

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // Handle dark mode toggle
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <header className={styles.header}>
                <MonadLogo />
                <h1 className={styles.heading}>Monad Disperser</h1>
                <button className={styles.darkModeButton} onClick={toggleDarkMode}>
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </header>

            {/* (Everything else remains unchanged) */}

            <footer className={styles.footer}>
                <p>
                    Created with love ❤️ by 
                    <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer"> rolf</a>
                    <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                        <TwitterLogo />
                    </a>
                </p>
            </footer>
        </div>
    );
}
