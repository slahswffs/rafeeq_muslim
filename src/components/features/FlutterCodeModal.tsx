import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterCodeFile } from '../../data/flutterSourceCode';
import { X, Copy, Check, Code, FileText } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface FlutterCodeModalProps {
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      audioService.vibrate(20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#1E293B] text-slate-100 w-full max-w-3xl rounded-[26px] shadow-2xl border border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>مشروع Flutter + Dart الكامل</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  Riverpod & Material 3
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                الملفات الجاهزة للنسخ والتشغيل في بيئة Flutter على أندرويد
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File tabs bar */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-900/60 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {FLUTTER_PROJECT_FILES.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedFile.path === file.path
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{file.path}</span>
            </button>
          ))}
        </div>

        {/* File info bar & Copy Button */}
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{selectedFile.description}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950/70 text-slate-200 leading-relaxed select-text" dir="ltr">
          <pre>{selectedFile.code}</pre>
        </div>
      </div>
    </div>
  );
};
