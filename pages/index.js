import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Dark Mode Icons
const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 3v2m0 14v2m4.22-15.78l1.42 1.42M4.36 19.64l1.42-1.42M19 12h2m-16 0H3m12.78 4.22l1.42 1.42M6.64 6.64l1.42 1.42"></path>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1"></path>
  </svg>
);

// ✅ Monad Logo in Header
const Logo = () => (
  <a href="https://monad.xyz">
    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="36" viewBox="0 0 174 36" fill="none">
      <path d="M17.921 2C13.3234 2 2 13.3792 2 17.9999C2 22.6206 13.3234 34 17.921 34C22.5186 34 33.8422 22.6204 33.8422 17.9999C33.8422 13.3794 22.5188 2 17.921 2Z" fill="#836EF9" />
    </svg>
  </a>
);

// ✅ Smart Contract Details
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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

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

  return (
    <div style={{ padding: "30px", maxWidth: "650px", margin: "30px auto", borderRadius: "12px", textAlign: "center" }}>
      {/* ✅ Header with Logo and Dark Mode Toggle */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <Logo />
        <button onClick={toggleDarkMode} style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "20px", color: darkMode ? "#fff" : "#2c3e50" }}>
        Monad Disperser
      </h1>

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
              color: darkMode ? "#fff" : "#000",
            }}
          />
        </div>
      )}

      {/* ✅ Footer */}
      <footer style={{ marginTop: "30px", fontSize: "12px", color: darkMode ? "#bbb" : "#777" }}>
        Created with ❤️ by Rolf
      </footer>
    </div>
  );
}
