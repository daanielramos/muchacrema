"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

type CursorLabel = "" | "VER" | "ÉCHALE" | "MUEVE";

const services = {
  web: {
    index: "01",
    eyebrow: "Diseño + desarrollo",
    title: "Páginas que hacen algo más que existir.",
    note: "De lo esencial a lo imposible de ignorar.",
    tiers: [
      { name: "Web Esencial", line: "Todo lo necesario. Nada genérico.", items: ["One page o landing", "Diseño personalizado", "Responsive + formulario", "SEO, analytics y deploy", "Microinteracciones ligeras"] },
      { name: "Web Signature", line: "Tu marca, llevada más lejos.", items: ["Arquitectura y UX", "Dirección visual + copy", "Motion y microinteracciones", "Agenda e integraciones", "Performance + medición"] },
      { name: "Web Experience", line: "Cuando una página ya no es suficiente.", items: ["Concepto creativo específico", "UX/UI y dirección de arte", "Motion avanzado + 3D útil", "Storytelling inmersivo", "Optimización avanzada"], featured: true },
    ],
  },
  branding: {
    index: "02",
    eyebrow: "Identidad + sistema",
    title: "Que te reconozcan antes de leer tu nombre.",
    note: "Carácter que se sostiene en cada punto de contacto.",
    tiers: [
      { name: "Brand Esencial", line: "Lo necesario para empezar bien.", items: ["Logo / wordmark", "Paleta + tipografías", "Sistema visual básico", "Aplicaciones esenciales", "Mini guía de marca"] },
      { name: "Brand Signature", line: "Una identidad con carácter propio.", items: ["Concepto creativo", "Logo y variantes", "Universo gráfico", "Dirección fotográfica", "Brandbook"] },
      { name: "Brand Experience", line: "Una marca que se convierte en universo.", items: ["Estrategia + posicionamiento", "Identidad expandida", "Dirección de arte", "Motion identity", "Sistema digital + brandbook"], featured: true },
    ],
  },
  research: {
    index: "03",
    eyebrow: "Evidencia + criterio",
    title: "Antes de apostar fuerte, pregunta.",
    note: "Usuarios reales + usuarios sintéticos. Perspectivas complementarias, nunca sustitutas.",
    tiers: [
      { name: "Research Express", line: "Decide rápido, con más criterio.", items: ["Hipótesis", "Research sintético", "Benchmark", "Evaluación de concepto", "Recomendación ejecutiva"] },
      { name: "Research Validación", line: "Lo que creemos vs. lo que responde el mercado.", items: ["Diseño del estudio", "Usuarios reales", "Research sintético previo", "Comparación de hallazgos", "Insights accionables"] },
      { name: "Research Launch", line: "Validar antes de apostar fuerte.", items: ["Exploración + audiencia", "Testing de naming e identidad", "Testing de mensajes y web", "Comparación de alternativas", "Recomendación de lanzamiento"], featured: true },
    ],
  },
};

const work = [
  { src: "/art/tortilla-planet.jpg", name: "Órbita doméstica", tag: "Gourmet cósmico", year: "Estudio 01", className: "work-a", alt: "Tortilla convertida en cuerpo celeste mineral sobre fondo negro" },
  { src: "/art/mexico-grecia.jpg", name: "Dos civilizaciones", tag: "México × Grecia", year: "Estudio 02", className: "work-b", alt: "Fragmento de rostro clásico atravesado por cerámica geométrica y obsidiana" },
  { src: "/art/molinillo-luxury.jpg", name: "Objeto de deseo", tag: "Dirección de arte", year: "Estudio 03", className: "work-c", alt: "Molinillo mexicano tratado como objeto de lujo flotante" },
  { src: "/art/cream-macro.jpg", name: "Materia I", tag: "Identidad material", year: "Estudio 04", className: "work-d", alt: "Materia blanca brillante y escultórica plegándose sobre negro" },
];

function track(event: string, detail?: string) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & { dataLayer?: Record<string, string>[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, detail: detail || "" });
}

function MagneticLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic ${secondary ? "magnetic-secondary" : ""}`}
      data-cursor={secondary ? "VER" : "ÉCHALE"}
      onPointerMove={(event) => {
        if (!ref.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${(event.clientX - rect.left - rect.width / 2) * 0.12}px`);
        ref.current.style.setProperty("--my", `${(event.clientY - rect.top - rect.height / 2) * 0.12}px`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--mx", "0px");
        ref.current?.style.setProperty("--my", "0px");
      }}
      onClick={() => track("cta_click", children?.toString())}
    >
      <span>{children}</span><i aria-hidden="true">↗</i>
    </a>
  );
}

function Cursor() {
  const [label, setLabel] = useState<CursorLabel>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = -40;
    let y = -40;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        document.documentElement.style.setProperty("--pointer-x", `${x}px`);
        document.documentElement.style.setProperty("--pointer-y", `${y}px`);
      });
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel((target?.dataset.cursor || "") as CursorLabel);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={`cursor ${label ? "cursor-active" : ""}`} aria-hidden="true"><span>{label}</span></div>;
}

