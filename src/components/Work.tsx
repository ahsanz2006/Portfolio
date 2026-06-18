import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Energy Consumption Forecasting",
    category: "Time-Series & Machine Learning",
    tools: "Python, pandas, ARIMA, Prophet, XGBoost, Feature Engineering",
    image: "/images/work/energy-consumption-forecasting.png",
  },
  {
    title: "Mall Customer Segmentation",
    category: "Unsupervised Machine Learning",
    tools: "Python, pandas, scikit-learn, K-Means Clustering, PCA, t-SNE",
    image: "/images/work/mall-customer-segmentation.png",
  },
  {
    title: "Loan Approval Prediction",
    category: "Supervised ML (Classification)",
    tools: "Python, pandas, Logistic Regression, Feature Encoding, Model Evaluation",
    image: "/images/work/loan-approval-prediction.png",
  },
  {
    title: "Insurance Charges Prediction",
    category: "Supervised ML (Regression)",
    tools: "Python, pandas, Linear Regression, MAE, RMSE, Feature Encoding",
    image: "/images/work/insurance-charges-prediction.png",
  },
  {
    title: "Smart Invoicing System",
    category: "Billing & Workflow Automation",
    tools: "Python, pandas, invoice generation, validation rules, CSV/PDF export",
    image: "/images/work/smart-invoicing-system.png",
  },
  {
    title: "Global Superstore Dashboard",
    category: "Business Intelligence & Analytics",
    tools: "Python, pandas, Streamlit, Plotly, KPI Calculation",
    image: "/images/work/global-superstore-dashboard.png",
  }
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

    const ctx = gsap.context(() => {
      const getTravelX = () => {
        return Math.max(0, flex.scrollWidth - container.clientWidth);
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getTravelX() + window.innerWidth}`,
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

      window.addEventListener("resize", refreshTrigger);
      window.addEventListener("load", refreshTrigger);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        window.removeEventListener("resize", refreshTrigger);
        window.removeEventListener("load", refreshTrigger);
      };
    }, section);

    return () => {
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
            <div className="work-box" key={index}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
