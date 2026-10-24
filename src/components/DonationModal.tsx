import React, { useState } from 'react';
import { X, Heart, Shield, Copy, Check, Building2, Sparkles, HandCoins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [amount, setAmount] = useState('5000');
  const [pledged, setPledged] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('8009124801');
    setCopiedAccount(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C6A56A', '#F2EFE5', '#1D241B'],
    });
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    setPledged(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6A56A', '#F2EFE5', '#4A69BD'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#141A13] text-[#F2EFE5] rounded-2xl border border-[#34392F] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#101510] border-b border-[#34392F] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C6A56A]/15 border border-[#C6A56A]/30 flex items-center justify-center text-[#C6A56A]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F2EFE5] tracking-wide">
                Support BRACA Field Conservation
              </h3>
              <p className="text-xs text-[#A6AA9A] font-light">
                Empowering Sri Lankan Wildlife &amp; Bioacoustic Monitoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A6AA9A] hover:text-white rounded-lg hover:bg-[#1D241B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!pledged ? (
          <div className="p-6 sm:p-8 space-y-6 text-xs text-[#A6AA9A]">
            <p className="text-sm text-[#F2EFE5] font-light leading-relaxed">
              Your donation directly equips remote bioacoustic sound loggers, night-vision wildlife cameras, veterinary emergency response kits, and community education workshops across endangered forest habitats.
            </p>

            {/* Quick Amounts */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] font-medium">
                Select Contribution Level (LKR)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { val: '2500', label: 'Rs. 2,500', role: 'Batteries & SD' },
                  { val: '5000', label: 'Rs. 5,000', role: 'Acoustic Unit' },
                  { val: '10000', label: 'Rs. 10,000', role: 'Field Sentry' },
                  { val: '25000', label: 'Rs. 25,000', role: 'Expedition' },
                ].map((tier) => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setAmount(tier.val)}
                    className={`p-2.5 text-center font-mono rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      amount === tier.val
                        ? 'bg-[#C6A56A] border-[#C6A56A] text-[#101510] font-bold shadow-md'
                        : 'bg-[#101510] border-[#34392F] text-[#F2EFE5] hover:border-[#C6A56A]/60'
                    }`}
                  >
                    <span className="text-xs">{tier.label}</span>
                    <span className={`text-[9px] font-sans mt-0.5 ${amount === tier.val ? 'text-[#101510]/80' : 'text-[#A6AA9A]'}`}>
                      {tier.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="p-5 bg-[#101510] rounded-xl border border-[#34392F] space-y-3.5">
              <div className="flex items-center space-x-2 text-[#F2EFE5] font-medium">
                <Building2 className="w-4 h-4 text-[#C6A56A]" />
                <span className="text-xs uppercase tracking-wider font-mono text-[#C6A56A]">
                  Official Bank Transfer Credentials (Sri Lanka)
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-[#A6AA9A]">
                <div className="flex justify-between py-1 border-b border-[#34392F]/70">
                  <span className="text-[#A6AA9A]/70">Beneficiary:</span>
                  <span className="text-[#F2EFE5] font-sans font-medium text-right">
                    Biodiversity Research &amp; Conservation Alliance (Pvt) Ltd
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#34392F]/70">
                  <span className="text-[#A6AA9A]/70">Bank:</span>
                  <span className="text-[#F2EFE5]">Commercial Bank of Ceylon</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#34392F]/70">
                  <span className="text-[#A6AA9A]/70">Branch:</span>
                  <span className="text-[#F2EFE5]">Colombo 07 Branch</span>
                </div>
                <div className="flex justify-between items-center py-1.5 bg-[#141A13] px-3 rounded-lg border border-[#34392F]">
                  <span className="text-[#A6AA9A]">Account No:</span>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[#C6A56A] font-bold text-sm tracking-wider">8009124801</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-2.5 py-1 bg-[#1D241B] hover:bg-[#C6A56A] hover:text-[#101510] text-[#F2EFE5] rounded border border-[#34392F] transition-all flex items-center gap-1 cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#A6AA9A] bg-[#101510]/60 p-3.5 rounded-lg border border-[#34392F] space-y-2">
              <div>
                ✉️ After initiating transfer, send your deposit slip or transaction reference to{' '}
                <strong className="text-[#C6A56A]">mail@braca.lk</strong> to receive an official conservation receipt.
              </div>
              <div className="pt-1.5 border-t border-[#34392F] font-mono text-[10px] flex items-center gap-2 flex-wrap text-[#A6AA9A]">
                <span>Inquiries:</span>
                <span className="text-[#F2EFE5]">0763677875 (Dishith)</span>
                <span>•</span>
                <span className="text-[#F2EFE5]">+94 70 667 4025 (Lasal)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#34392F]">
              <span className="text-[11px] font-mono text-[#A6AA9A]">
                Non-Profit Research Alliance
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="px-4 py-2 border border-[#34392F] hover:border-[#C6A56A] text-[#F2EFE5] rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Copy Account
                </button>
                <button
                  type="button"
                  onClick={(e) => handlePledge(e)}
                  className="px-5 py-2 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] font-bold text-xs font-mono uppercase tracking-wider rounded transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <HandCoins className="w-4 h-4" />
                  <span>Pledge LKR {parseInt(amount).toLocaleString()}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#C6A56A]/20 border border-[#C6A56A] text-[#C6A56A] flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-serif text-[#F2EFE5]">
                Thank You for Backing Wildlife Conservation
              </h4>
              <p className="text-sm text-[#A6AA9A] max-w-md mx-auto leading-relaxed">
                Your pledged contribution of <strong className="text-[#C6A56A]">LKR {parseInt(amount).toLocaleString()}</strong> helps keep research teams deployed in Sri Lanka's rainforests and nocturnal observation outposts.
              </p>
            </div>
            <div className="p-4 bg-[#101510] border border-[#34392F] rounded-xl text-xs font-mono text-[#A6AA9A] max-w-sm mx-auto">
              Please transfer to Commercial Bank Acc <span className="text-[#C6A56A]">8009124801</span> and notify <span className="text-[#F2EFE5]">mail@braca.lk</span>.
            </div>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] text-xs font-mono uppercase tracking-wider font-semibold rounded cursor-pointer transition-colors"
              >
                Return to Site
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
