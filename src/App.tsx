import React, { useState, useRef } from 'react';
import { Play, Square, RotateCcw, Monitor, Cpu, Settings, Download, ShieldAlert, FileCode } from 'lucide-react';

export default function App() {
  const [romLoaded, setRomLoaded] = useState(false);
  const [romName, setRomName] = useState<string | null>(null);
  const [romHackPatched, setRomHackPatched] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [status, setStatus] = useState('SYSTEM: IDLE');
  
  const romInputRef = useRef<HTMLInputElement>(null);

  const handleRomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // IMPORTANTE: Garantindo que pegamos o arquivo e não a pasta
    const file = e.target.files?.[0];
    if (file && (file.name.toLowerCase().endsWith('.z64') || file.name.toLowerCase().endsWith('.n64'))) {
      setRomLoaded(true);
      setRomName(file.name);
      setStatus(`ROM LOADED: ${file.name.toUpperCase()}`);
    } else if (file) {
      alert('ERRO: ARQUIVO INVÁLIDO. POR FAVOR SELECIONE UM ARQUIVO .Z64');
      if (romInputRef.current) romInputRef.current.value = '';
    }
  };

  const handleBoot = () => {
    if (!romLoaded) return;
    setIsBooting(true);
    setStatus('EMULATION: RUNNING @ 60FPS');
  };

  const handleReset = () => {
    setIsBooting(false);
    setStatus('SYSTEM: RESET COMPLETED');
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans overflow-hidden">
      {/* Header / Navigation (2008 Web Style) */}
      <header className="h-16 glossy-gradient border-b-2 border-[#888] flex items-center px-6 justify-between shrink-0 shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <div className="n64-logo">RETRO-WEB 64</div>
          <nav className="flex gap-1 ml-4 h-full items-end pt-2">
            <button className="px-5 py-1.5 bg-[#eee] border-t border-x border-[#888] rounded-t-md font-bold text-[#333] shadow-inner">Portal</button>
            <button className="px-5 py-1.5 hover:bg-[#e1e1e1] border-t border-x border-transparent rounded-t-md text-[#555] font-medium transition-colors">Mods</button>
            <button className="px-5 py-1.5 hover:bg-[#e1e1e1] border-t border-x border-transparent rounded-t-md text-[#555] font-medium transition-colors">Manual</button>
          </nav>
        </div>
        <div className="text-xs text-right font-bold leading-tight">
          V. 1.0.8 (STABLE B64)<br/>
          <span className={isBooting ? "text-green-700" : "text-blue-700"}>
            {isBooting ? "STATUS: ACTIVE" : "STATUS: READY"}
          </span>
        </div>
      </header>

      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Left Side: Game Area */}
        <div className="flex-1 flex flex-col bg-[#888] border-4 border-[#333] rounded shadow-2xl relative overflow-hidden">
          <div className="bg-[#222] flex-1 flex flex-col items-center justify-center relative">
            
            {/* Game Viewport */}
            <div className="w-[640px] h-[480px] bg-black border-2 border-[#444] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative group">
              {!isBooting ? (
                <div className="text-center">
                  <div className="mb-6 w-24 h-24 border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center mx-auto">
                     <Monitor className="text-gray-600" size={48} />
                  </div>
                  <h2 className="text-white font-bold text-xl mb-4 uppercase tracking-widest">
                    {romLoaded ? `ROM READY: ${romName}` : "No ROM Loaded"}
                  </h2>
                  
                  {/* EXPLÍCITO: Input de arquivo, não de pasta */}
                    <button 
                      onClick={() => romInputRef.current?.click()}
                      className="rom-button inline-block"
                    >
                      SELECT .Z64 FILE
                    </button>
                    <input 
                      type="file" 
                      accept=".z64,.n64" 
                      className="hidden" 
                      onChange={handleRomUpload}
                      ref={romInputRef}
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                    />
                  <p className="text-gray-500 mt-4 text-xs italic">
                    * Legally required: Use your own backup files (.z64 only).
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                   <div className="text-blue-500 font-mono text-2xl tracking-[0.2em] mb-4">
                     M A R I O - 6 4
                   </div>
                   <div className="text-[10px] text-gray-500 font-mono">
                     EMULATION LAYER ACTIVE - JIT ENABLED
                   </div>
                   {/* SCANLINES EFFECT */}
                   <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                </div>
              )}
            </div>

            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-4 flex gap-3">
              <button 
                onClick={handleBoot}
                disabled={!romLoaded || isBooting}
                className={`game-button ${(!romLoaded || isBooting) ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                title="Start Emulation"
              >
                <Play size={18} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsBooting(false)}
                disabled={!isBooting}
                className={`game-button ${!isBooting ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                title="Stop"
              >
                <Square size={16} fill="currentColor" />
              </button>
              <button 
                onClick={handleReset}
                className="game-button"
                title="Reset System"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono bg-black/50 px-2 py-1 rounded">
               BUFFER: OK | PACKETS: 1024KB/S
            </div>
          </div>
          
          <div className="h-10 bg-[#333] flex items-center px-4 justify-between text-white text-[10px] font-bold tracking-tight shrink-0 border-t border-[#444]">
            <div className="flex gap-4">
              <span>FPS: {isBooting ? "60.0" : "00.0"} / 60</span>
              <span>RENDER: OGL-PLUGIN</span>
            </div>
            <span className="uppercase tracking-[0.2em] text-gray-400">NINTENDO 64 EMULATION LAYER</span>
            <div className="flex gap-4 text-right">
              <span>ROM: {romLoaded ? "VALID" : "NONE"}</span>
              <span>RAM: 8MB (EXPANSION PAK)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Panel Controls */}
        <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1">
          
          {/* Mods / Powers System */}
          <section className="retro-card">
            <h3 className="retro-header-label flex items-center justify-between">
              <span className="flex items-center gap-2"><Cpu size={14} /> Power Mods Engine</span>
              <span className="text-[9px] bg-red-600 px-1 animate-pulse">V3.0</span>
            </h3>
            <div className="bg-black p-2 mb-3 border border-[#666] flex items-center justify-between">
              <span className="text-[10px] text-green-500 font-mono">MOD_ENGINE: {isBooting ? "ACTIVE" : "STANDBY"}</span>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-3 ${isBooting ? 'bg-green-500' : 'bg-green-900'} border border-black`}></div>)}
              </div>
            </div>
            <div className="space-y-2 h-[210px] overflow-y-auto pr-1 bg-white border border-[#ccc] p-2 shadow-inner">
              {[
                { id: 'jump', label: 'Moon Jump (Infinite)', active: false, color: 'text-blue-600' },
                { id: 'inv', label: 'God Mode (Invincibility)', active: false, color: 'text-red-600' },
                { id: 'speed', label: 'Hyper Speed (2x)', active: false, color: 'text-green-600' },
                { id: 'gravity', label: 'Low-Gravity Physics', active: true, color: 'text-purple-600' },
                { id: 'fly', label: 'Always Wing Cap', active: false, color: 'text-yellow-600' },
                { id: 'level', label: 'Unlock All Levels', active: false, color: 'text-orange-600' },
                { id: 'cam', label: 'Free-Look Debug Cam', active: true, color: 'text-gray-600' },
              ].map((mod) => (
                <label key={mod.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-[#ddd] hover:bg-blue-50 cursor-pointer transition-all group border-l-4 hover:border-l-blue-500">
                  <input type="checkbox" defaultChecked={mod.active} className="w-4 h-4 accent-blue-600 shrink-0" />
                  <span className={`text-[11px] font-black uppercase tracking-tighter ${mod.color}`}>{mod.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-gradient-to-b from-blue-100 to-blue-300 border border-blue-400 py-1.5 text-[9px] font-black text-blue-800 hover:from-white hover:to-blue-200 shadow-sm transition-all uppercase">
                Inject Script
              </button>
              <button className="flex-1 bg-gradient-to-b from-red-100 to-red-300 border border-red-400 py-1.5 text-[9px] font-black text-red-800 hover:from-white hover:to-red-200 shadow-sm transition-all uppercase">
                Dump RAM
              </button>
            </div>
          </section>

          {/* ROM Hacks */}
          <section className="retro-card flex-1 flex flex-col min-h-[300px]">
            <h3 className="retro-header-label flex items-center gap-2">
              <Settings size={14} /> ROM Hack Patching
            </h3>
            <div className="flex-1 bg-white border border-[#ccc] p-2 flex flex-col gap-2 overflow-y-auto shadow-inner">
              <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="text-[11px] font-bold text-blue-700">SM64: Star Road</span>
                <span className="text-[9px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded-sm font-bold border border-green-300">PATCHED</span>
              </div>
              <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-bold">SM64: Last Impact</span>
                <button 
                  onClick={() => { setRomHackPatched(true); setStatus('HACK APPLIED: LAST IMPACT'); }}
                  className="text-[9px] bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm font-bold transition-colors"
                >
                  APPLY
                </button>
              </div>
              <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-bold">B3313 v0.9 (Personalized)</span>
                <button className="text-[9px] bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm font-bold transition-colors">APPLY</button>
              </div>
              <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-bold">Green Comet Hack</span>
                <button className="text-[9px] bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm font-bold transition-colors">APPLY</button>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#ccc]">
              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-3 flex items-start gap-2">
                <ShieldAlert size={16} className="text-yellow-600 shrink-0" />
                <p className="text-[9px] leading-tight text-yellow-800 font-medium font-sans">
                  AVISO: O patching de ROM Hacks pode levar até 30 segundos dependendo do tamanho do .BPS
                </p>
              </div>
              <button className="w-full bg-gradient-to-b from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 text-white font-bold py-2.5 rounded shadow-md border border-blue-900 text-xs tracking-wider transition-all flex items-center justify-center gap-2">
                <Download size={14} /> UPLOAD .BPS / .IPS
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer / Stats */}
      <footer className="h-8 bg-[#444] text-[#aaa] text-[10px] flex items-center px-4 justify-between shrink-0 border-t border-black">
        <div>Copyright &copy; 2008 Emulator Project Team. All ROMs are property of their owners. Developed for DSL-X Networks.</div>
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
            <span>CPU: {isBooting ? "24.1%" : "0.5%"}</span>
          </div>
          <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_#eab308]" />
             <span>GPU: {isBooting ? "12.5%" : "0.0%"}</span>
          </div>
          <span className="text-white font-bold bg-[#555] px-2 py-0.5 rounded-sm">CONTROLLER: READY (P1)</span>
        </div>
      </footer>
    </div>
  );
}

