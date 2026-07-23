import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const getImagePath = (fileName: string) =>
  `${import.meta.env.BASE_URL}images/work/${fileName}`;

const PROJECTS = [
  {
    title: "Progressive Gym Management",
    category: "Full-Stack Fitness Management Platform",
    tools: "React, TypeScript, Django, REST APIs, Memberships, Payments, Reporting",
    image: getImagePath("Progressive-GymManagement.png"),
  },
  {
    title: "Energy Consumption Forecasting",
    category: "Time-Series & Machine Learning",
    tools: "Python, pandas, ARIMA, Prophet, XGBoost, Feature Engineering",
    image: getImagePath("energy-consumption-forecasting.png"),
  },
  {
    title: "Mall Customer Segmentation",
    category: "Unsupervised Machine Learning",
    tools: "Python, pandas, scikit-learn, K-Means Clustering, PCA, t-SNE",
    image: getImagePath("mall-customer-segmentation.png"),
  },
  {
    title: "Loan Approval Prediction",
    category: "Supervised ML (Classification)",
    tools: "Python, pandas, Logistic Regression, Feature Encoding, Model Evaluation",
    image: getImagePath("loan-approval-prediction.png"),
  },
  {
    title: "Insurance Charges Prediction",
    category: "Supervised ML (Regression)",
    tools: "Python, pandas, Linear Regression, MAE, RMSE, Feature Encoding",
    image: getImagePath("insurance-charges-prediction.png"),
  },
  {
    title: "Smart Invoicing System",
    category: "Billing & Workflow Automation",
    tools: "Python, pandas, invoice generation, validation rules, CSV/PDF export",
    image: getImagePath("smart-invoicing-system.png"),
  },
  {
    title: "Global Superstore Dashboard",
    category: "Business Intelligence & Analytics",
    tools: "Python, pandas, Streamlit, Plotly, KPI Calculation",
    image: getImagePath("global-superstore-dashboard.png"),
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const flex = flexRef.current;

    if (!section || !container || !flex) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(min-width: 1026px)", () => {
        const getTravelX = () => {
          const lastCard = flex.lastElementChild as HTMLElement | null;
          if (!lastCard) return 0;

          return Math.max(
            0,
            lastCard.offsetLeft + lastCard.offsetWidth - container.clientWidth
          );
        };

        gsap.set(flex, { x: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getTravelX() + window.innerWidth * 0.75}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            id: "work",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(flex, {
          x: () => -getTravelX(),
          ease: "none",
        });

        const refreshTrigger = () => ScrollTrigger.refresh();
        window.addEventListener("load", refreshTrigger);

        return () => {
          window.removeEventListener("load", refreshTrigger);
          timeline.kill();
        };
      });

      media.add("(max-width: 1025px)", () => {
        gsap.set(flex, { clearProps: "transform" });
      });
    }, section);

    ScrollTrigger.refresh();

    return () => {
      media.revert();
      ctx.revert();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container" ref={containerRef}>
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={flexRef}>
          {PROJECTS.map((project, index) => (
            <article className="work-box" key={project.title}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{index + 1 < 10 ? `0${index + 1}` : index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
