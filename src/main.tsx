import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {CalendarBlank, MapPin, FlowerLotus, Sparkle, ArrowDown} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './styles.css';

// Muhurtham Date: 20th Dec 2026, 10:00 AM IST
const WEDDING = new Date('2026-12-20T10:00:00+05:30');

const events = [
  {
    name: 'Reception',
    date: 'Saturday, 19 December 2026',
    time: '7:00 PM onwards',
    venue: 'Lakshya Convention Hall, Kadur',
    note: 'An evening of joy, celebration, and dinner to welcome the beautiful couple-to-be.',
    icon: '✧',
    image: '/assets/reception.png',
    tag: 'Evening Celebration'
  },
  {
    name: 'Muhurtham',
    date: 'Sunday, 20 December 2026',
    time: '10:00 AM onwards',
    venue: 'Lakshya Convention Hall, Kadur',
    note: 'The sacred Kalyanam, Panigrahana & Mangalyadharana under holy Vedic mantras and divine blessings.',
    icon: '❧',
    image: '/assets/muhurtham.png',
    tag: 'Auspicious Lagna'
  }
];

function Reveal({children, className=''}:{children:React.ReactNode,className?:string}){
  const reduce=useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce?false:{opacity:0,y:28}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true,amount:.15}}
      transition={{duration:.75,ease:[.16,1,.3,1]}}
    >
      {children}
    </motion.div>
  );
}

function Countdown(){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
  const diff=Math.max(0,WEDDING.getTime()-now);
  const values=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
  return (
    <div className="countdown">
      {values.map((v,i)=>(
        <div className="count-unit" key={i}>
          <div className="flip">
            <motion.span key={v} initial={{rotateX:-75,opacity:0}} animate={{rotateX:0,opacity:1}}>
              {String(v).padStart(2,'0')}
            </motion.span>
          </div>
          <small>{['days','hours','mins','secs'][i]}</small>
        </div>
      ))}
    </div>
  );
}

function Bloom({onOpenClick, isOpening}:{onOpenClick:()=>void, isOpening:boolean}){
  const reduce=useReducedMotion();

  const handleOpen = () => {
    onOpenClick();
  };

  return (
    <motion.div
      className={'welcome-card '+(isOpening?'is-open':'')}
      animate={isOpening&&!reduce?{scale:1.04,opacity:0}:{}}
      transition={{duration:.2,ease:'easeOut'}}
      style={{pointerEvents: isOpening ? 'none' : 'auto'}}
    >
      <div className="welcome-names">
        <div className="om-shiva">|| ಓಂ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ||</div>
        <small>Together with our families</small>
        <h1>Chinmayi <i>&</i> Jayanth</h1>
        <p>invite you to celebrate their wedding</p>
        <span>19 · 20 · DECEMBER · 2026</span>
      </div>
      <motion.button
        aria-label="Open Chinmayi and Jayanth's invitation"
        className="open-invite"
        onClick={handleOpen}
        whileTap={{scale:.97}}
      >
        <span className="seal"><FlowerLotus size={25} weight="fill"/></span>
        <b>Open our invitation</b>
      </motion.button>
    </motion.div>
  );
}

function addCalendar(){
  const body=[
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'DTSTART:20261219T133000Z',
    'DTEND:20261220T083000Z',
    'SUMMARY:Chinmayi & Jayanth — Wedding Celebration',
    'LOCATION:Lakshya Convention Hall, Kadur, Karnataka 577548',
    'DESCRIPTION:Wedding ceremony of Chinmayi V Pandith and Jayanth T M.\\nReception: 19th Dec 2026, 7:00 PM onwards.\\nMuhurtham: 20th Dec 2026, 10:00 AM onwards.\\nVenue: Lakshya Convention Hall, Kadur.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([body],{type:'text/calendar'}));
  a.download='chinmayi-jayanth-wedding.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

function ScratchDate(){
  const canvas=useRef<HTMLCanvasElement>(null);
  const [done,setDone]=useState(false);
  const drawing=useRef(false);
  const strokes=useRef(0);

  useEffect(()=>{
    const c=canvas.current;if(!c)return;
    const ratio=Math.min(devicePixelRatio,2);
    const rect=c.getBoundingClientRect();
    c.width=rect.width*ratio;c.height=rect.height*ratio;
    const x=c.getContext('2d')!;
    x.scale(ratio,ratio);
    const g=x.createLinearGradient(0,0,rect.width,rect.height);
    g.addColorStop(0,'#d7a94f');g.addColorStop(.5,'#f0d08a');g.addColorStop(1,'#a76d1c');
    x.fillStyle=g;x.fillRect(0,0,rect.width,rect.height);
    x.fillStyle='#633f1f';x.textAlign='center';
    x.font='11px Marcellus, serif';
    x.fillText('SCRATCH TO REVEAL OUR DATE',rect.width/2,rect.height/2-6);
    x.font='25px serif';
    x.fillText('❋',rect.width/2,rect.height/2+29);
  },[]);

  const scratch=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current||done)return;
    const c=canvas.current!,r=c.getBoundingClientRect(),x=c.getContext('2d')!;
    x.globalCompositeOperation='destination-out';
    x.beginPath();x.arc(e.clientX-r.left,e.clientY-r.top,24,0,Math.PI*2);x.fill();
    if(++strokes.current>42){setDone(true);c.style.opacity='0';navigator.vibrate?.(35)}
  };

  return (
    <section className={'scratch-section '+(done?'revealed':'')}>
      <div className="float-field" aria-hidden="true">
        {Array.from({length:12},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}>❀</i>)}
      </div>
      <Reveal>
        <p className="script">Save our dates</p>
        <h2>Sacred days written in destiny</h2>
        <div className="scratch-card">
          <div className="date-reveal">
            <small>Auspicious Muhurtham</small>
            <b>20</b>
            <span>December · 2026</span>
            <em>Lakshya Convention Hall · Kadur</em>
          </div>
          <canvas
            ref={canvas}
            onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);scratch(e)}}
            onPointerMove={scratch}
            onPointerUp={()=>drawing.current=false}
            onPointerCancel={()=>drawing.current=false}
          />
        </div>
        <p className="scratch-hint">{done?'We look forward to seeing you with family ♡':'Use your finger to uncover the date'}</p>
      </Reveal>
    </section>
  );
}

