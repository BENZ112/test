export type Domain = {
  id: number;
  url: string;
  status: "active" | "inactive" | "pending_dns" | "error_dns";
  originServers: string[];
  sslType: "auto" | "custom" | "none";
  sslStatus:
    | "active"
    | "pending"
    | "expired"
    | "error"
    | "awaiting_upload"
    | "inactive";
  dnsInstructions: {
    type: "CNAME" | "A";
    value: string;
    expectedIp?: string;
  } | null;
  wafEnabled: boolean;
};
