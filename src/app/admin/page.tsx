"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Stethoscope, Eye, EyeOff, Loader2 } from "lucide-react";
import { findMany } from "@/integrations/mongodb/utils";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if already logged in
        const session = localStorage.getItem('adminSession');
        if (session) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Find user in MongoDB
            const { data: userData } = await findMany("users", { email, password });

            if (!userData || userData.length === 0) {
                setError("Invalid email or password.");
                setLoading(false);
                return;
            }

            const user = userData[0];

            // Check for admin role
            const { data: roleData } = await findMany("user_roles", {
                user_id: user._id.toString(),
                role: "admin"
            });

            if (!roleData || roleData.length === 0) {
                setError("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }

            // Store session
            localStorage.setItem('adminSession', JSON.stringify({
                userId: user._id.toString(),
                email: user.email,
                isAdmin: true
            }));

            router.push('/admin/dashboard');
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-hero)" }}>
            <div className="w-full max-w-sm animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft"
                        style={{ background: "var(--gradient-primary)" }}>
                        <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>DentaCare Admin</h1>
                    <p className="text-sm text-muted-foreground mt-1">Sign in to your dashboard</p>
                </div>

                <div className="card-dental p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input className="input-dental" type="email" placeholder=""
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input className="input-dental pr-10" type={showPw ? "text" : "password"} placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-xs text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">{error}</div>
                        )}

                        <button type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
