import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { Volume2, VolumeX, MapPin, Bus as BusIcon, Calendar, Phone, Star, Menu, X, CheckCircle, Target, Users, Shield, Clock, ChevronDown, ArrowRight, Mail, Headphones } from 'lucide-react'
import Scene from './Scene'
import './App.css'

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error(error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', background: '#000', padding: '20px', zIndex: 9999, position: 'fixed', inset: 0, overflow: 'auto' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error?.toString()}</pre>
                </div>
            )
        }
        return this.props.children
    }
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const busFleet = [
    {
        id: 1, name: 'VOLVO 9600',
        type: 'Semi-Sleeper', seats: 40, badge: 'PREMIUM',
        color: '#1e3a5f',
        specs: ['Multi-Axle', 'Bio-Toilet', 'USB Charging', 'AC'],
        price: '₹1,800/seat', members: '36–40',
    },
    {
        id: 2, name: 'SCANIA METROLINK',
        type: 'Luxury Seater', seats: 44, badge: 'LUXURY',
        color: '#2d1b00',
        specs: ['Full HD', '44 Seats', 'GPS Track', 'Panoramic'],
        price: '₹2,400/seat', members: '40–44',
    },
    {
        id: 3, name: 'BHARATBENZ AC',
        type: 'Executive', seats: 38, badge: 'EXECUTIVE',
        color: '#1a001a',
        specs: ['Reclining', 'GPS Track', 'Reading Lights', 'Mini-Bar'],
        price: '₹2,100/seat', members: '34–38',
    },
    {
        id: 4, name: 'MERCEDES TOURISMO',
        type: 'VIP Cabin', seats: 28, badge: 'VIP',
        color: '#1a1000',
        specs: ['Personal AC', 'Panoramic Roof', 'WiFi', 'Lounge Seats'],
        price: '₹3,500/seat', members: '24–28',
    },
]

const destinations = [
    { name: 'KERALA EXPLORER', route: 'Kochi · Munnar · Alleppey', days: 7, nights: 6, price: '₹12,499', img: '🌴', highlight: 'Backwaters & Tea Hills' },
    { name: 'HILL STATION ESCAPE', route: 'Ooty · Kodaikanal', days: 5, nights: 4, price: '₹9,999', img: '⛰️', highlight: 'Cool Misty Mornings' },
    { name: 'COASTAL RETREAT', route: 'Varkala · Kovalam · Trivandrum', days: 4, nights: 3, price: '₹8,799', img: '🏖️', highlight: 'Sun, Sand & Surf' },
    { name: 'TEMPLE CIRCUIT', route: 'Madurai · Rameswaram · Kanyakumari', days: 6, nights: 5, price: '₹10,499', img: '🕌', highlight: 'Spiritual South India' },
    { name: 'COORG COFFEE TRAIL', route: 'Mysore · Coorg · Chikmagalur', days: 5, nights: 4, price: '₹11,299', img: '☕', highlight: 'Misty Coffee Estates' },
    { name: 'GOA BEACH FIESTA', route: 'North Goa · South Goa · Dudhsagar', days: 4, nights: 3, price: '₹8,499', img: '🎉', highlight: 'Beaches & Nightlife' },
]

const reviews = [
    { text: "The Scania bus was absolutely immaculate. Driver was professional, and we reached Munnar exactly on schedule.", name: "ARJUN R.", city: "BANGALORE", stars: 5 },
    { text: "Booked for our family trip to Ooty. The AC was perfect and seats were far more comfortable than expected at this price.", name: "PRIYA M.", city: "CHENNAI", stars: 5 },
    { text: "Onboard entertainment and GPS tracking made us feel completely safe throughout the Kerala tour. A class apart.", name: "ARUN K.", city: "HYDERABAD", stars: 5 },
    { text: "Best bus travel experience ever! The VIP cabin had WiFi and panoramic roof. Totally worth every rupee.", name: "DIVYA S.", city: "MUMBAI", stars: 5 },
]

