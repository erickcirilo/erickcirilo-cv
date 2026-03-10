import { useState, useEffect } from "react";

const createTheme = (dark) => {
  if (dark) {
    return {
      page: "#0a0e14",
      sidebar: "linear-gradient(170deg,#1a2332 0%,#0f1419 100%)",
      main: "linear-gradient(160deg,#0f1419 0%,#0a0e14 100%)",
      name: "#e8f0f8",
      accent: "#84a6cc",
      accentHi: "#5a8db5",
      sub: "#9ab5ca",
      summaryBg: "rgba(132,166,204,0.08)",
      muted: "#6a8fa6",
      toggleBg: "rgba(132,166,204,0.15)",
      toggleBd: "rgba(132,166,204,0.4)",
      shadow: "0 10px 40px rgba(0,0,0,0.5)",
      drawerBg: "#0f1419",
    };
  } else {
    return {
      page: "#eef2f7",
      sidebar: "linear-gradient(170deg,#1e3a52 0%,#1a3347 60%,#162c3e 100%)",
      main: "linear-gradient(160deg,#ffffff 0%,#eef2f7 100%)",
      name: "#0d1b2a",
      accent: "#5a8db5",
      accentHi: "#3d5a7a",
      sub: "#4a6a8a",
      summaryBg: "rgba(90,141,181,0.08)",
      muted: "#5a7a9a",
      toggleBg: "rgba(90,141,181,0.1)",
      toggleBd: "rgba(90,141,181,0.3)",
      shadow: "0 10px 40px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff",
    };
  }
};

