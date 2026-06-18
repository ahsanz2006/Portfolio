import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Experience <span>&</span>
          <br /> Education
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Mathematics with Data Science</h4>
                <h5>COMSATS University, Lahore</h5>
              </div>
              <h3>2025 - 2029</h3>
            </div>
            <p>
              Studying Mathematics with Data Science with focus on Python, multivariable calculus, data analysis, mathematical thinking, and practical project development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Science & Analytics Internship</h4>
                <h5>DevelopersHub Corporation</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Completed internship projects in EDA, machine learning, forecasting, clustering, model evaluation, and Streamlit dashboard development.
            </p>
            <div className="career-tags">
              <span>Python</span>
              <span>pandas</span>
              <span>scikit-learn</span>
              <span>Streamlit</span>
              <span>ARIMA</span>
              <span>Prophet</span>
              <span>XGBoost</span>
              <span>K-Means</span>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance & Portfolio Projects</h4>
                <h5>Python Automation, Dashboards & Web Tasks</h5>
              </div>
              <h3>2025 - Present</h3>
            </div>
            <p>
              Built practical portfolio and freelance-style projects involving Python automation, dashboards, file handling, document generation, web styling, funnel pages, and workflow automation concepts.
            </p>
            <div className="career-tags">
              <span>Python</span>
              <span>Streamlit</span>
              <span>HTML</span>
              <span>CSS</span>
              <span>GoHighLevel</span>
              <span>Automation</span>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>School & College Background</h4>
                <h5>Beaconhouse School System & Punjab College, Lahore</h5>
              </div>
              <h3>2020 - 2024</h3>
            </div>
            <p>
              Completed Matriculation in Science and Intermediate F.Sc Pre-Medical, building a strong academic base in science, mathematics, and analytical learning.
            </p>
            <p className="career-achievement">Achieved 2nd Position in School during Matriculation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
