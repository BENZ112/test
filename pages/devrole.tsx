"use client";
import "../pages/style.css";
import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import Navbar from "../components/defnav";
import type { Domain } from "../src/types/domain";
import AddDomainModal from "../components/adddomainpopup";
import type {
  AddDomainFormData,
  DnsInstructions,
} from "../components/adddomainpopup";
import SettingsModal from "../components/settingsModal";
import ApiSecurityModal from "../components/apiSecurityModal";

import Navbar8 from "../components/headerDev";
import Footer4 from "../components/footer4.js";

type User = {
  id: number;
  username: string;
  name?: string;
};

type AttackLog = {
  id: number;
  timestamp: string;
  domainUrl: string;
  attackType: string;
  sourceIp: string;
  status: "blocked" | "detected";
  details?: string;
};

type Vulnerability = {
  id: number;
  name: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  description: string;
  url: string;
};

type ProtectedApi = {
  id: number;
  domainId: number;
  domainUrl: string;
  endpoint: string;
  apiKey: string;
  protectionEnabled: boolean;
  protectedAt: string;
  requestLimit: number | null; // New: Limit the number of web requests
  allowedIps: string[]; // New: IPs allowed
  disallowedIps: string[]; // New: IPs not allowed
};

type ThreatDataType = {
  month: string;
  sqlInjection: number;
  xss: number;
  csrf: number;
  ddos: number;
  bruteForce: number;
  sslAttack: number;
};

