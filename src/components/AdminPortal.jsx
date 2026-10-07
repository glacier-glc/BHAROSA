import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Database, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Check, 
  Copy,
  ExternalLink
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function AdminPortal({ sectors = [] }) {
  const [activeTab, setActiveTab] = useState('clusters'); // 'clusters' | 'audit' | 'sectors'
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock cluster telemetry
  const clusterNodes = [
    { id: 'DELHI-CENTRAL-01', location: 'NIC National Data Centre, Shastri Park, New Delhi', status: 'HEALTHY', latency: '4ms', load: '18%', height: '14,892,104' },
    { id: 'MUMBAI-FIN-02', location: 'RBI Data Center & Disaster Recovery Hub, BKC, Mumbai', status: 'HEALTHY', latency: '9ms', load: '24%', height: '14,892,104' },
    { id: 'BENGALURU-TECH-03', location: 'ISRO Telemetry & Sovereign Satellite Uplink, Peenya', status: 'HEALTHY', latency: '12ms', load: '14%', height: '14,892,104' },
    { id: 'HYDERABAD-PHARMA-04', location: 'Genome Valley National Cryptographic Node, Hyderabad', status: 'HEALTHY', latency: '15ms', load: '21%', height: '14,892,103' },
    { id: 'KOLKATA-EAST-05', location: 'ER Sovereign Trust Centre, Salt Lake Sector V, Kolkata', status: 'HEALTHY', latency: '18ms', load: '12%', height: '14,892,104' },
    { id: 'CHENNAI-COASTAL-06', location: 'Southern Subsea Cable Cryptographic Landing Node, Chennai', status: 'HEALTHY', latency: '11ms', load: '19%', height: '14,892,104' }
  ];

  // Immutable audit events
  const auditEvents = [
    { id: 'AUD-99120', time: '10:44:12 IST', actor: 'SYSTEM_HSM_SCHEDULER', action: 'Daily SHA-256 Root Keypair Rotation', target: 'KEY_VAULT_ROOT_2026', status: 'VERIFIED' },
    { id: 'AUD-99119', time: '10:39:05 IST', actor: 'IIT_COUNCIL_NODE', action: 'Minted 4,210 Degree Block Attestations', target: 'EDU_MERKLE_TREE_BATCH_90', status: 'VERIFIED' },
    { id: 'AUD-99118', time: '10:32:44 IST', actor: 'NIC_GATEWAY_MONITOR', action: 'Zero-Trust Public Verifier API Sync', target: 'API_GATEWAY_CLUSTER_V4', status: 'VERIFIED' },
    { id: 'AUD-99117', time: '10:14:19 IST', actor: 'SUB_REGISTRAR_DELHI', action: 'Land Conveyance Record Encumbrance Commit', target: 'LND-DEL-2026-0041', status: 'VERIFIED' },
    { id: 'AUD-99116', time: '09:58:02 IST', actor: 'SECURITY_DAEMON_04', action: 'Attempted brute force blocked (IP 182.72.x.x)', target: 'AUTH_GATEWAY_FIREWALL', status: 'FLAGGED' },
    { id: 'AUD-99115', time: '09:40:11 IST', actor: 'BBPS_SETTLEMENT_CORE', action: 'Reconciled ₹2,41,900 statutory fees batch', target: 'BHARAT_BILLPAY_ESCROW', status: 'VERIFIED' }
  ];

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-orange-50 text-[#FF671F] border border-orange-200">
                <ShieldCheck size={24} />
              </span>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF671F] font-semibold">
                  MEITY / CERT-IN AUDIT CONTROL
                </span>
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
                  National Sovereign Administration & Audit
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl">
              Real-time monitoring of BHAROSA's 24-state distributed cryptographic consensus nodes, HSM key rotations, and compliance under DPDP Act 2023.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncLedger}
              className="btn btn-secondary text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#002875]' : ''} />
              <span>{isSyncing ? 'Synchronizing Nodes...' : 'Verify Cryptographic State'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Consensus Health</span>
            <Activity size={18} className="text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 font-outfit">99.998%</span>
            <span className="text-xs text-emerald-600 font-semibold">High Availability</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Block Ledger Height</span>
            <Database size={18} className="text-[#002875]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#002875] font-mono">14,892,104</span>
            <span className="text-xs text-slate-500">SHA-256</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Active State Nodes</span>
            <Server size={18} className="text-[#002875]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#002875] font-outfit">24 / 24</span>
            <span className="text-xs text-[#002875] font-semibold">Synced</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">HSM Security Level</span>
            <Lock size={18} className="text-[#FF671F]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#FF671F] font-outfit">FIPS 140-3</span>
            <span className="text-xs text-[#FF671F] font-semibold">Level 4 Airgap</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'clusters' 
              ? 'bg-blue-50 text-[#002875] border border-blue-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          National Nodes Infrastructure
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'audit' 
              ? 'bg-blue-50 text-[#002875] border border-blue-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Immutable Security Audit Log
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'sectors' 
              ? 'bg-blue-50 text-[#002875] border border-blue-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Accredited Sectors (7)
        </button>
      </div>

      {/* Tab 1: Cluster Nodes */}
      {activeTab === 'clusters' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#002875]">Sovereign Node Cluster Telemetry</span>
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> All Regional Zones Synced
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {clusterNodes.map(node => (
              <div key={node.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[#002875]">
                    <Server size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{node.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{node.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency</span>
                    <span className="text-emerald-700 font-semibold">{node.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CPU Load</span>
                    <span className="text-[#002875] font-semibold">{node.load}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Merkle Block</span>
                    <span className="text-[#FF671F] font-semibold">#{node.height}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-[#002875]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Executing Actor</th>
                  <th className="py-3 px-4">Cryptographic Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4 text-right">Ledger State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-[#002875] font-bold">{evt.id}</td>
                    <td className="py-3 px-4 text-slate-500">{evt.time}</td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{evt.actor}</td>
                    <td className="py-3 px-4 text-slate-800">{evt.action}</td>
                    <td className="py-3 px-4 text-slate-500">{evt.target}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.status === 'FLAGGED' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sectors */}
      {activeTab === 'sectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map(sec => (
            <div key={sec.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#002875]/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-base font-bold text-slate-900">{sec.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#002875] border border-blue-200 font-semibold">
                  {sec.authorities?.length || 4} Authorities
                </span>
              </div>
              <p className="text-xs text-slate-500">{sec.hindiName}</p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• Document Types: {sec.documentTypes?.length || 4} formats</p>
                <p>• e-Sign Protocol: AES-256 + RSA-4096 Sovereign PKI</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
