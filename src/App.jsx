import React, { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { Volume2, VolumeX, MapPin, Bus as BusIcon, Calendar, Phone, Star, Menu, X } from 'lucide-react'
import Scene from './Scene'
import './App.css'

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
                    <pre>{this.state.error.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

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

function App() {
    const [isMuted, setIsMuted] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const audioRef = useRef(null)

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) { audioRef.current.play().catch(() => { }) }
            else { audioRef.current.pause() }
        }
        setIsMuted(p => !p)
    }

    const toggleMobileMenu = () => setMobileMenuOpen(p => !p)

    return (
        <ErrorBoundary>
            <div className="app-container">
                <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

                <div className="canvas-container">
                    <Canvas shadows camera={{ position: [0, 0.5, 6], fov: 40 }}>
                        <Suspense fallback={null}>
                            <ScrollControls pages={5} damping={0.25}>
                                <Scene />
                                <Scroll html>
                                    {/* ── HERO ── */}
                                    <div className="hero-section section">
                                        <div className="content-card">
                                            <div className="badge">PREMIUM TRAVELS · EST. 2012</div>
                                            <h1>Redefining<br />Journeys</h1>
                                            <p>Experience South India like never before. Luxury coaches, expert drivers, and handcrafted itineraries — all in one package.</p>
                                            <div className="cta-group">
                                                <button className="primary-btn">Plan Your Trip</button>
                                                <button className="secondary-btn">View Fleet</button>
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
                                                <div className="bus-item">
                                                    <div><span className="bus-type">VOLVO 9600</span><p>Semi-Sleeper, Multi-Axle, AC, Bio-Toilet</p></div>
                                                    <span className="bus-badge">PREMIUM</span>
                                                </div>
                                                <div className="bus-item">
                                                    <div><span className="bus-type">SCANIA METROLINK</span><p>Luxury Seater, 44 Seats, Full HD Entertainment</p></div>
                                                    <span className="bus-badge">LUXURY</span>
                                                </div>
                                                <div className="bus-item">
                                                    <div><span className="bus-type">BHARATBENZ AC</span><p>Executive Class, Reclining Seats, GPS Tracking</p></div>
                                                    <span className="bus-badge">EXECUTIVE</span>
                                                </div>
                                                <div className="bus-item">
                                                    <div><span className="bus-type">MERCEDES TOURISMO</span><p>VIP Cabin, Personal AC Vents, Panoramic Roof</p></div>
                                                    <span className="bus-badge">VIP</span>
                                                </div>
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
                                                    <div className="destination-pkg" key={d.name}>
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
                                            <div className="booking-form">
                                                <div className="booking-form-row">
                                                    <input type="text" placeholder="From City" />
                                                    <input type="text" placeholder="To Destination" />
                                                </div>
                                                <div className="booking-form-row">
                                                    <input type="date" />
                                                    <input type="number" placeholder="No. of Passengers" min="1" />
                                                </div>
                                                <select defaultValue="">
                                                    <option value="" disabled>Select Bus Type</option>
                                                    <option>VOLVO 9600 (Premium)</option>
                                                    <option>SCANIA METROLINK (Luxury)</option>
                                                    <option>BHARATBENZ AC (Executive)</option>
                                                    <option>MERCEDES TOURISMO (VIP)</option>
                                                </select>
                                                <button className="primary-btn full-width">Check Availability →</button>
                                            </div>
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

                {/* ── STATIC HUD ── */}
                <nav className="hud-nav">
                    <div className="logo-section">
                        <div className="logo-box"></div>
                        <span className="logo-text">TRAVELS 3D</span>
                    </div>
                    <div className="nav-links">
                        <span>DESTINATIONS</span>
                        <span>FLEET</span>
                        <span>REVIEWS</span>
                        <button className="book-nav-btn">BOOK NOW</button>
                    </div>
                    <div className="nav-right">
                        <button className="audio-toggle" onClick={toggleMute} title={isMuted ? 'Play Music' : 'Mute Music'}>
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>

                {/* ── MOBILE MENU OVERLAY ── */}
                {mobileMenuOpen && (
                    <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
                            <span className="mobile-nav-link">DESTINATIONS</span>
                            <span className="mobile-nav-link">FLEET</span>
                            <span className="mobile-nav-link">REVIEWS</span>
                            <button className="primary-btn" style={{ marginTop: '1rem', width: '100%' }}>BOOK NOW</button>
                        </div>
                    </div>
                )}

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
                    <div className="mouse"><div className="wheel"></div></div>
                    <span>SCROLL TO EXPLORE</span>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default App