function useCountUp(target, dur = 1400, active = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setV(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, dur]);
  return v;
}

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function ThemeToggle({ dark, onToggle, t }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 1200,
        background: hov ? t.accent : t.toggleBg,
        border: `1px solid ${t.toggleBd}`,
        borderRadius: 10, padding: "7px 13px",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
        boxShadow: hov ? "0 4px 20px rgba(90,141,181,0.4)" : "0 2px 10px rgba(0,0,0,0.2)",
        transition: "all 0.3s",
      }}
    >
      <span style={{ fontSize: 15 }}>{dark ? "☀️" : "🌙"}</span>
      <span style={{ fontSize: 10, color: hov ? "#fff" : t.accentHi, fontWeight: 600, letterSpacing: 0.5 }}>
        {dark ? "CLARO" : "OSCURO"}
      </span>
    </button>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [cert, setCert] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  const mobile = useWidth() < 700;
  const t = createTheme(dark);

  useEffect(() => {
    setMounted(true);
  }, []);

  const yearsCount = useCountUp(10, 1300, mounted);
  const countryCount = useCountUp(4, 1300, mounted);

  const countries = [{ flag: "🇦🇷" }, { flag: "🇨🇱" }, { flag: "🇵🇾" }, { flag: "🇺🇾" }];

  return (
    <div style={{ background: t.page, color: t.sub, transition: "background .4s, color .4s", minHeight: "100vh" }}>
      {cert && <CertModal certKey={cert} onClose={() => setCert(null)} t={t} />}
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} t={t} />

      {mobile && (
        <>
          <button
            onClick={() => setDrawer(o => !o)}
            style={{
              position: "fixed", top: 13, left: 13, zIndex: 2000,
              background: t.accent, border: "none", borderRadius: 10,
              width: 42, height: 42, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 20 }}>☰</span>
          </button>
          {drawer && <div onClick={() => setDrawer(false)} style={{ position: "fixed", inset: 0, zIndex: 1400, background: "rgba(0,0,0,0.55)" }} />}
          <div style={{
            position: "fixed", top: 0, left: 0, width: 284, height: "100%", zIndex: 1500,
            background: t.drawerBg, borderRight: "1px solid rgba(90,141,181,0.2)",
            boxShadow: "10px 0 40px rgba(0,0,0,0.5)",
            transform: drawer ? "translateX(0)" : "translateX(-100%)",
            transition: "transform .35s cubic-bezier(.16,1,.3,1)", overflowY: "auto",
          }}>
            <div style={{ height: 60 }} />
            <Sidebar t={t} onCert={setCert} mounted={mounted} />
          </div>
        </>
      )}

      <div style={{
        display: "flex", maxWidth: mobile ? "100%" : 900, margin: "0 auto", minHeight: "100vh",
        boxShadow: mobile ? "none" : t.shadow,
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(22px)",
        transition: "all .9s cubic-bezier(.16,1,.3,1)",
      }}>
        {!mobile && (
          <div style={{
            width: 260, flexShrink: 0, background: t.sidebar,
            borderRight: "1px solid rgba(90,141,181,0.15)", transition: "background .4s",
          }}>
            <Sidebar t={t} onCert={setCert} mounted={mounted} />
          </div>
        )}

        <div style={{
          flex: 1, background: t.main,
          padding: mobile ? "20px 18px 40px" : "36px 32px",
          paddingTop: mobile ? "72px" : "36px", overflowY: "auto",
          transition: "background .4s",
        }}>
          <div style={{
            marginBottom: 14,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-20px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1) .15s",
          }}>
            <div style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: mobile ? 33 : 43, fontWeight: 800,
              color: t.name, letterSpacing: -1.5,
              lineHeight: 1, textTransform: "uppercase", transition: "color .4s",
            }}>
              Erick <span style={{ color: t.accent, transition: "color .4s" }}>Cirilo</span>
            </div>
            <div style={{
              fontSize: 11, color: t.accentHi, letterSpacing: 5,
              textTransform: "uppercase", marginTop: 6, display: "flex",
              alignItems: "center", gap: 10,
            }}>
              <span style={{ width: 28, height: 1, background: t.accent, display: "inline-block" }} />
              Senior Data Analyst | Technology Projects
              <span style={{ width: 28, height: 1, background: t.accent, display: "inline-block" }} />
            </div>
          </div>

          <div style={{
            fontSize: 11.5, color: t.sub, lineHeight: 1.8, marginBottom: 6,
            padding: "13px 17px", background: t.summaryBg,
            borderLeft: `3px solid ${t.accent}`, borderRadius: "0 8px 8px 0",
          }}>
            Soy un apasionado de la tecnología y el análisis de datos, con más de 15 años de trayectoria en la gestión de proyectos y gobernanza de TI. Mi enfoque principal es la gestión inteligente de datos y la ejecución de proyectos sobre plataformas Microsoft 365 (Power Platform, Azure), siempre cuidando la calidad y el cumplimiento de las normas de privacidad del departamento. Me destaco por mi capacidad de coordinación, trabajo en equipo y un nivel de inglés avanzado, lo que me permite participar en iniciativas en entornos globales con total naturalidad.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "2px 0 22px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 27, fontWeight: 800, color: "#5a8db5", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>
                {yearsCount}+
              </div>
              <div style={{ fontSize: 9, color: "#8aafc4", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>Años</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 27, fontWeight: 800, color: "#5a8db5", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>100%</div>
              <div style={{ fontSize: 9, color: "#8aafc4", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>Precisión</div>
            </div>
            <div
              onMouseEnter={() => setHoveredStat("countries")}
              onMouseLeave={() => setHoveredStat(null)}
              style={{ textAlign: "center", cursor: "pointer", transition: "all .3s ease" }}
            >
              <div style={{ fontSize: 27, fontWeight: 800, color: "#5a8db5", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>
                {hoveredStat === "countries" ? (
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                    {countries.map((c, i) => (
                      <span key={i} style={{ fontSize: 18 }}>{c.flag}</span>
                    ))}
                  </span>
                ) : countryCount}
              </div>
              <div style={{ fontSize: 9, color: "#8aafc4", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>Países</div>
            </div>
          </div>

          <SecTitle t={t}>Experiencia</SecTitle>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom,${t.accent},transparent)` }} />
            <TLItem t={t} dates="2015 – Presente" company="La Iglesia de Jesucristo de los Santos de los Últimos Días" title="Senior Data Analyst"
              bullets={["Liderazgo y supervisión de proyectos de datos y análisis de gobernanza TI.", "Implementación de soluciones Power BI y Power Platform para mejora operativa.", "Gestión de bases de datos Microsoft SQL Server con enfoque en seguridad y cumplimiento."]} />
            <TLItem t={t} dates="2022" company="Fundación Roble del Sur" title="Social Media Marketing Intern"
              bullets={["Diseño y ejecución de estrategias de marketing digital en redes sociales.", "Análisis de métricas y ROI de campañas publicitarias digitales."]} />
          </div>

          <SecTitle t={t}>Voluntariado</SecTitle>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom,${t.accent},transparent)` }} />
            <TLItem t={t} dates="2019 – 2022" company="Fundación Roble del Sur" title="Coordinador de Proyectos Comunitarios"
              bullets={["Coordinación de iniciativas comunitarias y proyectos de desarrollo social.", "Gestión de equipos multidisciplinarios en actividades de impacto social."]} />
            <TLItem t={t} dates="2005 – 2007" company="La Iglesia de Jesucristo de los Santos de los Últimos Días" title="Misionero de Tiempo Completo"
              bullets={["Servicio misionero de tiempo completo enfocado en el trabajo comunitario y el desarrollo espiritual."]} />
          </div>

          <SecTitle t={t}>Referencias</SecTitle>
          <div style={{ fontSize: 10, lineHeight: 1.6, color: t.sub }}>
            <p>Referencias profesionales disponibles bajo solicitud.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ t, onCert, mounted }) {
  return (
    <div style={{ padding: "40px 20px", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all .8s ease .3s" }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#84a6cc,#5a8db5)", margin: "0 auto 20px", boxShadow: "0 0 20px rgba(132,166,204,0.3)" }} />
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: "#e8f0f8", letterSpacing: -0.5 }}>Erick Cirilo</div>
      <div style={{ fontSize: 9.5, color: "#5a8db5", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 3 }}>Senior Data Analyst <span style={{ fontStyle: "italic" }}>Technology projects</span></div>

      <SideSection title="CONTACTO">
        {[["✉️", "erickcirilo@churchofjesuschrist.org"], ["📱", "(54) 11 3682-1047"], ["⊙", "C. Settino 1419, Buenos Aires"], ["⊞", "linkedin.com/in/erickcirilo/"]].map(([icon, text], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7, color: "#9ab5ca", fontSize: 10.5, lineHeight: 1.4 }}>
            <span style={{ color: "#5a8db5", fontSize: 11, flexShrink: 0 }}>{icon}</span>{text}
          </div>
        ))}
      </SideSection>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "2px 0 22px" }}>
        <StatNum value={10} suffix="+" label="Años" />
        <StatNum value={100} suffix="%" label="Precisión" />
        <StatNum value={4} suffix="" label="Países" />
      </div>

      <SideSection title="EDUCACIÓN">
        {[["2025", "Postgrado en Estrategia y Gestión de Customer Experience", "UCEMA"], ["2024", "Associate of Applied Science in Professional Studies", "BYU-Idaho"], ["2007", "Ingeniero de Sistemas", "UTO Bolivia"]].map(([y, d, s]) => (
          <div key={y} style={{ marginBottom: 11, borderLeft: "2px solid rgba(90,141,181,0.4)", paddingLeft: 9, cursor: "pointer", borderRadius: "0 6px 6px 0", padding: "6px 6px 6px 9px", transition: "background .2s" }}>
            <div style={{ fontSize: 9, color: "#5a8db5", fontWeight: 700, marginBottom: 1 }}>{y}</div>
            <div style={{ fontSize: 10.5, color: "#e8f0f8", fontWeight: 600, lineHeight: 1.3, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(90,141,181,0.6)" }}>📄</span>{d}
            </div>
            <div style={{ fontSize: 9, color: "#6a8fa6" }}>{s}</div>
          </div>
        ))}
      </SideSection>

      <SideSection title="EXPERTISE">
        {["Gestión de proyectos TI: planificación, ejecución y riesgos", "Microsoft Power Platform y Azure", "Coordinación de equipos multinivel en el área y el liderazgo", "Análisis y visualización: Excel, Power BI, Tableau", "Privacidad de datos, cumplimiento TI y desarrollo de material"].map((e, i) => (
          <div key={i} style={{ fontSize: 11.5, color: "#e8f0f8", lineHeight: 1.5, marginBottom: 7, paddingLeft: 13, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "#5a8db5", fontSize: 10, top: 2 }}>▸</span>{e}
          </div>
        ))}
        <div style={{ marginTop: 8, marginBottom: 14, fontSize: 9, color: "#8aafc4", textAlign: "center", letterSpacing: 0.8 }}>👇 para ver el certificado</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["PL-900", "MB-901", "MS-900", "AZ-900", "IBM Cyber", "PMP Track", "UCEMA"].map((b, i) => (
            <button key={b} onClick={() => onCert(b)} style={{ paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, borderRadius: 6, border: "1px solid #84a6cc", background: "transparent", fontSize: 9, fontWeight: 600, color: "#84a6cc", cursor: "pointer", transition: "all .2s" }}>
              {b}
            </button>
          ))}
        </div>
      </SideSection>

      <SideSection title="IDIOMAS">
        <LangBar label="Inglés" pct={85} />
        <LangBar label="Español" pct={100} />
      </SideSection>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#5a8db5", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#5a8db5,transparent)" }} />
        {title}
        <span style={{ flex: 1, height: 1, background: "linear-gradient(270deg,#5a8db5,transparent)" }} />
      </div>
      {children}
    </div>
  );
}

