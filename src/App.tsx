import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Globe, 
  Monitor, 
  Battery, 
  Wifi, 
  Lock, 
  Eye, 
  AlertTriangle,
  ChevronRight,
  Activity
} from 'lucide-react';

interface ScanData {
  ip: string;
  location: string;
  browser: string;
  os: string;
  deviceType: string;
  resolution: string;
  timezone: string;
  language: string;
  cookies: string;
  gpu: string;
  network: string;
  battery: string;
}

export default function App() {
  const [step, setStep] = useState<'intro' | 'scanning' | 'results'>('intro');
  const [progress, setProgress] = useState(0);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getGPU = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
    return 'Unknown GPU';
  };

  const startScan = async () => {
    setStep('scanning');
    addLog('Initializing system scan...');
    
    // Simulate progress and data gathering
    const steps = [
      { p: 10, m: 'Accessing browser environment...' },
      { p: 25, m: 'Querying navigator API...' },
      { p: 40, m: 'Retrieving hardware specifications...' },
      { p: 60, m: 'Detecting network configuration...' },
      { p: 80, m: 'Fetching geolocation data...' },
      { p: 100, m: 'Scan complete. Compiling report.' }
    ];

    for (const s of steps) {
      await new Promise(r => setTimeout(r, 800));
      setProgress(s.p);
      addLog(s.m);
    }

    try {
      // Real data gathering
      const ipRes = await fetch('https://ipapi.co/json/').then(res => res.json());
      
      let batteryInfo = 'Not available';
      try {
        // @ts-ignore
        const battery = await navigator.getBattery();
        batteryInfo = `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`;
      } catch (e) {}

      const data: ScanData = {
        ip: ipRes.ip || 'Unknown',
        location: `${ipRes.city || 'Unknown'}, ${ipRes.country_name || 'Unknown'}`,
        browser: `${navigator.userAgent.split(' ').pop()}`,
        os: navigator.platform,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        resolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
        gpu: getGPU(),
        // @ts-ignore
        network: navigator.connection ? `${navigator.connection.effectiveType} (~${navigator.connection.downlink} Mbps)` : 'Unknown',
        battery: batteryInfo
      };

      setScanData(data);
      setStep('results');
    } catch (error) {
      addLog('Error: Failed to fetch external data. Proceeding with local scan.');
      // Fallback
      setScanData({
        ip: 'Hidden/Blocked',
        location: 'Unknown',
        browser: navigator.userAgent,
        os: navigator.platform,
        deviceType: 'Unknown',
        resolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
        gpu: getGPU(),
        network: 'Unknown',
        battery: 'Unknown'
      });
      setStep('results');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-neon-green p-4 md:p-8 relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="scanline pointer-events-none" />
      
      {/* Background Matrix-ish Effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none matrix-bg select-none overflow-hidden text-[10px] leading-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap">
            {Array.from({ length: 100 }).map((_, j) => (
              <span key={j} className="mx-1">
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-20">
        <header className="mb-12 border-b border-neon-green/30 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold tracking-widest glow-text">CYBER_SCAN v2.4.0</h1>
              <p className="text-xs opacity-60">AWARENESS TOOLKIT // DEVICE_FINGERPRINTING_DEMO</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              <span>SYSTEM_ONLINE</span>
            </div>
            <span className="opacity-40">|</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-neon-green/50 bg-black/80 p-8 rounded-lg glow-border"
            >
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-yellow-500 shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2">SECURITY PERMISSION REQUESTED</h2>
                  <p className="text-sm opacity-80 leading-relaxed">
                    This demonstration will scan your browser environment to show what information 
                    websites can detect about your device without your explicit consent. 
                    This is for educational purposes to demonstrate device fingerprinting.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => alert('Access denied. Awareness session terminated.')}
                  className="px-6 py-2 border border-neon-green/30 hover:bg-red-900/20 hover:border-red-500 hover:text-red-500 transition-all uppercase text-sm tracking-widest"
                >
                  Reject Scan
                </button>
                <button 
                  onClick={startScan}
                  className="px-6 py-2 bg-neon-green text-black font-bold hover:bg-white transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2"
                >
                  Allow Scan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'scanning' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter animate-pulse">SCANNING_SYSTEM...</h2>
                <div className="w-full h-4 bg-neon-green/10 border border-neon-green/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-neon-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm font-mono">{progress}% COMPLETE</p>
              </div>

              <div className="bg-black border border-neon-green/20 p-4 h-48 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-neon-green/40 shrink-0">{'>'}</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          )}

          {step === 'results' && scanData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2 bg-red-900/10 border border-red-500/30 p-4 rounded flex items-center gap-4 mb-2">
                <Eye className="w-6 h-6 text-red-500" />
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
                  Warning: The following data was extracted using standard browser APIs. 
                  This demonstrates how websites can fingerprint your unique identity.
                </p>
              </div>

              <ResultCard 
                icon={<Globe className="w-5 h-5" />} 
                title="Network Identity"
                items={[
                  { label: 'Public IP', value: scanData.ip },
                  { label: 'Location', value: scanData.location },
                  { label: 'Timezone', value: scanData.timezone },
                  { label: 'Network', value: scanData.network },
                ]}
              />

              <ResultCard 
                icon={<Monitor className="w-5 h-5" />} 
                title="Hardware Profile"
                items={[
                  { label: 'Device Type', value: scanData.deviceType },
                  { label: 'OS', value: scanData.os },
                  { label: 'Resolution', value: scanData.resolution },
                  { label: 'Battery', value: scanData.battery },
                ]}
              />

              <ResultCard 
                icon={<Terminal className="w-5 h-5" />} 
                title="Software Environment"
                items={[
                  { label: 'Browser', value: scanData.browser },
                  { label: 'Language', value: scanData.language },
                  { label: 'Cookies', value: scanData.cookies },
                ]}
              />

              <ResultCard 
                icon={<Cpu className="w-5 h-5" />} 
                title="Graphics Engine"
                items={[
                  { label: 'GPU Renderer', value: scanData.gpu },
                ]}
              />

              <div className="md:col-span-2 mt-8 p-6 border border-neon-green/30 bg-neon-green/5 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest">Privacy Recommendations</h3>
                </div>
                <ul className="text-sm space-y-2 opacity-80 list-disc list-inside">
                  <li>Use a VPN to mask your Public IP and location.</li>
                  <li>Enable "Do Not Track" and use privacy-focused browsers like Brave or Firefox.</li>
                  <li>Regularly clear cookies and use extensions like uBlock Origin.</li>
                  <li>Be aware that even without cookies, hardware "fingerprints" can identify you.</li>
                </ul>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 w-full py-3 border border-neon-green hover:bg-neon-green hover:text-black transition-all font-bold uppercase tracking-widest"
                >
                  Restart Security Audit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center opacity-30 text-[10px] uppercase tracking-[0.2em]">
          End of transmission // Secure connection established // Stay vigilant
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(57, 255, 20, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.3);
        }
      `}</style>
    </div>
  );
}

function ResultCard({ icon, title, items }: { icon: ReactNode, title: string, items: { label: string, value: string }[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-neon-green/20 bg-black/40 p-5 rounded-lg hover:border-neon-green/50 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-4 text-neon-green/80 group-hover:text-neon-green transition-colors">
        {icon}
        <h3 className="font-bold uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] uppercase opacity-40 tracking-widest">{item.label}</span>
            <span className="text-sm font-mono break-all">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
