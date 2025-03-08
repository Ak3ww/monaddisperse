import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../styles/DisperseUI.module.css"; // ✅ Added missing styles import

const CONTRACT_ADDRESS = "0xf662457b7902f302aed42825878c76f8e82a2bbe";
const ABI = [
    "function disperse(address[] recipients, uint256[] amounts) external payable"
];

console.log("Styles object:", styles);

// ✅ Fixed: Define Logo Component
const Logo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
    >
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
    </svg>
);

export default function DisperseUI() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [manualData, setManualData] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);

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
                    Transaction successful! View on Monad Explorer:
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                        View on Explorer
                    </a>
                </div>,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                }
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
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <Logo />
            </div>

            <h1 className={styles.heading}>Monad Disperser</h1>

            {!walletAddress ? (
                <button className={styles.button} onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div className={styles.walletInfo}>
                    <p style={{ fontSize: "14px", color: "#777" }}>Connected: {walletAddress}</p>
                    <button className={styles.disconnectButton} onClick={disconnectWallet}>Disconnect</button>
                </div>
            )}

            {walletAddress && (
                <div>
                    <label className={styles.label}>Recipients and amounts</label>
                    <p style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
                        Enter one address and amount in MON on each line.
                    </p>

                    <Textarea
                        placeholder={`0xf39Fd6e51f71033a1b5584204Cc305234DDb44 1.23\n0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 4.56\n0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC=7.89`}
                        value={manualData}
                        onChange={handleManualInput}
                        className={styles.textarea}
                    />
                </div>
            )}

            {data.length > 0 && (
                <div className={styles.parsedAddresses}>
                    <h2 className={styles.parsedAddressesTitle}>Parsed Addresses</h2>
                    <ul className={styles.parsedAddressList}>
                        {data.map((d, i) => (
                            <li key={i} className={styles.parsedAddressItem}>
                                {d.address} - {formatEther(d.amount)} MON
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {walletAddress && (
                <>
                    <button
                        className={styles.sendButton}
                        onClick={handleSend}
                        disabled={loading || data.length === 0}
                    >
                        {loading ? "Sending..." : "Send Tokens"}
                    </button>

                    {/* ✅ Display Transaction Hash */}
                    {transactionHash && (
                        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
                            ✅ Transaction Submitted:{" "}
                            <a
                                href={`https://testnet.monadexplorer.com/tx/${transactionHash}?tab=Internal+Txns`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}
                            >
                                View on Explorer
                            </a>
                        </p>
                    )}
                </>
            )}

            <footer className={styles.footer}>
                Created with love ❤️ by rolf
                <a href="https://twitter.com/0xRolf" target="_blank" rel="noopener noreferrer">
                    <TwitterLogo className={styles.twitterLogo} />
                </a>
            </footer>
        </div>
    );
}
