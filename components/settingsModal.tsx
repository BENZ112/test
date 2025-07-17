import React, { useState, useEffect } from "react";
import "../pages/style.css";
import type { Domain } from "../src/types/domain";

type Props = {
  domain: Domain;
  onSave: (updatedDomain: Domain) => void;
  onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ domain, onSave, onClose }) => {
  const [url, setUrl] = useState(domain.url);
  const [origin, setOrigin] = useState(domain.originServers[0] || "");
  const [sslType, setSslType] = useState<"auto" | "custom" | "none">(
    domain.sslType
  );
  const [wafEnabled, setWafEnabled] = useState(domain.wafEnabled);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrl(domain.url);
    setOrigin(domain.originServers[0] || "");
    setSslType(domain.sslType);
    setWafEnabled(domain.wafEnabled);
    setError(null);
  }, [domain]);
console.log("Domain in modal:", domain);

  const handleSave = async () => {
    setError(null);

    if (!url.trim()) {
      setError("โปรดระบุชื่อโดเมน");
      return;
    }
    if (!origin.trim()) {
      setError("โปรดระบุเซิร์ฟเวอร์ต้นทาง");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/updatedomain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain_id: domain.id, // Use domain_id key with your UUID
          domain_name: url.trim(), // Send domain name as domain_name
          origin_server: origin.trim(), // Send single origin server string
          ssl_type: sslType, // SSL type as string
          waf_engine_id: wafEnabled ? "waf_id_here" : null, // Map boolean to your waf_engine_id or null
        }),
      });

      console.log("Request body:", {
        domain_id: domain.id,
        domain_name: url.trim(),
        origin_server: origin.trim(),
        ssl_type: sslType,
        waf_engine_id: wafEnabled ? "waf_id_here" : null,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update domain");
      }

      const data = await response.json();
      onSave(data.domain);
      onClose();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>แก้ไขโดเมน: {domain.url}</h2>

        {error && (
          <p className="modal-error" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <label htmlFor="url">ชื่อโดเมน:</label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="modal-input"
          disabled={loading}
        />

        <label htmlFor="origin">เซิร์ฟเวอร์ต้นทาง:</label>
        <input
          id="origin"
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g., 192.168.1.100:80"
          className="modal-input"
          disabled={loading}
        />

        <label htmlFor="sslType">การจัดการ SSL/TLS:</label>
        <select
          id="sslType"
          value={sslType}
          onChange={(e) =>
            setSslType(e.target.value as "auto" | "custom" | "none")
          }
          className="modal-input"
          disabled={loading}
        >
          <option value="auto">เปิดใช้งาน SSL อัตโนมัติ (แนะนำ)</option>
          <option value="custom">อัปโหลด SSL ของคุณเอง</option>
          <option value="none">ไม่มี SSL (ไม่แนะนำ)</option>
        </select>

        <label className="checkbox-label" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            checked={wafEnabled}
            onChange={(e) => setWafEnabled(e.target.checked)}
            disabled={loading}
          />
          เปิดใช้งาน WAF สำหรับโดเมนนี้
        </label>

        <div className="modal-actions">
          <button
            onClick={onClose}
            className="modal-button modal-cancel-button"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="modal-button modal-confirm-button"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