function StatNum({ value, suffix, label }) {
  const n = useCountUp(value, 1300, true);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 27, fontWeight: 800, color: "#5a8db5", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{n}{suffix}</div>
      <div style={{ fontSize: 9, color: "#8aafc4", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function LangBar({ label, pct }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: "#e8f0f8" }}>{label}</span>
        <span style={{ fontSize: 10, color: "#5a8db5" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(132,166,204,0.2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#84a6cc", borderRadius: 3, transition: "width 1.3s ease" }} />
      </div>
    </div>
  );
}

function SecTitle({ t, children }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, color: t.accentHi, textTransform: "uppercase", letterSpacing: 2, marginTop: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${t.accent},transparent)` }} />
      {children}
      <span style={{ flex: 1, height: 1, background: `linear-gradient(270deg,${t.accent},transparent)` }} />
    </div>
  );
}

function TLItem({ t, dates, company, title, bullets }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: t.accentHi, marginBottom: 2 }}>{dates}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.accent, marginBottom: 2 }}>{company}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#e8f0f8", marginBottom: 8 }}>{title}</div>
      {bullets.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <span style={{ color: t.accentHi, fontSize: 9, flexShrink: 0, marginTop: 2 }}>▸</span>
          <span style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.5 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function CertModal({ certKey, onClose, t }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(5px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.main || "#0a0e14", borderRadius: 12, padding: 30, maxWidth: 500, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: 28, color: t.accent, cursor: "pointer", fontWeight: 600 }}>✕</button>
        <h2 style={{ color: t.name, fontSize: 20, marginBottom: 10 }}>{certKey}</h2>
        <p style={{ color: t.sub, fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>Certificación: {certKey}</p>
        <div style={{ width: "100%", height: 300, background: `linear-gradient(135deg,${t.accent}33,${t.accent}11)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: t.accentHi, fontSize: 14 }}>
          Certificado: {certKey}
        </div>
      </div>
    </div>
  );
}
