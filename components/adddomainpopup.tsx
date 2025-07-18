import React, { useState } from "react";
import "../pages/style.css";

export type AddDomainFormData = {
  url: string;
  originServer: string;
  sslChoice: "auto" | "custom" | "none";
  customSslCert?: File | undefined;
  customSslKey?: File | undefined;
};

export type DnsInstructions = {
  type: "CNAME" | "A";
  value: string;
  expectedIp?: string;
};

type Props = {
  onAdd: (data: AddDomainFormData) => Promise<DnsInstructions | null>;
  onClose: () => void;
};

const AddDomainModal: React.FC<Props> = ({ onAdd, onClose }) => {
  const [domainUrl, setDomainUrl] = useState("");
  const [originServer, setOriginServer] = useState("");
  const [sslChoice, setSslChoice] = useState<"auto" | "custom" | "none">(
    "auto"
  );
  const [customSslCert, setCustomSslCert] = useState<File | undefined>(
    undefined
  );
  const [customSslKey, setCustomSslKey] = useState<File | undefined>(undefined);

  const [dnsInstructions, setDnsInstructions] =
    useState<DnsInstructions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!domainUrl.trim() || !originServer.trim()) {
      setError("โปรดกรอกชื่อโดเมนและเซิร์ฟเวอร์ต้นทาง");
      return;
    }

    setIsLoading(true);

    try {
      const formData: AddDomainFormData = {
        url: domainUrl.trim(),
        originServer: originServer.trim(),
        sslChoice: sslChoice,
        customSslCert: customSslCert,
        customSslKey: customSslKey,
      };
      const instructions = await onAdd(formData);
      if (instructions) {
        setDnsInstructions(instructions);
      } else {
        setError("ไม่สามารถเพิ่มโดเมนได้. โปรดลองอีกครั้ง.");
        onClose();
      }
    } catch (err) {
      console.error("Error adding domain:", err);
      setError("เกิดข้อผิดพลาดในการเพิ่มโดเมน");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedEngines, setSelectedEngines] = useState<string[]>([
    "modsecurity",
  ]);
  const availableEngines = [
    { id: "modsecurity", name: "ModSecurity", enabled: true },
    { id: "cloudshield", name: "CloudShield WAF", enabled: true },
    { id: "naxsi", name: "NAXSI", enabled: false },
  ];
  const enabledEngines = availableEngines.filter((e) => e.enabled);

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          {!dnsInstructions ? (
            <>
              <h2>Add Website Address</h2>
              {error && (
                <p className="modal-error" style={{ color: "red" }}>
                  {error}
                </p>
              )}
              <label className="adddomain-label" htmlFor="domainUrl">
                Domain Name:
              </label>
              <input
                id="domainUrl"
                type="text"
                placeholder="https://example.com"
                value={domainUrl}
                onChange={(e) => setDomainUrl(e.target.value)}
                className="modal-input"
              />

              <label className="adddomain-label" htmlFor="originServer">
                Origin Server (IP or Hostname:Port):
              </label>
              <input
                id="originServer"
                type="text"
                placeholder="e.g., 192.168.1.100:80 or myapp.internal:443"
                value={originServer}
                onChange={(e) => setOriginServer(e.target.value)}
                className="modal-input"
              />

              <label className="adddomain-label" htmlFor="sslChoice">
                SSL/TLS Management:
              </label>
              <select
                id="sslChoice"
                value={sslChoice}
                onChange={(e) =>
                  setSslChoice(e.target.value as "auto" | "custom" | "none")
                }
                className="modal-input"
              >
                <option value="auto">Enable Automatic SSL (Recommended)</option>
                <option value="custom">Upload Your Own SSL</option>
                <option value="none">No SSL (Not Recommended)</option>
              </select>

              {sslChoice === "custom" && (
                <>
                  <label htmlFor="customSslCert">
                    SSL Certificate File (.crt/.pem):
                  </label>
                  <input
                    id="customSslCert"
                    type="file"
                    accept=".crt,.pem"
                    onChange={(e) => setCustomSslCert(e.target.files?.[0])}
                    className="modal-input"
                  />
                  <label htmlFor="customSslKey">
                    SSL Private Key File (.key):
                  </label>
                  <input
                    id="customSslKey"
                    type="file"
                    accept=".key"
                    onChange={(e) => setCustomSslKey(e.target.files?.[0])}
                    className="modal-input"
                  />
                </>
              )}

              <div>
                <label className="adddomain-label">WAF Engines:</label>
                <div
                  className="radio-group"
                  style={{ display: "flex", gap: "50px" }}
                >
                  {enabledEngines.map((engine) => (
                    <label
                      key={engine.id}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        value={engine.id}
                        checked={selectedEngines[0] === engine.id}
                        onChange={(e) => {
                          setSelectedEngines([e.target.value]);
                        }}
                        style={{ marginRight: "8px" }} // Added margin to the right of the radio button
                      />
                      {engine.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={onClose}
                  className="modal-button modal-cancel-button"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="modal-button modal-confirm-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
              </div>
            </>
          ) : (
            <div className="dns-instructions-step">
              <h2>Next Step: Configure DNS</h2>
              <p>
                Your domain is being set up. Please update your DNS records as
                follows:
              </p>

              <div className="dns-record-box">
                <p>
                  <strong>Type:</strong> {dnsInstructions.type}
                </p>
                <p>
                  <strong>Name/Host:</strong>{" "}
                  {domainUrl.replace(/^(https?:\/\/)?(www\.)?/, "")}
                </p>
                <p>
                  <strong>Value/Target:</strong>{" "}
                  <code>{dnsInstructions.value}</code>
                </p>
                {dnsInstructions.expectedIp && (
                  <p>
                    <strong>IP (for A record):</strong>{" "}
                    <code>{dnsInstructions.expectedIp}</code>
                  </p>
                )}
              </div>

              <p className="dns-note">
                **Important:** DNS changes can take some time (up to 48 hours)
                to propagate globally. You will see your domain status change to
                "Active" once detected.
              </p>

              <div className="modal-actions">
                <button
                  onClick={onClose}
                  className="modal-button modal-confirm-button"
                >
                  Got it
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddDomainModal;
