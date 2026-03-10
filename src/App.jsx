import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { Volume2, VolumeX, MapPin, Bus as BusIcon, Calendar, Phone, Star, Menu, X, CheckCircle } from 'lucide-react'
import Scene from './Scene'
import './App.css'

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error(error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', background: 'white', padding: '20px', zIndex: 9999, position: 'fixed', inset: 0, overflow: 'auto' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const destinations = [
    { name: 'KERALA EXPLORER', route: 'Kochi · Munnar · Alleppey', tag: '7 DAYS / 6 NIGHTS', price: '₹12,499', per: 'PER PERSON' },
    { name: 'HILL STATION ESCAPE', route: 'Ooty · Kodaikanal', tag: '5 DAYS / 4 NIGHTS', price: '₹9,999', per: 'PER PERSON' },
    { name: 'COASTAL RETREAT', route: 'Varkala · Kovalam · Trivandrum', tag: '4 DAYS / 3 NIGHTS', price: '₹8,799', per: 'PER PERSON' },
    { name: 'TEMPLE CIRCUIT', route: 'Madurai · Rameswaram · Kanyakumari', tag: '6 DAYS / 5 NIGHTS', price: '₹10,499', per: 'PER PERSON' },
]

const reviews = [
    { text: "The Scania bus was immaculate. The driver was professional, and we reached Munnar exactly on schedule. A class apart.", name: "ARJUN R. — BANGALORE", stars: 5 },
    { text: "Booked for our family trip to Ooty. The AC was perfect and the seats were far more comfortable than what I expected at this price.", name: "PRIYA M. — CHENNAI", stars: 5 },
    { text: "What an experience! The onboard entertainment and the GPS tracking made us feel completely safe throughout the Kerala tour.", name: "ARUN K. — HYDERABAD", stars: 5 },
]