const goals = [
    { icon: <Shield size={32} />, title: 'SAFE ARRIVALS', desc: 'Zero-accident record maintained since 2012. Every driver trained with 5+ years highway experience and emergency protocols.' },
    { icon: <Target size={32} />, title: 'PREMIUM COMFORT', desc: 'We believe every journey should feel like business class. Premium interiors, AC, entertainment — guaranteed.' },
    { icon: <Users size={32} />, title: 'COMMUNITY FIRST', desc: 'Supporting 500+ local families through fair employment and partnering with local guides at every destination.' },
    { icon: <Clock size={32} />, title: 'PUNCTUALITY PLEDGE', desc: 'Our GPS-tracked fleet ensures on-time departures and arrivals. Delays under 15 minutes guaranteed or partial refund.' },
]

// ─── Scroll Controller ─────────────────────────────────────────────────────────
function ScrollController({ scrollToRef, onSectionChange }) {
    const scroll = useScroll()
    useEffect(() => {
        const el = scroll.el
        if (!el) return
        scrollToRef.current = (page) => {
            const max = el.scrollHeight - el.clientHeight
            el.scrollTo({ top: (page / 5) * max, behavior: 'smooth' })
        }
        const onScroll = () => {
            const max = el.scrollHeight - el.clientHeight
            const progress = max > 0 ? el.scrollTop / max : 0
            onSectionChange(Math.round(progress * 4))
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [scroll.el])
    return null
}

// ─── Loader ────────────────────────────────────────────────────────────────────
const Loader = () => (
    <div className="scene-loader">
        <div className="loader-logo">
            <div className="loader-icon">🚌</div>
            <span>ROUTE MASTER</span>
        </div>
        <div className="loader-bar-container">
            <div className="loader-bar" />
        </div>
        <div className="loader-hint">LOADING 3D ENGINE · PLEASE WAIT</div>
    </div>
)

// ─── Bus Card (Spinner) ────────────────────────────────────────────────────────
function BusCard({ bus }) {
    const [spinning, setSpinning] = useState(false)
    const [selected, setSelected] = useState(false)
    return (
        <div
            className={`bus-card ${selected ? 'selected' : ''}`}
            onMouseEnter={() => setSpinning(true)}
            onMouseLeave={() => setSpinning(false)}
            onClick={() => setSelected(s => !s)}
        >
            <div className="bus-card-badge">{bus.badge}</div>
            <div className={`bus-spinner ${spinning ? 'spinning' : ''}`}>
                <div className="bus-3d-wrap">
                    <div className="bus-3d-body" style={{ background: `linear-gradient(135deg, ${bus.color}, #000)` }}>
                        <div className="bus-3d-windows" />
                        <div className="bus-3d-stripe" />
                        <div className="bus-3d-front" />
                    </div>
                    <div className="bus-3d-wheels">
                        <div className={`bus-wheel ${spinning ? 'wheel-spin' : ''}`} />
                        <div className={`bus-wheel rear ${spinning ? 'wheel-spin' : ''}`} />
                    </div>
                </div>
            </div>
            <div className="bus-card-info">
                <h3>{bus.name}</h3>
                <div className="bus-card-type">{bus.type}</div>
                <div className="bus-card-specs">
                    {bus.specs.map(s => <span key={s} className="spec-tag">{s}</span>)}
                </div>
                <div className="bus-card-stats">
                    <div className="bus-stat">
                        <span className="bus-stat-num">{bus.seats}</span>
                        <span className="bus-stat-label">SEATS</span>
                    </div>
                    <div className="bus-stat">
                        <span className="bus-stat-num">{bus.members}</span>
                        <span className="bus-stat-label">MEMBERS</span>
                    </div>
                    <div className="bus-stat">
                        <span className="bus-stat-num" style={{ color: '#ff6600', fontSize: '0.8rem' }}>{bus.price}</span>
                        <span className="bus-stat-label">PER SEAT</span>
                    </div>
                </div>
            </div>
            {selected && <div className="bus-selected-mark">✓ SELECTED</div>}
        </div>
    )
}

// ─── Destination Card ──────────────────────────────────────────────────────────
function DestCard({ d }) {
    return (
        <div className="dest-card" onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}>
            <div className="dest-emoji">{d.img}</div>
            <div className="dest-info">
                <div className="dest-tag">{d.days} DAYS / {d.nights} NIGHTS</div>
                <h3>{d.name}</h3>
                <p className="dest-route">{d.route}</p>
                <p className="dest-highlight">{d.highlight}</p>
            </div>
            <div className="dest-price">
                {d.price}
                <small>PER PERSON</small>
                <div className="dest-cta">BOOK NOW <ArrowRight size={12} /></div>
            </div>
        </div>
    )
}

const SECTION_LABELS = ['HERO', 'FLEET', 'DESTINATIONS', 'REVIEWS', 'BOOK']

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
    const [isMuted, setIsMuted] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(0)
    const [toast, setToast] = useState(null)
    const [cursor, setCursor] = useState({ x: -100, y: -100 })
    const [cursorActive, setCursorActive] = useState(false)
    const [bookingForm, setBookingForm] = useState({ from: '', to: '', date: '', days: '1', passengers: '1', bus: '', contact: '' })

    const audioRef = useRef(null)
    const scrollToRef = useRef(null)

    // Custom cursor
    useEffect(() => {
        const onMove = e => setCursor({ x: e.clientX, y: e.clientY })
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
            if (isMuted) audioRef.current.play().catch(() => { })
            else audioRef.current.pause()
        }
        setIsMuted(p => !p)
    }

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 4500)
    }

    const handleBooking = (e) => {
        e.preventDefault()
        showToast("🎉 Request received! We'll confirm your seat within 2 hours.")
    }

    const scrollToWebsite = () => {
        document.getElementById('main-website').scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <ErrorBoundary>
            {/* Custom Cursor */}
            <div className={`custom-cursor ${cursorActive ? 'active' : ''}`} style={{ left: cursor.x, top: cursor.y }} />

            <div className="app-container">
                <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

                {/* ════════════════════════════
                    3D SCROLL SECTION
                ════════════════════════════ */}
                <div className="canvas-container">
                    <Canvas shadows camera={{ position: [0, 0.3, 7], fov: 42 }}>
                        <Suspense fallback={null}>
                            <ScrollControls pages={5} damping={0.22}>
                                <ScrollController scrollToRef={scrollToRef} onSectionChange={setActiveSection} />
                                <Scene />
                                <Scroll html>

                                    {/* ── HERO ── */}
                                    <div className="hero-section section">
                                        <div className="content-card">
                                            <div className="badge">ROUTE MASTER TRAVELS · EST. 2012</div>
                                            <h1>Journey<br />Beyond<br />Limits</h1>
                                            <p>South India's most trusted luxury bus operator. Every journey a destination.</p>
                                            <div className="cta-group">
                                                <button className="primary-btn" onClick={scrollToWebsite}>Explore Now</button>
                                                <button className="secondary-btn" onClick={() => scrollTo(1)}>View Fleet</button>
                                            </div>
                                            <div className="stats-row">
                                                <div className="stat-item"><div className="stat-number">12<span>K+</span></div><div className="stat-label">HAPPY TRAVELLERS</div></div>
                                                <div className="stat-item"><div className="stat-number">12<span>+</span></div><div className="stat-label">YEARS EXPERIENCE</div></div>
                                                <div className="stat-item"><div className="stat-number">50<span>+</span></div><div className="stat-label">DESTINATIONS</div></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── FLEET ── */}
                                    <div className="fleet-section section">
                                        <div className="content-card">
                                            <div className="section-header">
                                                <BusIcon size={28} color="#ff6600" />
                                                <h2>Elite Fleet</h2>
                                            </div>
                                            <div className="bus-grid">
                                                {busFleet.map(b => (
                                                    <div className="bus-item" key={b.id}>
                                                        <div>
                                                            <span className="bus-type">{b.name}</span>
                                                            <p>{b.type} · {b.seats} Seats · {b.specs.slice(0, 2).join(', ')}</p>
                                                        </div>
                                                        <span className="bus-badge">{b.badge}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── DESTINATIONS ── */}
                                    <div className="packages-section section section-right">
                                        <div className="content-card">
                                            <div className="section-header">
                                                <MapPin size={28} color="#ff6600" />
                                                <h2>South India Tours</h2>
                                            </div>
                                            <div className="packages-container">
                                                {destinations.slice(0, 3).map(d => (
                                                    <div className="destination-pkg" key={d.name} onClick={() => scrollTo(4)}>
                                                        <div className="pkg-info">
                                                            <span className="pkg-emoji">{d.img}</span>
                                                            <div>
                                                                <h3>{d.name}</h3>
                                                                <div className="pkg-tag">{d.days} DAYS / {d.nights} NIGHTS</div>
                                                            </div>
                                                        </div>
                                                        <div className="pkg-price">{d.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── REVIEWS ── */}
                                    <div className="reviews-section section">
                                        <div className="content-card" style={{ maxWidth: '620px' }}>
                                            <div className="section-header">
                                                <Star size={28} color="#ff6600" />
                                                <h2>What They Say</h2>
                                            </div>
                                            <div className="reviews-container">
                                                {reviews.slice(0, 3).map((r, i) => (
                                                    <div className="review-card" key={i}>
                                                        <div className="review-stars">{'★'.repeat(r.stars)}</div>
                                                        <p className="review-text">"{r.text}"</p>
                                                        <div className="reviewer-name">— {r.name} · {r.city}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── BOOKING ── */}
                                    <div className="booking-section section section-right">
                                        <div className="content-card booking-card" style={{ maxWidth: '600px' }}>
                                            <div className="section-header">
                                                <Calendar size={28} color="#ff6600" />
                                                <h2>Book Your Journey</h2>
                                            </div>
                                            <p>Quick booking within 2 minutes.</p>
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
                                                    {busFleet.map(b => <option key={b.id}>{b.name} ({b.badge})</option>)}
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

                {/* Loader overlay */}
                <Suspense fallback={<Loader />}><span /></Suspense>

                {/* ── HUD NAV ── */}
                <nav className="hud-nav">
                    <div className="logo-section">
                        <div className="logo-box">🚌</div>
                        <span className="logo-text">ROUTE MASTER</span>
                    </div>
                    <div className="nav-links">
                        <span className={activeSection === 1 ? 'active' : ''} onClick={() => scrollTo(1)}>FLEET</span>
                        <span className={activeSection === 2 ? 'active' : ''} onClick={() => scrollTo(2)}>TOURS</span>
                        <span className={activeSection === 3 ? 'active' : ''} onClick={() => scrollTo(3)}>REVIEWS</span>
                        <span onClick={scrollToWebsite}>PACKAGES</span>
                        <button className="book-nav-btn" onClick={() => scrollTo(4)}>BOOK NOW</button>
                    </div>
                    <div className="nav-right">
                        <button className="audio-toggle" onClick={toggleMute} title={isMuted ? 'Play' : 'Mute'}>
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(p => !p)} aria-label="Menu">
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
                            <span className="mobile-nav-link" onClick={() => scrollTo(1)}>FLEET</span>
                            <span className="mobile-nav-link" onClick={() => scrollTo(2)}>TOURS</span>
                            <span className="mobile-nav-link" onClick={() => scrollTo(3)}>REVIEWS</span>
                            <span className="mobile-nav-link" onClick={scrollToWebsite}>PACKAGES</span>
                            <button className="primary-btn" style={{ marginTop: '1rem', width: '100%' }} onClick={() => scrollTo(4)}>BOOK NOW</button>
                        </div>
                    </div>
                )}

                {/* Section Progress Dots */}
                <div className="section-dots">
                    {SECTION_LABELS.map((label, i) => (
                        <button key={i} className={`section-dot ${activeSection === i ? 'active' : ''}`}
                            onClick={() => scrollTo(i)} title={label} aria-label={`Go to ${label}`} />
                    ))}
                </div>

                {/* HUD Decorations */}
                <div className="hud-deco top-right">
                    <div>STATUS: MOVING</div>
                    <div>SPEED: 82 KM/H</div>
                    <div>ETA: 4H 22M</div>
                </div>
                <div className="hud-deco bottom-left">
                    <div>© 2025 ROUTE MASTER TRAVELS</div>
                    <div>DEVELOPED BY ECOG CORE TECHNOLOGY</div>
                </div>
                <div className="hud-deco bottom-right">
                    <div>LAT: 10.8505° N</div>
                    <div>LON: 76.2711° E</div>
                </div>

                {/* Scroll Down Arrow (to 3D scroll) */}
                <div className="scroll-indicator">
                    <div className="mouse"><div className="wheel" /></div>
                    <span>SCROLL TO EXPLORE</span>
                </div>

                {/* Enter website arrow */}
                <button className="enter-website-btn" onClick={scrollToWebsite} title="Enter Website">
                    <ChevronDown size={24} />
                    <span>ENTER SITE</span>
                </button>

                {/* Toast */}
                {toast && (
                    <div className={`toast toast-${toast.type}`}>
                        <CheckCircle size={18} />
                        <span>{toast.msg}</span>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════
                FULL HTML WEBSITE — after 3D scroll
            ════════════════════════════════════════════════════ */}
            <div id="main-website" className="main-website">

                {/* ── Website Nav ── */}
                <nav className="site-nav">
                    <div className="site-logo">
                        <span className="site-logo-icon">🚌</span>
                        <span>ROUTE MASTER</span>
                    </div>
                    <div className="site-nav-links">
                        <a href="#fleet-section">Our Fleet</a>
                        <a href="#packages-section">Packages</a>
                        <a href="#goals-section">About Us</a>
                        <a href="#contact-section">Contact</a>
                        <a href="#booking-section" className="site-book-btn">Book Now</a>
                    </div>
                </nav>

                {/* ── Site Hero Banner ── */}
                <section className="site-hero">
                    <div className="site-hero-content">
                        <div className="site-hero-badge">SOUTH INDIA'S #1 BUS OPERATOR</div>
                        <h1 className="site-hero-title">Every Journey is a <span>Safe Destination</span></h1>
                        <p className="site-hero-sub">Premium coaches · Expert drivers · Unforgettable itineraries · 12+ years of safe journeys across South India</p>
                        <div className="site-hero-cta">
                            <a href="#booking-section" className="site-primary-btn">Plan My Trip <ArrowRight size={16} /></a>
                            <a href="#fleet-section" className="site-secondary-btn">View Fleet</a>
                        </div>
                        <div className="site-hero-stats">
                            <div className="site-stat"><strong>12,000+</strong><span>Happy Travellers</span></div>
                            <div className="site-stat"><strong>50+</strong><span>Destinations</span></div>
                            <div className="site-stat"><strong>0</strong><span>Accidents Since 2012</span></div>
                            <div className="site-stat"><strong>24/7</strong><span>Customer Support</span></div>
                        </div>
                    </div>
                    <div className="site-hero-visual">
                        <div className="hero-bus-css">
                            <div className="hb-body">
                                <div className="hb-windows" />
                                <div className="hb-stripe" />
                                <div className="hb-front">
                                    <div className="hb-windshield" />
                                    <div className="hb-lights" />
                                </div>
                            </div>
                            <div className="hb-wheels">
                                <div className="hb-wheel spinning" />
                                <div className="hb-wheel rear spinning" />
                            </div>
                            <div className="hb-road" />
                        </div>
                    </div>
                </section>

                {/* ── Fleet Section ── */}
                <section id="fleet-section" className="site-section fleet-bg">
                    <div className="site-container">
                        <div className="site-section-header">
                            <div className="section-pill">OUR FLEET</div>
                            <h2>Choose Your <span>Perfect Coach</span></h2>
                            <p>From semi-sleepers to VIP cabins — every bus meets our 50-point quality checklist</p>
                        </div>
                        <div className="fleet-spinner-grid">
                            {busFleet.map(bus => <BusCard key={bus.id} bus={bus} />)}
                        </div>
                    </div>
                </section>

                {/* ── Packages / Destinations ── */}
                <section id="packages-section" className="site-section">
                    <div className="site-container">
                        <div className="site-section-header">
                            <div className="section-pill">TOUR PACKAGES</div>
                            <h2>Handcrafted <span>South India Tours</span></h2>
                            <p>Explore 6 curated tour packages designed for maximum comfort and memorable experiences</p>
                        </div>
                        <div className="dest-grid">
                            {destinations.map(d => <DestCard key={d.name} d={d} />)}
                        </div>
                    </div>
                </section>

                {/* ── Booking Section ── */}
                <section id="booking-section" className="site-section booking-bg">
                    <div className="site-container booking-container">
                        <div className="booking-left">
                            <div className="section-pill">BOOK YOUR RIDE</div>
                            <h2>Reserve Your <span>Seat Today</span></h2>
                            <p>Fill in your travel details and our team will confirm availability within 2 hours with a custom quote.</p>
                            <div className="booking-promises">
                                <div className="promise-item"><CheckCircle size={16} /><span>No hidden charges</span></div>
                                <div className="promise-item"><CheckCircle size={16} /><span>Free cancellation (48h)</span></div>
                                <div className="promise-item"><CheckCircle size={16} /><span>Instant confirmation</span></div>
                                <div className="promise-item"><CheckCircle size={16} /><span>24/7 on-trip support</span></div>
                            </div>
                        </div>
                        <div className="booking-right">
                            <form className="site-booking-form" onSubmit={handleBooking}>
                                <h3>Trip Details</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>From City</label>
                                        <input type="text" placeholder="e.g. Chennai" required value={bookingForm.from} onChange={e => setBookingForm(f => ({ ...f, from: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>To Destination</label>
                                        <input type="text" placeholder="e.g. Munnar" required value={bookingForm.to} onChange={e => setBookingForm(f => ({ ...f, to: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Travel Date</label>
                                        <input type="date" required value={bookingForm.date} onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>No. of Days</label>
                                        <select value={bookingForm.days} onChange={e => setBookingForm(f => ({ ...f, days: e.target.value }))}>
                                            {[2, 3, 4, 5, 6, 7, 8, 10].map(d => <option key={d}>{d} Days</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Passengers</label>
                                        <input type="number" placeholder="No. of travellers" min="1" max="50" required value={bookingForm.passengers} onChange={e => setBookingForm(f => ({ ...f, passengers: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Bus Type</label>
                                        <select value={bookingForm.bus} onChange={e => setBookingForm(f => ({ ...f, bus: e.target.value }))}>
                                            <option value="" disabled>Select coach</option>
                                            {busFleet.map(b => <option key={b.id} value={b.name}>{b.name} ({b.badge})</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input type="tel" placeholder="+91 98765 43210" required value={bookingForm.contact} onChange={e => setBookingForm(f => ({ ...f, contact: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Tour Package (optional)</label>
                                    <select>
                                        <option value="">Custom Route</option>
                                        {destinations.map(d => <option key={d.name}>{d.name} — {d.price}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="site-primary-btn full">
                                    Request Booking <ArrowRight size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* ── Our Goals ── */}
                <section id="goals-section" className="site-section dark-section">
                    <div className="site-container">
                        <div className="site-section-header">
                            <div className="section-pill">WHO WE ARE</div>
                            <h2>Our <span>Goals & Values</span></h2>
                            <p>Route Master Travels was built on 4 pillars that drive everything we do</p>
                        </div>
                        <div className="goals-grid">
                            {goals.map((g, i) => (
                                <div className="goal-card" key={i}>
                                    <div className="goal-icon">{g.icon}</div>
                                    <h3>{g.title}</h3>
                                    <p>{g.desc}</p>
                                </div>
                            ))}
                        </div>
                        {/* Company Story */}
                        <div className="company-story">
                            <div className="story-text">
                                <h3>Our Story</h3>
                                <p>Founded in 2012 by transport enthusiast <strong>Rajan Kumar</strong>, Route Master started with a single Volvo bus and a dream — to make luxury travel accessible for everyone. Today we operate a fleet of 24 premium coaches serving 50+ destinations across Kerala, Tamil Nadu, Karnataka, and Goa.</p>
                                <p>Every tour is lovingly crafted by our in-house travel team with local expertise. From the moment you board to the day you return home, we ensure your safety, comfort, and joy — it's not just a trip, it's a memory crafted for life.</p>
                            </div>
                            <div className="story-numbers">
                                <div className="story-num"><span>24</span><p>Premium Coaches</p></div>
                                <div className="story-num"><span>50+</span><p>Destinations Covered</p></div>
                                <div className="story-num"><span>500+</span><p>Families Employed</p></div>
                                <div className="story-num"><span>4.9★</span><p>Average Rating</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Reviews ── */}
                <section className="site-section">
                    <div className="site-container">
                        <div className="site-section-header">
                            <div className="section-pill">TESTIMONIALS</div>
                            <h2>Words From <span>Our Travellers</span></h2>
                        </div>
                        <div className="reviews-grid">
                            {reviews.map((r, i) => (
                                <div className="site-review-card" key={i}>
                                    <div className="site-review-stars">{'★'.repeat(r.stars)}</div>
                                    <p>"{r.text}"</p>
                                    <div className="site-reviewer">
                                        <div className="reviewer-avatar">{r.name[0]}</div>
                                        <div>
                                            <strong>{r.name}</strong>
                                            <span>{r.city}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Contact Support ── */}
                <section id="contact-section" className="site-section contact-bg">
                    <div className="site-container">
                        <div className="site-section-header">
                            <div className="section-pill">REACH US</div>
                            <h2>Contact & <span>Support</span></h2>
                            <p>Our dedicated team is available 24/7 for bookings, queries and trip support</p>
                        </div>
                        <div className="contact-grid">
                            <div className="contact-card">
                                <div className="contact-icon"><Phone size={28} /></div>
                                <h3>Call Us</h3>
                                <p>24/7 helpline for bookings and on-trip support</p>
                                <a href="tel:+919876543210" className="contact-link">+91 98765 43210</a>
                                <a href="tel:+919876543211" className="contact-link">+91 98765 43211</a>
                            </div>
                            <div className="contact-card">
                                <div className="contact-icon"><Mail size={28} /></div>
                                <h3>Email Us</h3>
                                <p>Send your queries and we'll respond within 2 hours</p>
                                <a href="mailto:bookings@routemaster.in" className="contact-link">bookings@routemaster.in</a>
                                <a href="mailto:support@routemaster.in" className="contact-link">support@routemaster.in</a>
                            </div>
                            <div className="contact-card">
                                <div className="contact-icon"><Headphones size={28} /></div>
                                <h3>Live Support</h3>
                                <p>Chat with our team in real-time for instant answers</p>
                                <button className="site-primary-btn" style={{ marginTop: '1rem', fontSize: '0.75rem', padding: '0.8rem 1.5rem' }}>
                                    Start Chat <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="contact-card">
                                <div className="contact-icon"><MapPin size={28} /></div>
                                <h3>Our Office</h3>
                                <p>Visit us at our main office for in-person booking</p>
                                <p className="contact-link">42, Gandhi Rd, Coimbatore<br />Tamil Nadu 641001</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="site-footer">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <div className="footer-logo">🚌 ROUTE MASTER</div>
                            <p>South India's most trusted premium bus operator since 2012. Safe arrivals guaranteed.</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-col">
                                <h4>Tours</h4>
                                {destinations.slice(0, 4).map(d => <a key={d.name} href="#packages-section">{d.name}</a>)}
                            </div>
                            <div className="footer-col">
                                <h4>Fleet</h4>
                                {busFleet.map(b => <a key={b.id} href="#fleet-section">{b.name}</a>)}
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="#goals-section">About Us</a>
                                <a href="#goals-section">Our Goals</a>
                                <a href="#contact-section">Contact</a>
                                <a href="#booking-section">Book Now</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2025 Route Master Travels. Developed by ECOG Core Technology.</span>
                        <span>Crafted with ❤️ in Tamil Nadu</span>
                    </div>
                </footer>

            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`} style={{ zIndex: 9999 }}>
                    <CheckCircle size={18} />
                    <span>{toast.msg}</span>
                </div>
            )}

        </ErrorBoundary>
    )
}

export default App
