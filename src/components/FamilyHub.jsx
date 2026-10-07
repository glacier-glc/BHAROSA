import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  FileText, 
  Key, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function FamilyHub({
  isOpen,
  onClose,
  familyMembers = [],
  activeMemberId,
  onSelectMember,
  onAddMember,
  onApplyForMember
}) {
  if (!isOpen) return null;

  const [isAdding, setIsAdding] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    relation: 'Son',
    aadhaarMasked: '',
    dob: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMemberData.name.trim()) return;

    onAddMember?.({
      id: `fam_${Date.now()}`,
      name: newMemberData.name,
      relation: newMemberData.relation,
      aadhaarMasked: newMemberData.aadhaarMasked || 'XXXX-XXXX-8921',
      dob: newMemberData.dob || '14-Aug-2004',
      documentsCount: 0
    });

    setIsAdding(false);
    setNewMemberData({ name: '', relation: 'Son', aadhaarMasked: '', dob: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
              <Users size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-semibold">
                PARIVAR HUB • MULTI-AADHAAR VAULT
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Family Credentials & Profiles
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600">
          Manage and access sovereign records for all family members linked to your primary mobile registry. Switch active persona to view individual Nagrik Vaults or file applications on their behalf.
        </p>

        {/* Member Cards List */}
        <div className="space-y-3">
          {familyMembers.map((member) => {
            const isCurrent = member.id === activeMemberId;
            return (
              <div
                key={member.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isCurrent 
                    ? 'bg-blue-50/70 border-[#002875] shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isCurrent ? 'bg-[#002875] text-white shadow-sm' : 'bg-slate-200 text-[#002875]'
                  }`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{member.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-[#002875] font-semibold">
                        {member.relation}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                          <Check size={12} /> Active Persona
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Aadhaar: {member.aadhaarMasked} • {member.documentsCount || 0} Credential(s)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => onSelectMember(member.id)}
                      className="btn btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                    >
                      Switch Persona
                    </button>
                  )}
                  <button
                    onClick={() => { onSelectMember(member.id); onApplyForMember?.(member); }}
                    className="btn btn-primary text-xs py-1.5 px-3 cursor-pointer"
                  >
                    Apply on Behalf
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Member Form / Button */}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-[#002875] block">Link New Parivar Member</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Legal Name (as per Aadhaar)"
                value={newMemberData.name}
                onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                className="input-field col-span-2 py-2 bg-white border-slate-300 text-slate-900"
                required
              />
              <select
                value={newMemberData.relation}
                onChange={(e) => setNewMemberData({ ...newMemberData, relation: e.target.value })}
                className="input-field py-2 bg-white border-slate-300 text-slate-900"
              >
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
              </select>
              <input
                type="text"
                placeholder="12-digit Aadhaar Number"
                value={newMemberData.aadhaarMasked}
                onChange={(e) => setNewMemberData({ ...newMemberData, aadhaarMasked: e.target.value })}
                className="input-field py-2 font-mono bg-white border-slate-300 text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn btn-secondary text-xs py-1.5 px-3 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-xs py-1.5 px-3 cursor-pointer"
              >
                Verify via OTP & Link
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-xl border border-dashed border-slate-300 hover:border-[#002875] text-xs font-semibold text-[#002875] hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Link Another Family Member (Parivar Aadhaar)</span>
          </button>
        )}

      </div>
    </div>
  );
}