// ─── Scroll controller – lives inside Canvas so it has access to useScroll ───
function ScrollController({ scrollToRef, onSectionChange }) {
    const scroll = useScroll()

    useEffect(() => {
        const el = scroll.el
        if (!el) return

        // Expose scroll function to parent (outside Canvas)
        scrollToRef.current = (page) => {
            const maxScroll = el.scrollHeight - el.clientHeight
            el.scrollTo({ top: (page / 5) * maxScroll, behavior: 'smooth' })
        }

        // Track active section
        const onScroll = () => {
            const maxScroll = el.scrollHeight - el.clientHeight
            const progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0
            onSectionChange(Math.round(progress * 4))
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [scroll.el])

    return null
}

// ─── Branded loading screen ────────────────────────────────────────────────────
const Loader = () => (
    <div className="scene-loader">
        <div className="loader-logo">
            <div className="loader-box" />
            <span>TRAVELS 3D</span>
        </div>
        <div className="loader-bar-container">
            <div className="loader-bar" />
        </div>
        <div className="loader-hint">INITIALIZING 3D ENGINE</div>
    </div>
)

const SECTION_LABELS = ['HERO', 'FLEET', 'DESTINATIONS', 'REVIEWS', 'BOOK']

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
    const [isMuted, setIsMuted] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(0)
    const [toast, setToast] = useState(null)
    const [cursor, setCursor] = useState({ x: -100, y: -100 })
    const [cursorActive, setCursorActive] = useState(false)

    const audioRef = useRef(null)
    const scrollToRef = useRef(null)

    // Mouse tracking for custom cursor
    useEffect(() => {
        const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY })
        const onDown = () => setCursorActive(true)
        const onUp = () => setCursorActive(false)
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mousedown', onDown)
        window.addEventListener('mouseup', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mousedown', onDown)
            window.removeEventListener('mouseup', onUp)
        }
    }, [])

    const scrollTo = useCallback((page) => {
        scrollToRef.current?.(page)
        setMobileMenuOpen(false)
    }, [])

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) { audioRef.current.play().catch(() => { }) }
            else { audioRef.current.pause() }
        }
        setIsMuted(p => !p)
    }

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 4500)
    }

    const handleBooking = (e) => {
        e.preventDefault()
        showToast("Request received! We'll confirm your seat within 2 hours.")
    }

    return (
        <ErrorBoundary>
            {/* ── Custom Cursor ── */}
            <div
                className={`custom-cursor ${cursorActive ? 'active' : ''}`}
                style={{ left: cursor.x, top: cursor.y }}
            />

            <div className="app-container">
                <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

                <div className="canvas-container">
                    <Canvas shadows camera={{ position: [0, 0.5, 6], fov: 40 }}>
                        <Suspense fallback={null}>
                            <ScrollControls pages={5} damping={0.25}>
                                <ScrollController
                                    scrollToRef={scrollToRef}
                                    onSectionChange={setActiveSection}
                                />
                                <Scene />
                                <Scroll html>
                                    {/* ── HERO ── */}
                                    <div className="hero-section section">
                                        <div className="content-card">
                                            <div className="badge">PREMIUM TRAVELS · EST. 2012</div>
                                            <h1>Redefining<br />Journeys</h1>
                                            <p>Experience South India like never before. Luxury coaches, expert drivers, and handcrafted itineraries — all in one package.</p>
                                            <div className="cta-group">
                                                <button className="primary-btn" onClick={() => scrollTo(1)}>Plan Your Trip</button>
                                                <button className="secondary-btn" onClick={() => scrollTo(1)}>View Fleet</button>
                                            </div>
                                            <div className="stats-row">
                                                <div className="stat-item"><div className="stat-number">12<span>K+</span></div><div className="stat-label">HAPPY TRAVELLERS</div></div>
                                                <div className="stat-item"><div className="stat-number">8<span>+</span></div><div className="stat-label">YEARS EXPERIENCE</div></div>
                                                <div className="stat-item"><div className="stat-number">50<span>+</span></div><div className="stat-label">DESTINATIONS</div></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── FLEET ── */}
                                    <div className="fleet-section section">
                                        <div className="content-card">
                                            <div className="section-header">
                                                <BusIcon size={28} color="#ff0000" />
                                                <h2>Our Elite Fleet</h2>
                                            </div>
                                            <div className="bus-grid">
                                                {[
                                                    ['VOLVO 9600', 'Semi-Sleeper, Multi-Axle, AC, Bio-Toilet', 'PREMIUM'],
                                                    ['SCANIA METROLINK', 'Luxury Seater, 44 Seats, Full HD Entertainment', 'LUXURY'],
                                                    ['BHARATBENZ AC', 'Executive Class, Reclining Seats, GPS Tracking', 'EXECUTIVE'],
                                                    ['MERCEDES TOURISMO', 'VIP Cabin, Personal AC Vents, Panoramic Roof', 'VIP'],
                                                ].map(([name, desc, badge]) => (
                                                    <div className="bus-item" key={name}>
                                                        <div><span className="bus-type">{name}</span><p>{desc}</p></div>
                                                        <span className="bus-badge">{badge}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── DESTINATIONS ── */}
                                    <div className="packages-section section section-right">
                                        <div className="content-card">
                                            <div className="section-header">
                                                <MapPin size={28} color="#ff0000" />
                                                <h2>South India Tours</h2>
                                            </div>
                                            <div className="packages-container">
                                                {destinations.map(d => (
                                                    <div className="destination-pkg" key={d.name} onClick={() => scrollTo(4)}>
                                                        <div className="pkg-info">
                                                            <h3>{d.name}</h3>
                                                            <span>{d.route}</span>
                                                            <div className="pkg-tag">{d.tag}</div>
                                                        </div>
                                                        <div className="pkg-price">{d.price}<small>{d.per}</small></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── REVIEWS ── */}
                                    <div className="reviews-section section">
                                        <div className="content-card" style={{ maxWidth: '620px' }}>
                                            <div className="section-header">
                                                <Star size={28} color="#ff0000" />
                                                <h2>What They Say</h2>
                                            </div>
                                            <div className="reviews-container">
                                                {reviews.map((r, i) => (
                                                    <div className="review-card" key={i}>
                                                        <div className="review-stars">{'★'.repeat(r.stars)}</div>
                                                        <p className="review-text">"{r.text}"</p>
                                                        <div className="reviewer-name">— {r.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── BOOKING ── */}
                                    <div className="booking-section section section-right">
                                        <div className="content-card booking-card" style={{ maxWidth: '600px' }}>
                                            <div className="section-header">
                                                <Calendar size={28} color="#ff0000" />
                                                <h2>Book Your Journey</h2>
                                            </div>
                                            <p>Ready to depart? Fill in your details and we will confirm your seat within hours.</p>
                                            <form className="booking-form" onSubmit={handleBooking}>
                                                <div className="booking-form-row">
                                                    <input type="text" placeholder="From City" required />
                                                    <input type="text" placeholder="To Destination" required />
                                                </div>
                                                <div className="booking-form-row">
                                                    <input type="date" required />
                                                    <input type="number" placeholder="No. of Passengers" min="1" max="50" required />
                                                </div>
                                                <select defaultValue="">
                                                    <option value="" disabled>Select Bus Type</option>
                                                    <option>VOLVO 9600 (Premium)</option>
                                                    <option>SCANIA METROLINK (Luxury)</option>
                                                    <option>BHARATBENZ AC (Executive)</option>
                                                    <option>MERCEDES TOURISMO (VIP)</option>
                                                </select>
                                                <button type="submit" className="primary-btn full-width">Check Availability →</button>
                                            </form>
                                            <div className="support-cta">
                                                <Phone size={14} />
                                                <span>24/7 SUPPORT: +91 98765 43210</span>
                                            </div>
                                        </div>
                                    </div>
                                </Scroll>
                            </ScrollControls>
                        </Suspense>
                    </Canvas>
                </div>

                {/* ── Loading overlay (shown until Canvas is ready) ── */}
                <Suspense fallback={<Loader />}><span /></Suspense>

                {/* ── HUD NAV ── */}
                <nav className="hud-nav">
                    <div className="logo-section">
                        <div className="logo-box" />
                        <span className="logo-text">TRAVELS 3D</span>
                    </div>
                    <div className="nav-links">
                        <span className={activeSection === 1 ? 'active' : ''} onClick={() => scrollTo(1)}>FLEET</span>
                        <span className={activeSection === 2 ? 'active' : ''} onClick={() => scrollTo(2)}>DESTINATIONS</span>
                        <span className={activeSection === 3 ? 'active' : ''} onClick={() => scrollTo(3)}>REVIEWS</span>
                        <button className="book-nav-btn" onClick={() => scrollTo(4)}>BOOK NOW</button>
                    </div>
                    <div className="nav-right">
                        <button className="audio-toggle" onClick={toggleMute} title={isMuted ? 'Play Music' : 'Mute Music'}>
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(p => !p)} aria-label="Menu">
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>

                {/* ── Mobile Menu ── */}
                {mobileMenuOpen && (
                    <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
                            <span className="mobile-nav-link" onClick={() => scrollTo(1)}>FLEET</span>
                            <span className="mobile-nav-link" onClick={() => scrollTo(2)}>DESTINATIONS</span>
                            <span className="mobile-nav-link" onClick={() => scrollTo(3)}>REVIEWS</span>
                            <button className="primary-btn" style={{ marginTop: '1rem', width: '100%' }} onClick={() => scrollTo(4)}>BOOK NOW</button>
                        </div>
                    </div>
                )}

                {/* ── Section Progress Dots ── */}
                <div className="section-dots">
                    {SECTION_LABELS.map((label, i) => (
                        <button
                            key={i}
                            className={`section-dot ${activeSection === i ? 'active' : ''}`}
                            onClick={() => scrollTo(i)}
                            title={label}
                            aria-label={`Go to ${label}`}
                        />
                    ))}
                </div>

                {/* ── HUD Decorations ── */}
                <div className="hud-deco top-right">
                    <div>STATUS: ACTIVE</div>
                    <div>SCAN_ID: 0x92F1</div>
                    <div>FPS: 60</div>
                </div>
                <div className="hud-deco bottom-left">
                    <div>© 2024 PREMIUM TRAVELS</div>
                    <div>SOUTH INDIA SPECIALIST</div>
                </div>
                <div className="hud-deco bottom-right">
                    <div>LAT: 10.8505° N</div>
                    <div>LON: 76.2711° E</div>
                </div>

                <div className="scroll-indicator">
                    <div className="mouse"><div className="wheel" /></div>
                    <span>SCROLL TO EXPLORE</span>
                </div>

                {/* ── Toast Notification ── */}
                {toast && (
                    <div className={`toast toast-${toast.type}`}>
                        <CheckCircle size={18} />
                        <span>{toast.msg}</span>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    )
}

export default App