function ServiceSection() {
  const [active, setActive] = useState<keyof typeof services>("web");
  const selected = services[active];
  return (
    <section className="services section" id="servicios" aria-labelledby="services-title">
      <div className="section-kicker reveal"><span>02</span> Lo que hacemos</div>
      <div className="services-head reveal">
        <h2 id="services-title">Tres maneras de<br /><em>hacer que se note.</em></h2>
        <p>No vendemos volumen. Diseñamos la dosis exacta de estrategia, identidad y tecnología que necesita cada proyecto.</p>
      </div>
      <div className="service-tabs" role="tablist" aria-label="Categorías de servicio">
        {(Object.keys(services) as (keyof typeof services)[]).map((key) => (
          <button key={key} role="tab" aria-selected={active === key} aria-controls={`panel-${key}`} id={`tab-${key}`} onClick={() => { setActive(key); track("service_view", key); }} data-cursor="MUEVE">
            <span>{services[key].index}</span>{key}
          </button>
        ))}
      </div>
      <div className="service-panel" role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} key={active}>
        <div className="service-intro">
          <p className="micro">{selected.eyebrow}</p>
          <h3>{selected.title}</h3>
          <p>{selected.note}</p>
        </div>
        <div className="tiers">
          {selected.tiers.map((tier, index) => (
            <article className={`tier ${tier.featured ? "tier-featured" : ""}`} key={tier.name}>
              <div className="tier-top"><span>0{index + 1}</span>{tier.featured && <b>Más crema</b>}</div>
              <h4>{tier.name}</h4>
              <p>{tier.line}</p>
              <ul>{tier.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href="#contacto" data-cursor="ÉCHALE" onClick={() => track("tier_select", tier.name)}>Explorar nivel <span>→</span></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      root.style.setProperty("--scroll", String(max > 0 ? scrollY / max : 0));
      root.style.setProperty("--scroll-y", `${scrollY}px`);
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Proyecto MUCHA CREMA — ${form.get("brand") || "Nueva marca"}`);
    const body = encodeURIComponent(`Hola MUCHA CREMA,\n\nQuiero trabajar en: ${form.get("project")}\nMarca: ${form.get("brand")}\nEmail: ${form.get("email")}\n\nContexto:\n${form.get("message")}`);
    track("contact_submit", String(form.get("project")));
    window.location.href = `mailto:hola@muchacrema.mx?subject=${subject}&body=${body}`;
  };

  return (
    <main>
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="MUCHA CREMA, volver al inicio">MUCHA CREMA <b>✱</b></a>
        <nav aria-label="Navegación principal">
          <a href="#servicios">Servicios</a><a href="#trabajo">Trabajo</a><a href="#research">Research</a>
        </nav>
        <a className="header-cta" href="#contacto" data-cursor="ÉCHALE">Hablemos <span>↗</span></a>
      </header>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="stars" aria-hidden="true" />
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-art" aria-hidden="true">
          <Image src="/art/hero-marble.jpg" alt="" fill priority unoptimized sizes="(max-width: 800px) 100vw, 62vw" />
          <div className="cream-drop drop-one" /><div className="cream-drop drop-two" />
        </div>
        <div className="hero-copy">
          <p className="hero-label">Branding · Web · Research</p>
          <h1 id="hero-title"><span>PARA MARCAS</span><span>QUE SE NIEGAN</span><span>A VERSE</span><span className="outline">GENÉRICAS.</span></h1>
          <div className="hero-bottom">
            <MagneticLink href="#contacto">Échale crema</MagneticLink>
            <MagneticLink href="#servicios" secondary>Ver qué hacemos</MagneticLink>
            <p>Exceso controlado.<br />CDMX · MX</p>
          </div>
        </div>
        <div className="scroll-note" aria-hidden="true"><span>Scroll para servir</span><i /></div>
      </section>

      <section className="manifesto section" id="manifiesto" aria-labelledby="manifesto-title">
        <div className="section-kicker reveal"><span>01</span> Manifiesto</div>
        <div className="manifesto-grid">
          <h2 id="manifesto-title" className="reveal">FUNCIONAR<br /><em>NO BASTA.</em></h2>
          <div className="manifesto-copy reveal"><p>Creamos marcas y experiencias digitales con el carácter suficiente para hacerse notar, sin perder claridad, estrategia ni propósito.</p><span>Si podría pertenecerle a cualquiera,<br /><b>le falta crema.</b></span></div>
        </div>
        <div className="controlled reveal" aria-label="Exceso controlado"><span>EXCESO</span><span>CONTROLADO.</span></div>
      </section>

      <ServiceSection />

      <section className="work section" id="trabajo" aria-labelledby="work-title">
        <div className="section-kicker reveal"><span>03</span> Pruebas de concepto</div>
        <div className="work-heading reveal"><h2 id="work-title">OBJETOS<br />CON <em>DESEO.</em></h2><p>Estudios visuales propios. Una galería para demostrar el tipo de mundo que podemos construir alrededor de una idea.</p></div>
        <div className="work-grid">
          {work.map((item) => (
            <article className={`work-item ${item.className} reveal`} key={item.name} data-cursor="VER" tabIndex={0}>
              <div className="work-image"><Image src={item.src} alt={item.alt} fill unoptimized sizes="(max-width: 800px) 94vw, 55vw" /></div>
              <div className="work-meta"><div><span>{item.tag}</span><h3>{item.name}</h3></div><p>{item.year}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="statement" aria-label="Prueba del concepto">
        <div className="statement-generic" aria-hidden="true"><i /><i /><i /><i /></div>
        <p>LO NORMAL TAMBIÉN FUNCIONA.</p>
        <h2>SI PODRÍA SER<br />DE <span>CUALQUIERA,</span><br /><em>LE FALTA CREMA.</em></h2>
        <div className="cream-streak" aria-hidden="true" />
      </section>

      <section className="research section" id="research" aria-labelledby="research-title">
        <div className="research-art reveal"><Image src="/art/research-orbits.jpg" alt="Lentes, ojos y fragmentos minerales orbitando una misma decisión" fill unoptimized sizes="(max-width: 800px) 100vw, 52vw" /><span className="image-index">06 / PERSPECTIVAS</span></div>
        <div className="research-copy reveal">
          <div className="section-kicker"><span>04</span> Research</div>
          <h2 id="research-title">ANTES DE<br />APOSTAR FUERTE,<br /><em>PREGUNTA.</em></h2>
          <p>Contrastamos intuición con evidencia. Combinamos personas reales con modelos sintéticos para explorar, tensionar y validar decisiones antes de invertir de más.</p>
          <div className="equation"><span>Usuarios<br />reales</span><b>+</b><span>Usuarios<br />sintéticos</span><b>≠</b><span>La misma<br />cosa</span></div>
          <p className="research-note">Herramientas complementarias. Las personas reales nunca se sustituyen.</p>
          <a href="#servicios" data-cursor="VER" onClick={() => track("research_cta")}>Ver niveles de research <span>→</span></a>
        </div>
      </section>

      <section className="automation section" aria-labelledby="automation-title">
        <div className="automation-head reveal"><div className="section-kicker"><span>05</span> Tecnología silenciosa</div><h2 id="automation-title">Y CUANDO TIENE SENTIDO,<br /><em>HACEMOS QUE TRABAJE SOLA.</em></h2></div>
        <div className="automation-flow reveal" aria-label="Capacidades de automatización">
          {['Formularios inteligentes','Agendas','Chatbots','Seguimiento','CRM + Sheets','APIs e integraciones'].map((item, i) => <span key={item} style={{'--i': i} as React.CSSProperties}>{item}</span>)}
          <div className="flow-core"><i />MC</div>
        </div>
        <p className="automation-note reveal">No es una cuarta categoría. Es la capa que aparece cuando puede ahorrar tiempo, eliminar fricción o convertir una experiencia en un pequeño sistema operativo.</p>
      </section>

      <section className="contact section" id="contacto" aria-labelledby="contact-title">
        <p className="contact-star" aria-hidden="true">✱</p>
        <div className="contact-copy reveal"><div className="section-kicker"><span>06</span> Siguiente órbita</div><h2 id="contact-title">¿LE ECHAMOS<br /><em>CREMA?</em></h2><p>Cuéntanos qué quieres lanzar, transformar o dejar de hacer como todos los demás.</p></div>
        <form className="contact-form reveal" onSubmit={submit}>
          <label><span>Tu marca</span><input name="brand" type="text" placeholder="¿Cómo se llama?" required /></label>
          <label><span>Qué quieres hacer</span><select name="project" defaultValue="Branding + Web"><option>Branding</option><option>Web</option><option>Research</option><option>Branding + Web</option><option>Experiencia completa</option></select></label>
          <label><span>Tu correo</span><input name="email" type="email" placeholder="tu@marca.mx" required /></label>
          <label className="full"><span>Un poco de contexto</span><textarea name="message" placeholder="Qué quieres lanzar, transformar o cuestionar…" rows={3} required /></label>
          <button type="submit" data-cursor="ÉCHALE"><span>Empezar proyecto</span><i>→</i></button>
          <p>Al enviar se abrirá tu app de correo. Cero formularios perdidos en el espacio.</p>
        </form>
      </section>

      <footer>
        <div className="footer-brand">MUCHA CREMA <b>✱</b></div>
        <div><p>Branding · Web · Research</p><p>Ciudad de México</p></div>
        <div><a href="mailto:hola@muchacrema.mx">hola@muchacrema.mx</a><a href="#inicio">Volver arriba ↑</a></div>
        <p className="footer-line">Hacemos que se note.</p>
        <small>© {new Date().getFullYear()} MUCHA CREMA · Sitio conceptual</small>
      </footer>
    </main>
  );
}
