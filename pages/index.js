import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, Contract, parseEther } from 'ethers'; // Corrected import
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/core'; // Correct import
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // From Vercel env
const ABI = [
  "function disperse(address[] recipients, uint256[] amounts) external payable"
];


function DisperseUI() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    const [recipients, setRecipients] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDisperse = async () => {
        if (!isConnected) {
            toast.error("Please connect your wallet.");
            return;
        }

        if (!recipients) {
            toast.error("Please enter recipient addresses and amounts.");
            return;
        }

        const lines = recipients.split('\n').map(line => line.trim()).filter(line => line);
        const addresses = [];
        const amounts = [];

        try {
            for (const line of lines) {
                const [address, amount] = line.split(',').map(item => item.trim());
                if (!ethers.isAddress(address)) {
                    throw new Error(`Invalid address: ${address}`);
                }
                const parsedAmount = parseEther(amount);
                addresses.push(address);
                amounts.push(parsedAmount);
            }

            if (addresses.length === 0) {
                throw new Error("No valid recipients found.");
            }
        } catch (error) {
            toast.error(`Invalid input: ${error.message}`);
            return;
        }

        setLoading(true);
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

            const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0n);

            const tx = await contract.disperse(addresses, amounts, { value: totalAmount });
            toast.promise(
                tx.wait(),
                {
                  pending: 'Transaction pending',
                  success: 'Transaction successful! Check your explorer',
                  error: 'Transaction failed'
                }
              )

           } catch (error) {
            console.error(error);
            toast.error(`Transaction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2em', color: '#c0392b' }}>disperse <span role="img" aria-label="emoji">😊</span></h1>
                <p style={{ fontSize: '1.1em', color: '#777' }}>verb distribute ether or tokens to multiple addresses</p>
            </header>

            <main style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '90%', maxWidth: '600px' }}>
                {isConnected ? (
                    <div>
                        <p>Connected to: {address}</p>
                        <textarea
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            placeholder="Enter recipient addresses and amounts (address, amount), one per line."
                            style={{ width: '100%', minHeight: '150px', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button
                            onClick={handleDisperse}
                            disabled={loading}
                            style={{ backgroundColor: '#2ecc71', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Dispersing...' : 'Disperse'}
                        </button>
                        <button onClick={disconnect} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>Connect to wallet</p>
                        <button onClick={() => connect()} style={{ backgroundColor: '#1abc9c', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Connect Wallet
                        </button>
                    </div>
                )}
            </main>
            <a href="https://telegram.org/" style={{ marginTop: '20px', color: '#3498db', textDecoration: 'none' }}>telegram</a>
        </div>
    );
}

export default DisperseUI;
