import React from 'react';
import { AlertTriangle, Mail, Calendar, CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionType: 'gmail_send' | 'gmail_draft' | 'calendar_create' | 'delete' | 'generic';
  confirmLabel?: string;
  cancelLabel?: string;
  itemDetails?: { label: string; value: string }[];
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  actionType,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  itemDetails,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (actionType) {
      case 'gmail_send':
      case 'gmail_draft':
        return <Mail className="w-6 h-6 text-indigo-600" />;
      case 'calendar_create':
        return <Calendar className="w-6 h-6 text-emerald-600" />;
      case 'delete':
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getButtonBg = () => {
    switch (actionType) {
      case 'gmail_send':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'calendar_create':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'delete':
        return 'bg-rose-600 hover:bg-rose-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                {getIcon()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Google Workspace Action Confirmation</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-600 leading-relaxed">{description}</p>

          {itemDetails && itemDetails.length > 0 && (
            <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              {itemDetails.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <span className="font-medium text-slate-500">{item.label}:</span>
                  <span className="text-slate-800 font-mono text-right truncate max-w-xs">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              This operation executes on your behalf with permission from your connected Google Workspace account.
            </span>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors flex items-center gap-2 ${getButtonBg()}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
