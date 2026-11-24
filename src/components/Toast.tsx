import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'alert' | 'info';

interface ToastProps {
    message: string;
    tone?: ToastTone;
    title?: string;
    duration?: number;
    onClose: () => void;
}

const toneStyles: Record<ToastTone, { badge: string; rail: string; icon: typeof CheckCircle2; label: string }> = {
    success: {
        badge: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
        rail: 'bg-emerald-500',
        icon: CheckCircle2,
        label: 'All set',
    },
    alert: {
        badge: 'bg-rose-50 text-rose-600 ring-rose-500/20',
        rail: 'bg-rose-500',
        icon: AlertCircle,
        label: 'Action needed',
    },
    info: {
        badge: 'bg-blue-50 text-blue-600 ring-blue-500/20',
        rail: 'bg-blue-500',
        icon: Info,
        label: 'Good to know',
    },
};

const Toast = ({ message, tone = 'success', title, duration = 4200, onClose }: ToastProps) => {
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = window.setTimeout(onClose, duration);
        return () => window.clearTimeout(timer);
    }, [duration, onClose, paused]);

    const { badge, rail, icon: Icon, label } = toneStyles[tone];

    return (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[500] flex justify-end sm:inset-x-auto sm:bottom-6 sm:right-6">
            <motion.div
                role={tone === 'alert' ? 'alert' : 'status'}
                aria-live={tone === 'alert' ? 'assertive' : 'polite'}
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-4 pl-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl"
            >
                <span className={`absolute inset-y-3 left-0 w-1 rounded-full ${rail}`} aria-hidden="true" />
                <div className="flex items-start gap-3.5">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${badge}`}>
                        <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{title ?? label}</p>
                        <p className="mt-1 text-sm font-medium leading-snug text-slate-900">{message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss notification"
                        className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
                <span
                    className={`toast-progress absolute bottom-0 left-0 h-0.5 w-full ${rail}`}
                    style={{
                        animationPlayState: paused ? 'paused' : 'running',
                        '--toast-duration': `${duration}ms`,
                    } as CSSProperties}
                    aria-hidden="true"
                />
            </motion.div>
        </div>
    );
};

export default Toast;
