import React from 'react';

type Domain = {
  id: number;
  url: string;
};

type ApiSecurityModalProps = {
  domains: Domain[];
  selectedDomainId: number | '';
  onSelectDomain: (id: number | '') => void;
  endpoint: string;
  onSetEndpoint: (endpoint: string) => void;
  apiKey: string;
  onSetApiKey: (key: string) => void;
  requestLimit: number | ''; 
  onRequestLimitChange: (limit: number | '') => void;
  allowIpInput: string;
  onAllowIpChange: (ips: string) => void;
  disallowIpInput: string;
  onDisallowIpChange: (ips: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

const ApiSecurityModal: React.FC<ApiSecurityModalProps> = ({
  domains,
  selectedDomainId,
  onSelectDomain,
  endpoint,
  onSetEndpoint,
  apiKey,
  onSetApiKey,
  requestLimit,
  onRequestLimitChange,
  allowIpInput,
  onAllowIpChange,
  disallowIpInput,
  onDisallowIpChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>ตั้งค่า API Security</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="apiDomainSelect">เลือกโดเมน:</label>
            <select
              id="apiDomainSelect"
              value={selectedDomainId}
              onChange={(e) => onSelectDomain(Number(e.target.value))}
              required
            >
              <option value="">เลือกโดเมน</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.url}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="apiEndpoint">API Endpoint:</label>
            <input
              type="text"
              id="apiEndpoint"
              value={endpoint}
              onChange={(e) => onSetEndpoint(e.target.value)}
              placeholder="/api/users"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">API Key (ไม่บังคับ):</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => onSetApiKey(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requestLimit">จำกัดคำขอต่อนาที (ไม่บังคับ):</label>
            <input
              type="number"
              id="requestLimit"
              value={requestLimit}
              onChange={(e) => onRequestLimitChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="เช่น 100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="allowedIps">IP ที่อนุญาต (คั่นด้วยคอมมา):</label>
            <input
              type="text"
              id="allowedIps"
              value={allowIpInput}
              onChange={(e) => onAllowIpChange(e.target.value)}
              placeholder="เช่น 192.168.1.1, 10.0.0.5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="disallowedIps">IP ที่ไม่อนุญาต (คั่นด้วยคอมมา):</label>
            <input
              type="text"
              id="disallowedIps"
              value={disallowIpInput}
              onChange={(e) => onDisallowIpChange(e.target.value)}
              placeholder="เช่น 172.16.0.10, 8.8.8.8"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="api-protect-button">
              ป้องกัน API
            </button>
            <button type="button" onClick={onClose} className="modal-close-button">
              ยกเลิก
            </button>
          </div>
        </form>
        <button onClick={onClose} className="modal-close-x">X</button>
      </div>
    </div>
  );
};

export default ApiSecurityModal;