const Home: React.FC = () => {
  const SampleNavigation = () => {
    window.location.href = "/";
  };

  /*  login system */
  const [user, setUser] = useState<User | null>(null);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("loggedInUser");
      }
    }
  }, []);

  /*  domain */
  const [domains, setDomains] = useState<Domain[]>([]);
  useEffect(() => {
    if (!user) return;

    const fetchDomains = async () => {
      try {
        const res = await fetch("/api/getdomains?user_id=" + user.id);

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", res.status, text);
          return;
        }

        const data = await res.json();
        const fetchedDomains = (data.domains || []).map((dbDomain: any) => ({
          id: dbDomain.id,
          url: dbDomain.domain_name,
          status: "pending_dns", // default for now or map if stored
          originServers: ["1.2.3.4"], // default or pull from db if you store it
          sslType: "auto", // or dbDomain.ssl_type
          sslStatus: "pending", // or dbDomain.ssl_status
          dnsInstructions: {
            type: "CNAME",
            value: `proxy-${Math.random()
              .toString(36)
              .substring(7)}.yourwaf.com`,
            expectedIp: "123.45.67.89",
          },
          wafEnabled: true,
        }));

        setDomains(fetchedDomains);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();

    setVisible(true);
    setFadeOut(false);

    const fadeTimer = setTimeout(() => setFadeOut(true), 4500);
    const hideTimer = setTimeout(() => setVisible(false), 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [user]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowsettingsModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const handleAddDomain = async (data: AddDomainFormData): Promise<null> => {
    if (!user) return null;

    const res = await fetch("/api/adddomains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        domain_name: data.url,
        registered_date: new Date().toISOString().split("T")[0],
        waf_engine_id: "modsecurity",
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      alert(result.message || "Failed to add domain.");
      return null;
    }

    alert("Domain added successfully.");
    const newDomain: Domain = {
      id: Date.now(),
      url: data.url,
      status: "pending_dns",
      originServers: [data.originServer],
      sslType: data.sslChoice,
      sslStatus:
        data.sslChoice === "auto"
          ? "pending"
          : data.sslChoice === "custom"
          ? "awaiting_upload"
          : "inactive",
      dnsInstructions: {
        type: "CNAME",
        value: `proxy-${Math.random().toString(36).substring(7)}.yourwaf.com`,
        expectedIp: "123.45.67.89",
      },
      wafEnabled: true,
    };

    setDomains((prev) => [...prev, newDomain]);
    return null;
  };

  const handleDeleteDomain = (id: number) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโดเมนนี้?")) {
      setDomains((prevDomains) =>
        prevDomains.filter((domain) => domain.id !== id)
      );
    }
  };
  const handleUpdateDomain = (updatedDomain: Domain) => {
    setDomains((prevDomains) =>
      prevDomains.map((domain) =>
        domain.id === updatedDomain.id ? updatedDomain : domain
      )
    );
    setShowsettingsModal(false);
    setSelectedDomain(null);
  };
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);
  const openSettingsModal = (domain: Domain) => {
    console.log("Selected domain to edit:", selectedDomain);
    setSelectedDomain(domain);
    setShowsettingsModal(true);
  };
  const closeSettingsModal = () => {
    setShowsettingsModal(false);
    setSelectedDomain(null);
  };

  /*  Scan  */
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Vulnerability[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setScanResults([]);
    setTimeout(() => {
      const detectedVulnerabilities: Vulnerability[] = [];
      const randomCount = Math.floor(Math.random() * 5) + 1; // สุ่มจำนวนช่องโหว่ 1-5

      for (let i = 0; i < randomCount; i++) {
        const severityOptions: Vulnerability["severity"][] = [
          "Critical",
          "High",
          "Medium",
          "Low",
          "Informational",
        ];
        const randomSeverity =
          severityOptions[Math.floor(Math.random() * severityOptions.length)];
        const vulnerableUrls = domains
          .filter((d) => d.status === "active")
          .map((d) => d.url);
        const randomUrl =
          vulnerableUrls[Math.floor(Math.random() * vulnerableUrls.length)] ||
          "https://your-app-default.com";

        detectedVulnerabilities.push({
          id: Date.now() + i,
          name: `Sample Vulnerability ${i + 1}`,
          severity: randomSeverity,
          description: `Detected a ${randomSeverity} vulnerability on ${randomUrl}/param${i}.`,
          url: randomUrl,
        });
      }

      setScanResults(detectedVulnerabilities);
      setLastScanTime(new Date().toLocaleString());
      setIsScanning(false);
    }, 3000);
  };

  /*  API  */
  const [showApiSecurityModal, setShowApiSecurityModal] = useState(false);
  const [key, setKey] = useState("");
  const [selectedApiDomainId, setSelectedApiDomainId] = useState<number | "">(
    ""
  );
  const [requestLimit, setRequestLimit] = useState<number | "">("");
  const [allowIpInput, setAllowIpInput] = useState<string>("");
  const [disallowIpInput, setDisallowIpInput] = useState<string>("");
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [protectedApis, setProtectedApis] = useState<ProtectedApi[]>([]);
  const [apiProtectionMessage, setApiProtectionMessage] = useState<
    string | null
  >(null);

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedApiDomainId || !endpoint) {
      setApiProtectionMessage("กรุณาเลือกโดเมนและระบุ API Endpoint ให้ครบถ้วน");
      return;
    }

    const domain = domains.find((d) => d.id === selectedApiDomainId);
    if (!domain) {
      setApiProtectionMessage("โดเมนที่เลือกไม่ถูกต้อง");
      return;
    }

    const parsedAllowedIps = allowIpInput
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== "");
    const parsedDisallowedIps = disallowIpInput
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== "");

    const newProtectedApi: ProtectedApi = {
      id: Date.now(),
      domainId: selectedApiDomainId as number,
      domainUrl: domain.url,
      endpoint: endpoint,
      apiKey: apiKey,
      protectionEnabled: true,
      protectedAt: new Date().toLocaleString(),
      requestLimit: requestLimit === "" ? null : Number(requestLimit),
      allowedIps: parsedAllowedIps,
      disallowedIps: parsedDisallowedIps,
    };

    setProtectedApis((prev) => [...prev, newProtectedApi]);
    setApiProtectionMessage(
      `API Endpoint "${endpoint}" บนโดเมน "${domain.url}" ได้รับการป้องกันแล้ว!`
    );

    setSelectedApiDomainId("");
    setEndpoint("");
    setApiKey("");
    setRequestLimit("");
    setAllowIpInput("");
    setDisallowIpInput("");

    setShowApiSecurityModal(false);

    setTimeout(() => {
      setApiProtectionMessage(null);
    }, 5000);
  };

  /*  Honey Pot  */
  const [log, setLog] = useState<string[]>([]);

  /*  Dashboard */
  const [attackLogs, setAttackLogs] = useState<AttackLog[]>([]);

  useEffect(() => {
    const initialAttackLogs: AttackLog[] = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        domainUrl: "https://example.com",
        attackType: "SQL Injection",
        sourceIp: "103.24.56.78",
        status: "blocked",
        details: "Attempted to inject malicious SQL query.",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        domainUrl: "https://another-site.net",
        attackType: "XSS Attempt",
        sourceIp: "172.21.34.123",
        status: "blocked",
        details: "Cross-site scripting payload detected.",
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        domainUrl: "https://example.com",
        attackType: "Bot Attack",
        sourceIp: "8.8.8.8",
        status: "detected",
        details: "High rate of suspicious requests from known botnet IP.",
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        domainUrl: "https://test-domain.org",
        attackType: "Path Traversal",
        sourceIp: "203.0.113.5",
        status: "blocked",
        details: "Attempt to access sensitive files using directory traversal.",
      },
    ];
    setAttackLogs(initialAttackLogs);
  }, []);

  const simulateAttack = () => {
    const fakeIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
    const domainToAttack = domains[Math.floor(Math.random() * domains.length)];
    const attackTypes = [
      "SQL Injection",
      "XSS Attempt",
      "Bot Attack",
      "DDoS Attempt",
      "File Inclusion",
    ];
    const randomAttackType =
      attackTypes[Math.floor(Math.random() * attackTypes.length)];

    const newAttackLog: AttackLog = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      domainUrl: domainToAttack ? domainToAttack.url : "N/A",
      attackType: randomAttackType,
      sourceIp: fakeIP,
      status: Math.random() > 0.3 ? "blocked" : "detected",
      details: `Simulated ${randomAttackType} from ${fakeIP}`,
    };
    setAttackLogs((prev) => [newAttackLog, ...prev]);

    setLog((prev) => [
      `${newAttackLog.timestamp} - ${newAttackLog.domainUrl} - ${newAttackLog.attackType} from ${newAttackLog.sourceIp} (${newAttackLog.status})`,
      ...prev,
    ]);
  };

  /*  History  */
  const reports = [
    { date: "2025-05-26", domain: "example.com", threats: 6 },
    { date: "2025-05-25", domain: "test.com", threats: 2 },
  ];

  const activeDomains = domains.filter(
    (d) => d.status === "active" || d.status === "pending_dns"
  );

  interface MovementItem {
    id: number;
    title: string;
    description: string;
    amount: string;
    type: "income" | "expense";
  }

  const movements: MovementItem[] = [
    {
      id: 1,
      title: "Salary",
      description: "Monthly salary",
      amount: "+฿30,000",
      type: "income",
    },
    {
      id: 2,
      title: "Groceries",
      description: "Tesco Lotus",
      amount: "-฿1,200",
      type: "expense",
    },
    {
      id: 3,
      title: "Freelance",
      description: "Project ABC",
      amount: "+฿5,000",
      type: "income",
    },
  ];
  const threatData: ThreatDataType[] = [
    {
      month: "ม.ค.",
      sqlInjection: 320,
      xss: 280,
      csrf: 150,
      ddos: 200,
      bruteForce: 380,
      sslAttack: 45,
    },
    {
      month: "ก.พ.",
      sqlInjection: 350,
      xss: 310,
      csrf: 165,
      ddos: 225,
      bruteForce: 420,
      sslAttack: 52,
    },
    {
      month: "มี.ค.",
      sqlInjection: 380,
      xss: 340,
      csrf: 180,
      ddos: 190,
      bruteForce: 450,
      sslAttack: 38,
    },
    {
      month: "เม.ย.",
      sqlInjection: 420,
      xss: 390,
      csrf: 210,
      ddos: 280,
      bruteForce: 520,
      sslAttack: 65,
    },
    {
      month: "พ.ค.",
      sqlInjection: 480,
      xss: 430,
      csrf: 240,
      ddos: 320,
      bruteForce: 580,
      sslAttack: 72,
    },
    {
      month: "มิ.ย.",
      sqlInjection: 450,
      xss: 460,
      csrf: 225,
      ddos: 290,
      bruteForce: 620,
      sslAttack: 58,
    },
    {
      month: "ก.ค.",
      sqlInjection: 520,
      xss: 510,
      csrf: 280,
      ddos: 350,
      bruteForce: 680,
      sslAttack: 85,
    },
    {
      month: "ส.ค.",
      sqlInjection: 580,
      xss: 550,
      csrf: 320,
      ddos: 380,
      bruteForce: 720,
      sslAttack: 92,
    },
    {
      month: "ก.ย.",
      sqlInjection: 540,
      xss: 580,
      csrf: 295,
      ddos: 420,
      bruteForce: 750,
      sslAttack: 78,
    },
    {
      month: "ต.ค.",
      sqlInjection: 620,
      xss: 620,
      csrf: 360,
      ddos: 480,
      bruteForce: 820,
      sslAttack: 105,
    },
    {
      month: "พ.ย.",
      sqlInjection: 680,
      xss: 680,
      csrf: 390,
      ddos: 520,
      bruteForce: 890,
      sslAttack: 120,
    },
    {
      month: "ธ.ค.",
      sqlInjection: 650,
      xss: 720,
      csrf: 375,
      ddos: 500,
      bruteForce: 850,
      sslAttack: 110,
    },
  ];

  const colors = {
    sqlInjection: "#dc2626", // แดงเข้ม
    xss: "#ea580c", // ส้มเข้ม
    csrf: "#7c3aed", // ม่วง
    ddos: "#0891b2", // ฟ้าน้ำเงิน
    bruteForce: "#059669", // เขียวเข้ม
    sslAttack: "#be185d", // ชมพูเข้ม
  };

  // คำอธิบายภัยคุกคาม
  const threatDescriptions = [
    {
      name: "SQL Injection",
      color: colors.sqlInjection,
      desc: "SQL Injection",
    },
    { name: "XSS", color: colors.xss, desc: "Cross-Site Scripting" },
    { name: "CSRF", color: colors.csrf, desc: "Cross-Site Request Forgery" },
    { name: "DDoS", color: colors.ddos, desc: "Distributed Denial of Service" },
    {
      name: "Brute Force",
      color: colors.bruteForce,
      desc: "Brute Force Attack",
    },
    { name: "SSL Attack", color: colors.sslAttack, desc: "SSL/TLS Attack" },
  ];
  const keyMap: Record<string, keyof ThreatDataType> = {
    sqlinjection: "sqlInjection",
    xss: "xss",
    csrf: "csrf",
    ddos: "ddos",
    bruteforce: "bruteForce",
    sslattack: "sslAttack",
  };
  return (
    <>
      <div className="home-container">
        <Head>
          <title>As a DEV</title>
          <meta property="og:title" content="As a DEV" />
        </Head>

        <Navbar8
          page4Description={
            <Fragment>
              <span className="home-text100">
                Contact us for further assistance or inquiries.
              </span>
            </Fragment>
          }
          action1={
            <Fragment>
              <span onClick={SampleNavigation} className="home-text101">
                Log Out
              </span>
            </Fragment>
          }
        ></Navbar8>

        <Navbar />

        {user ? (
          visible && (
            <div className={`welcome-container ${fadeOut ? "fade-out" : ""}`}>
              <h1>Welcome, {user.name || user.username}!</h1>
            </div>
          )
        ) : (
          <p>Loading user...</p>
        )}

        <section id="domain" className="page-section">
          <div className="container">
            <h2>Domain Management</h2>
            <div className="domain-list">
              <h2>Your existing Domains</h2>

              {domains.length === 0 ? (
                <div className="domain-box">No domain have been added.</div>
              ) : (
                domains.map((domain) => (
                  <div className="domain-box" key={domain.id}>
                    <div className="domain-left">
                      <span className="status-icon">
                        {domain.status === "active" ? (
                          <span
                            title="Active (WAF is running)"
                            style={{ color: "green" }}
                          >
                            🛡️
                          </span>
                        ) : domain.status === "pending_dns" ? (
                          <span
                            title="Waiting for DNS setup"
                            style={{ color: "orange" }}
                          >
                            ⏳
                          </span>
                        ) : domain.status === "error_dns" ? (
                          <span title="DNS error" style={{ color: "red" }}>
                            ⚠️
                          </span>
                        ) : (
                          <span
                            title="Inactive / Error"
                            style={{ color: "red" }}
                          >
                            ❌
                          </span>
                        )}
                      </span>
                      <span className="domain-url">{domain.url}</span>
                      {domain.status === "pending_dns" &&
                        domain.dnsInstructions && (
                          <span
                            className="dns-hint"
                            style={{
                              marginLeft: "10px",
                              fontSize: "0.8em",
                              color: "#888",
                            }}
                          >
                            (Waiting for DNS: {domain.dnsInstructions.type}{" "}
                            {domain.dnsInstructions.value})
                          </span>
                        )}
                    </div>
                    <div className="domain-actions">
                      <button
                        className="add-domain add-domain-important-height"
                        onClick={() => openSettingsModal(domain)}
                        title="Domain Settings"
                      >
                        ⚙️
                      </button>
                      <button
                        className="add-domain add-domain-important-height"
                        onClick={() => handleDeleteDomain(domain.id)}
                        title="Delete Domain"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="adddomain-box add-box">
                <button className="api-configure-button" onClick={openAddModal}>
                  <i className="fas fa-plus add-domain-icon"></i>{" "}
                  <span>Add Website Address</span>
                </button>
              </div>
            </div>

            {showAddModal && (
              <AddDomainModal onAdd={handleAddDomain} onClose={closeAddModal} />
            )}
            {showSettingsModal && selectedDomain && (
              <SettingsModal
                domain={selectedDomain}
                onSave={handleUpdateDomain}
                onClose={closeSettingsModal}
              />
            )}
          </div>
        </section>

        <section id="domainscan" className="page-section">
          <section id="scan" className="page-section scan-module">
            <div className="container">
              <h2>Vulnerability Scanning</h2>
              <p>Scan your protected domains for common web vulnerabilities.</p>
              {scanResults.length > 0 && (
                <div className="scan-results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Vulnerability</th>
                        <th>Severity</th>
                        <th>Description</th>
                        <th>URL Found</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanResults.map((vuln) => (
                        <tr key={vuln.id}>
                          <td>{vuln.name}</td>
                          <td>
                            <span
                              className={`severity-${vuln.severity.toLowerCase()}`}
                            >
                              {vuln.severity}
                            </span>
                          </td>
                          <td>{vuln.description}</td>
                          <td>
                            <a
                              href={vuln.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {vuln.url}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {scanResults.length === 0 && !isScanning && lastScanTime && (
                <p className="no-vulnerabilities">
                  No vulnerabilities found in the last scan.
                </p>
              )}
              {lastScanTime && (
                <p className="scan-time">
                  Last scan time: {lastScanTime}
                  {scanResults.length > 0 && (
                    <span className="scan-summary">
                      {" "}
                      Total vulnerabilities found: {scanResults.length}
                    </span>
                  )}
                </p>
              )}
              <button
                onClick={handleScan}
                className="scan-button"
                disabled={isScanning}
              >
                {isScanning ? "Scanning..." : "Start Scan"}
              </button>
            </div>
          </section>
        </section>

        <section id="secureapi" className="page-section">
          <div className="container">
            <h2>API Security</h2>
            <p>Configure WAF settings specifically for your API Endpoints.</p>

            {protectedApis.length > 0 && (
              <div className="protected-apis-list">
                <h3>Protected API Endpoints</h3>
                <div className="api-list-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Endpoint</th>
                        <th>API Key</th>
                        <th>Requests per Minute</th>
                        <th>Allowed IPs</th>
                        <th>Blocked IPs</th>
                        <th>Status</th>
                        <th>Protected Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protectedApis.map((api) => (
                        <tr key={api.id}>
                          <td>{api.domainUrl}</td>
                          <td>{api.endpoint}</td>
                          <td>{api.apiKey || "N/A"}</td>
                          <td>
                            {api.requestLimit !== null
                              ? api.requestLimit
                              : "Unlimited"}
                          </td>
                          <td>
                            {api.allowedIps.length > 0
                              ? api.allowedIps.join(", ")
                              : "None"}
                          </td>
                          <td>
                            {api.disallowedIps.length > 0
                              ? api.disallowedIps.join(", ")
                              : "None"}
                          </td>
                          <td>
                            <span
                              className={
                                api.protectionEnabled
                                  ? "status-active"
                                  : "status-inactive"
                              }
                            >
                              {api.protectionEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </td>
                          <td>{api.protectedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="api-summary-box">
              <p className="api-summary-text">
                Currently protecting **{protectedApis.length}** API Endpoints
              </p>
              <button
                onClick={() => setShowApiSecurityModal(true)}
                className="api-configure-button"
              >
                Configure API Security
              </button>
              {apiProtectionMessage && (
                <p
                  className={`api-message ${
                    apiProtectionMessage.includes("protected")
                      ? "success-message"
                      : "error-message"
                  }`}
                >
                  {apiProtectionMessage}
                </p>
              )}
            </div>
          </div>
        </section>

        {showApiSecurityModal && (
          <ApiSecurityModal
            domains={domains} // Pass your list of domains
            selectedDomainId={selectedApiDomainId}
            onSelectDomain={setSelectedApiDomainId}
            endpoint={endpoint}
            onSetEndpoint={setEndpoint}
            apiKey={apiKey}
            onSetApiKey={setApiKey}
            requestLimit={requestLimit}
            onRequestLimitChange={setRequestLimit}
            allowIpInput={allowIpInput}
            onAllowIpChange={setAllowIpInput}
            disallowIpInput={disallowIpInput}
            onDisallowIpChange={setDisallowIpInput}
            onSubmit={handleApiSubmit} // Pass your submit handler
            onClose={() => setShowApiSecurityModal(false)} // Pass a close handler
          />
        )}

        <section id="honeytrap" className="page-section">
          <div className="container">
            <h2 className="honeypot-title">Honeypot Monitoring</h2>
            <p className="honeypot-description">
              A honeypot is a fake service used to trap and log attackers who
              try to exploit your system.
            </p>
            <button onClick={simulateAttack} className="honeypot-button">
              Simulate Fake Attack
            </button>

            <div className="honeypot-log-box">
              <h4 className="honeypot-log-title">Detected Activity:</h4>
              {log.length === 0 ? (
                <p className="honeypot-no-log">No activity yet.</p>
              ) : (
                <ul className="honeypot-log-list">
                  {log.map((entry, index) => (
                    <li key={index} className="honeypot-log-item">
                      {entry}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section id="dashboard" className="page-section">
          
        </section>

        <section id="history" className="page-section">
          <div className="container">
            <h2>History and Reports</h2>
            <p>View security reports and historical logs</p>
            <div className="reports-list">
              {attackLogs.length > 0 ? (
                attackLogs.map((log) => (
                  <div key={log.id} className="report-item">
                    <p>
                      <strong>Date and Time:</strong>{" "}
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Domain:</strong> {log.domainUrl}
                    </p>
                    <p>
                      <strong>Attack Type:</strong> {log.attackType}
                    </p>
                    <p>
                      <strong>Source IP:</strong> {log.sourceIp}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status-${log.status}`}>
                        {log.status === "blocked" ? "Blocked" : "Detected"}
                      </span>
                    </p>
                    {log.details && (
                      <p>
                        <strong>Details:</strong> {log.details}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p>No attack logs yet</p>
              )}
            </div>
          </div>
        </section>

        <Footer4
          link5={
            <Fragment>
              <span className="home-text212">Resources</span>
            </Fragment>
          }
          link3={
            <Fragment>
              <span className="home-text213">Services</span>
            </Fragment>
          }
          link1={
            <Fragment>
              <span className="home-text214">Home</span>
            </Fragment>
          }
          termsLink={
            <Fragment>
              <span className="home-text215">Terms of Use</span>
            </Fragment>
          }
          link2={
            <Fragment>
              <span className="home-text216">About Us</span>
            </Fragment>
          }
          link4={
            <Fragment>
              <span className="home-text217">Contact Us</span>
            </Fragment>
          }
          cookiesLink={
            <Fragment>
              <span className="home-text218">Cookies Policy</span>
            </Fragment>
          }
          privacyLink={
            <Fragment>
              <span className="home-text219">Privacy Policy</span>
            </Fragment>
          }
        ></Footer4>
      </div>
      <style jsx>
        {`
          .home-text100 {
            display: inline-block;
          }
          .home-text101 {
            display: inline-block;
          }
          .home-text102 {
            display: inline-block;
          }
          .home-text103 {
            display: inline-block;
          }
          .home-text104 {
            display: inline-block;
          }
          .home-text105 {
            display: inline-block;
          }
          .home-text106 {
            display: inline-block;
          }
          .home-text107 {
            display: inline-block;
          }
          .home-text108 {
            display: inline-block;
          }
          .home-text109 {
            display: inline-block;
          }
          .home-text110 {
            display: inline-block;
          }
          .home-text111 {
            display: inline-block;
          }
          .home-text112 {
            display: inline-block;
          }
          .home-text113 {
            display: inline-block;
          }
          .home-text114 {
            display: inline-block;
          }
          .home-text115 {
            display: inline-block;
          }
          .home-text116 {
            display: inline-block;
          }
          .home-text117 {
            display: inline-block;
          }
          .home-text118 {
            display: inline-block;
          }
          .home-text119 {
            display: inline-block;
          }
          .home-text120 {
            display: inline-block;
          }
          .home-text121 {
            display: inline-block;
          }
          .home-text122 {
            display: inline-block;
          }
          .home-text123 {
            display: inline-block;
          }
          .home-text124 {
            display: inline-block;
          }
          .home-text125 {
            display: inline-block;
          }
          .home-text126 {
            display: inline-block;
          }
          .home-text127 {
            display: inline-block;
          }
          .home-text128 {
            display: inline-block;
          }
          .home-text129 {
            display: inline-block;
          }
          .home-text130 {
            display: inline-block;
          }
          .home-text131 {
            display: inline-block;
          }
          .home-text132 {
            display: inline-block;
          }
          .home-text133 {
            display: inline-block;
          }
          .home-text134 {
            display: inline-block;
          }
          .home-text135 {
            display: inline-block;
          }
          .home-text136 {
            display: inline-block;
          }
          .home-text137 {
            display: inline-block;
          }
          .home-text138 {
            display: inline-block;
          }
          .home-text139 {
            display: inline-block;
          }
          .home-text140 {
            display: inline-block;
          }
          .home-text141 {
            display: inline-block;
          }
          .home-text142 {
            display: inline-block;
          }
          .home-text143 {
            display: inline-block;
          }
          .home-text144 {
            display: inline-block;
          }
          .home-text145 {
            display: inline-block;
          }
          .home-text146 {
            display: inline-block;
          }
          .home-text147 {
            display: inline-block;
          }
          .home-text148 {
            display: inline-block;
          }
          .home-text149 {
            display: inline-block;
          }
          .home-text150 {
            display: inline-block;
          }
          .home-text151 {
            display: inline-block;
          }
          .home-text152 {
            display: inline-block;
          }
          .home-text153 {
            display: inline-block;
          }
          .home-text154 {
            display: inline-block;
          }
          .home-text155 {
            display: inline-block;
          }
          .home-text156 {
            display: inline-block;
          }
          .home-text157 {
            display: inline-block;
          }
          .home-text158 {
            display: inline-block;
          }
          .home-text159 {
            display: inline-block;
          }
          .home-text160 {
            display: inline-block;
          }
          .home-text161 {
            display: inline-block;
          }
          .home-text162 {
            display: inline-block;
          }
          .home-text163 {
            display: inline-block;
          }
          .home-text164 {
            display: inline-block;
          }
          .home-text165 {
            display: inline-block;
          }
          .home-text166 {
            display: inline-block;
          }
          .home-text167 {
            display: inline-block;
          }
          .home-text168 {
            display: inline-block;
          }
          .home-text169 {
            display: inline-block;
          }
          .home-text170 {
            display: inline-block;
          }
          .home-text171 {
            display: inline-block;
          }
          .home-text172 {
            display: inline-block;
          }
          .home-text173 {
            display: inline-block;
          }
          .home-text174 {
            display: inline-block;
          }
          .home-text175 {
            display: inline-block;
          }
          .home-text176 {
            display: inline-block;
          }
          .home-text177 {
            display: inline-block;
          }
          .home-text178 {
            display: inline-block;
          }
          .home-text179 {
            display: inline-block;
          }
          .home-text180 {
            display: inline-block;
          }
          .home-text181 {
            display: inline-block;
          }
          .home-text182 {
            display: inline-block;
          }
          .home-text183 {
            display: inline-block;
          }
          .home-text184 {
            display: inline-block;
          }
          .home-text185 {
            display: inline-block;
          }
          .home-text186 {
            display: inline-block;
          }
          .home-text187 {
            display: inline-block;
          }
          .home-text188 {
            display: inline-block;
          }
          .home-text189 {
            display: inline-block;
          }
          .home-text190 {
            display: inline-block;
          }
          .home-text191 {
            display: inline-block;
          }
          .home-text192 {
            display: inline-block;
          }
          .home-text193 {
            display: inline-block;
          }
          .home-text194 {
            display: inline-block;
          }
          .home-text195 {
            display: inline-block;
          }
          .home-text196 {
            display: inline-block;
          }
          .home-text197 {
            display: inline-block;
          }
          .home-text198 {
            display: inline-block;
          }
          .home-text199 {
            display: inline-block;
          }
          .home-text200 {
            display: inline-block;
          }
          .home-text201 {
            display: inline-block;
          }
          .home-text202 {
            display: inline-block;
          }
          .home-text203 {
            display: inline-block;
          }
          .home-text204 {
            display: inline-block;
          }
          .home-text205 {
            display: inline-block;
          }
          .home-text206 {
            display: inline-block;
          }
          .home-text207 {
            display: inline-block;
          }
          .home-text208 {
            display: inline-block;
          }
          .home-text209 {
            display: inline-block;
          }
          .home-text210 {
            display: inline-block;
          }
          .home-text211 {
            display: inline-block;
          }
          .home-text212 {
            display: inline-block;
          }
          .home-text213 {
            display: inline-block;
          }
          .home-text214 {
            display: inline-block;
          }
          .home-text215 {
            display: inline-block;
          }
          .home-text216 {
            display: inline-block;
          }
          .home-text217 {
            display: inline-block;
          }
          .home-text218 {
            display: inline-block;
          }
          .home-text219 {
            display: inline-block;
          }
        `}
      </style>
    </>
  );
};

export default Home;