function App(){
  const [entered,setEntered]=useState(false);
  const [introPlaying,setIntroPlaying]=useState(false);
  const [isExiting,setIsExiting]=useState(false);

  const introVideo=useRef<HTMLVideoElement>(null);
  const audioRef=useRef<HTMLAudioElement>(null);
  const audioTimerRef=useRef<number | null>(null);

  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll();
  const leafY=useTransform(scrollYProgress,[0,1],[0,180]);
  const heroParallaxY=useTransform(scrollYProgress,[0,0.3],[0,45]);
  const page=useRef<HTMLElement>(null);

  // When user taps "Open our invitation":
  // 1. Instantly start video so there is NO blank/brown delay
  // 2. Start audio after 5 seconds from the 11th second
  const handleOpenInviteClicked = () => {
    // Start video playback immediately within user click gesture
    const v = introVideo.current;
    if (v) {
      v.currentTime = 0;
      setIntroPlaying(true);
      void v.play().catch(() => {});
    }

    // Audio: start silent playback now to unlock browser audio, then play from 11.0s at 5s
    const audio = audioRef.current;
    if (audio) {
      if (audioTimerRef.current) {
        window.clearTimeout(audioTimerRef.current);
      }
      audio.volume = 0;
      audio.currentTime = 11.0;
      const playPromise = audio.play();

      audioTimerRef.current = window.setTimeout(() => {
        audio.currentTime = 11.0;
        audio.volume = 1.0;
        audio.play().catch(() => {});
      }, 5000);

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  // When intro ends or user clicks skip intro: smooth cross-fade to hero, audio from 11.0s
  const handleEnterFirstPage = () => {
    if (isExiting) return;
    setIsExiting(true);

    const audio = audioRef.current;
    if (audio && (audio.paused || audio.volume === 0)) {
      if (audioTimerRef.current) {
        window.clearTimeout(audioTimerRef.current);
        audioTimerRef.current = null;
      }
      audio.currentTime = 11.0;
      audio.volume = 1.0;
      audio.play().catch(() => {});
    }

    // Smoothly dissolve welcome overlay into the hero section
    setTimeout(() => {
      setEntered(true);
    }, 700);
  };

  useEffect(()=>{
    if(reduce||!entered||!page.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.fromTo('.hero-copy>*',{opacity:0,y:25},{opacity:1,y:0,duration:1,stagger:.1,ease:'power3.out'});
      gsap.utils.toArray<HTMLElement>('.ceremony-card').forEach((el,i)=>gsap.fromTo(el,{opacity:0,y:35},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
      gsap.to('.map i',{y:-10,repeat:-1,yoyo:true,duration:1.2,ease:'sine.inOut'});
      gsap.utils.toArray<HTMLElement>('.atmos-lantern').forEach((el,i)=>{
        const depth=Number(el.dataset.depth||.4);
        gsap.to(el,{yPercent:-90*depth,x:Math.sin(i)*18*depth,rotation:i%2?4:-4,ease:'none',scrollTrigger:{trigger:page.current,start:'top top',end:'bottom bottom',scrub:1.2+depth}});
        gsap.to(el.querySelector('.lantern-flame'),{scaleY:1.18,opacity:.72,repeat:-1,yoyo:true,duration:.7+i*.08,ease:'sine.inOut'});
      });
    },page);
    return()=>ctx.revert();
  },[entered,reduce]);

  return (
    <main ref={page}>
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        src="/assets/audio.mp3"
        preload="auto"
        loop
        playsInline
      />

      <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>

      <div className="lantern-atmosphere" aria-hidden="true">
        {[
          {x:6,y:12,d:.22,s:.62,b:2.2},{x:89,y:20,d:.35,s:.78,b:1.4},{x:12,y:42,d:.7,s:1.05,b:.4},
          {x:93,y:55,d:.28,s:.58,b:2.6},{x:4,y:72,d:1,s:1.35,b:.2},{x:87,y:84,d:.62,s:.92,b:.8},{x:48,y:64,d:.18,s:.42,b:3.2}
        ].map((l,i)=>(
          <span key={i} className="atmos-lantern" data-depth={l.d} style={{left:`${l.x}%`,top:`${l.y}%`,'--scale':l.s,'--blur':`${l.b}px`,'--delay':`${-i*.6}s`} as React.CSSProperties}>
            <i className="lantern-chain"/><i className="lantern-cap"/><i className="lantern-body"><b className="lantern-flame"/></i><i className="lantern-tail"/>
          </span>
        ))}
      </div>

      {/* Welcome Screen with Groom lifting Bride & Opening Animation */}
      {!entered && (
        <div className={`welcome ${introPlaying ? 'intro-playing' : ''} ${isExiting ? 'is-exiting' : ''}`}>
          <img
            src="/assets/entrance-first-frame.png"
            alt="Chinmayi and Jayanth wedding welcome illustration"
            className="welcome-poster"
          />
          <video
            ref={introVideo}
            className="welcome-video"
            muted
            playsInline
            preload="auto"
            poster="/assets/entrance-first-frame.png"
            onEnded={handleEnterFirstPage}
            aria-label="Chinmayi and Jayanth's illustrated wedding invitation opening"
          >
            <source src="/assets/aarav-ananya-opening.mp4" type="video/mp4"/>
          </video>
          <div className="welcome-shade"/>
          <div className="garland-edge"/>

          {!introPlaying && (
            <Bloom
              isOpening={introPlaying}
              onOpenClick={handleOpenInviteClicked}
            />
          )}

          {introPlaying && !isExiting && (
            <button
              className="skip-intro"
              onClick={handleEnterFirstPage}
            >
              Skip intro
            </button>
          )}
        </div>
      )}

      {/* Hero Section: Shiv-Parvati Hands with Trishul (4K Ultra-HD with Royal Plaque) */}
      <section className="hero">
        <motion.img
          className="hero-art"
          src="/assets/shiv-parvati-hands.png"
          alt="Lord Shiva and Goddess Parvati hands holding Trishul with temple gopuram and lotus flowers in 4K HD"
          style={{y:reduce?0:heroParallaxY}}
        />
        <div className="hero-scrim"/>
        
        {/* Hero Copy (Unobscured so divine background image is fully revealed) */}
        <motion.div
          className="hero-copy"
          initial={{opacity:0,y:24}}
          animate={{opacity:entered?1:0,y:entered?0:24}}
          transition={{delay:.15,duration:1}}
        >
          <div className="om-header">
            <span>ಓಂ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ।।</span>
            <span>ಓಂ ನಮಃ ಶಿವಾಯ ।।</span>
          </div>
          <div className="gold-filigree-divider"><i/>❦<i/></div>
          <p className="blessing">With the divine blessings of Lord Shiva &amp; Goddess Parvati<br/>and our beloved families</p>
          <h1>Chinmayi <span>&amp;</span> Jayanth</h1>
          <div className="date-rule"><i/>19 · 20 · DECEMBER · 2026<i/></div>
          <p className="venue-tag">Lakshya Convention Hall · Kadur, Karnataka</p>
        </motion.div>

        <motion.div className="leaf-float left" style={{y:reduce?0:leafY}}/>
        <motion.div className="leaf-float right" style={{y:reduce?0:leafY}}/>
        <div
          className="scroll-cue"
          onClick={() => document.querySelector('.count-section')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <ArrowDown size={20}/>
          <span>Our Celebrations</span>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="count-section">
        <Reveal>
          <p className="kicker">Until the sacred Muhurtham</p>
          <h2>Counting Every Auspicious Moment</h2>
          <Countdown/>
        </Reveal>
      </section>

      {/* Scratch To Reveal Date */}
      <ScratchDate/>

      {/* Sacred Union Story */}
      <section className="story ornamental">
        <Reveal className="story-inner">
          <FlowerLotus size={36} weight="thin"/>
          <p className="script">Divine Union of Hearts</p>
          <h2>Two Souls, One Sacred Journey</h2>
          <p>
            Like the eternal harmony of Shiva and Shakti, two lives come together in love, duty, and eternal devotion.
            With joyful hearts and the blessings of our elders, we invite you to grace our wedding celebration with your prayers and presence.
          </p>
          <div className="couple-names-block">
            <span className="couple-name">Chinmayi V Pandith</span>
            <span className="couple-amp">&amp;</span>
            <span className="couple-name">Jayanth T M</span>
          </div>
        </Reveal>
      </section>

      {/* Grand Ceremonies Showcase */}
      <section className="ceremonies-showcase">
        <Reveal className="section-head text-center">
          <p className="script">Auspicious Occasions</p>
          <h2>Wedding Celebrations</h2>
          <p className="section-intro">Join us in celebrating the sacred milestones of our wedding.</p>
        </Reveal>

        <div className="ceremonies-grid">
          {/* 1. Reception Card (Full length walking Shiva & Parvati with Nandi - feet & legs visible) */}
          <div className="ceremony-card">
            <div className="card-image-wrap">
              <img
                src="/assets/reception.png"
                alt="Lord Shiva and Goddess Parvati walking together with Nandi in Mount Kailash"
                loading="lazy"
                className="ceremony-card-img reception-card-img"
              />
              <span className="card-badge">Saturday Evening</span>
            </div>
            <div className="card-body">
              <span className="card-tag">✧ Reception</span>
              <h3>Grand Reception</h3>
              <p className="card-desc">An evening of joy, celebration, and dinner to welcome the beautiful couple-to-be.</p>
              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-val">19th December 2026</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-val">7:00 PM onwards</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-val">Lakshya Convention Hall, Kadur</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Muhurtham Card (New 4K Shiva Parvati Kalyanam before sacred fire) */}
          <div className="ceremony-card featured-card">
            <div className="card-image-wrap">
              <img
                src="/assets/muhurtham.png"
                alt="Shiva Parvati Kalyanam - divine celestial wedding ceremony before holy fire in 4K HD"
                loading="lazy"
                className="ceremony-card-img muhurtham-card-img"
              />
              <span className="card-badge gold">Sunday Morning</span>
            </div>
            <div className="card-body">
              <span className="card-tag">❧ Sacred Muhurtham</span>
              <h3>Lagna Muhurtham</h3>
              <p className="card-desc">The sacred Mangalyadharana, Panigrahana, and Saptapadi solemnized amidst holy Vedic chants.</p>
              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-val">20th December 2026</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-val">10:00 AM onwards</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-val">Lakshya Convention Hall, Kadur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section with Google Map */}
      <section className="venue ornamental">
        <Reveal>
          <MapPin size={38} weight="thin"/>
          <p className="script">Join Us At</p>
          <h2>Lakshya Convention Hall</h2>
          <p className="venue-address">
            Bangalore - Honnavar Highway, Opp. Highway School,<br/>
            Kadur, Ullinagur Rural, Karnataka 577548
          </p>

          <div className="map google-map">
            <iframe
              title="Google Map of Lakshya Convention Hall Kadur"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Laksha%20Convention%20Hall%2C%20Kadur%2C%20Karnataka%20577548&z=15&output=embed"
            />
            <div className="map-overlay">
              <span><MapPin size={19} weight="fill"/>Wedding Venue</span>
              <b>Lakshya Convention Hall</b>
              <small>Opp. Highway School, Kadur, Karnataka</small>
            </div>
          </div>

          <div className="actions">
            <a
              className="button primary"
              href="https://maps.app.goo.gl/g1qsEnKeDnZUczHT8?g_st=ic"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={19}/>Open in Google Maps
            </a>
            <button className="button secondary" onClick={addCalendar}>
              <CalendarBlank size={19}/>Add to Calendar
            </button>
          </div>
        </Reveal>
      </section>

      {/* Footer / Last Image: Lord Shiva & Parvati overlooking golden temple in 4K HD */}
      <footer>
        <img
          src="/assets/footer-temple.png"
          loading="lazy"
          alt="Lord Shiva and Goddess Parvati seated overlooking divine golden temple city in 4K HD"
        />
        <div className="footer-overlay"/>
        <Reveal className="footer-copy">
          <Sparkle size={27} weight="thin"/>
          <p>We eagerly await your gracious presence and blessings</p>
          <h2>Chinmayi <i>&amp;</i> Jayanth</h2>
          <span>19 &amp; 20 December 2026 · Lakshya Convention Hall · Kadur</span>
        </Reveal>
        <a
          href="https://www.instagram.com/invitestory.in/"
          target="_blank"
          rel="noreferrer"
          className="brand-credit"
        >
          Crafted with love by @invitestory.in
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
