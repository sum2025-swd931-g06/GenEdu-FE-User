import { AudioProject, Project, ProjectDetail, UserData, Slide } from '../types/auth.type'

// User data for hoangclw@gmail.com
export const hoangUser: UserData = {
  id: 'user-hoang-001',
  name: 'Hoang Le',
  email: 'hoangclw@gmail.com',
  idNumber: 'HLC20241201'
}

// Enhanced Audio Projects for Hoang
export const hoangAudioProjects: AudioProject[] = [
  {
    id: 'audio-hoang-1',
    title: 'Digital Transformation in Healthcare - Narration',
    status: 'COMPLETED',
    creationTime: Date.now() - 172800000, // 2 days ago
    durationSeconds: 420, // 7 minutes
    textContent: `
      Welcome to our comprehensive presentation on Digital Transformation in Healthcare.
      Today, we'll explore how technology is revolutionizing patient care, medical research, and healthcare delivery.
      From artificial intelligence in diagnostics to telemedicine platforms, we'll discover the innovations
      that are making healthcare more accessible, efficient, and personalized than ever before.
      Join us as we dive into the future of medicine and understand how digital solutions are saving lives
      and improving outcomes across the globe.
    `,
    audioUrl: 'https://example.com/audio/healthcare-digital-transformation-narration.mp3',
    voiceType: 'Professional Male - David'
  },
  {
    id: 'audio-hoang-2',
    title: 'Sustainable Energy Solutions - Presentation Audio',
    status: 'COMPLETED',
    creationTime: Date.now() - 86400000, // 1 day ago
    durationSeconds: 360, // 6 minutes
    textContent: `
      The world is at a critical juncture in addressing climate change, and sustainable energy solutions
      are at the forefront of this global challenge. This presentation will take you through the latest
      innovations in solar, wind, and hydroelectric power, as well as emerging technologies like
      green hydrogen and advanced battery storage systems. We'll examine real-world case studies,
      economic impacts, and the policy frameworks needed to accelerate the transition to clean energy.
      Together, we can build a sustainable future for generations to come.
    `,
    audioUrl: 'https://example.com/audio/sustainable-energy-narration.mp3',
    voiceType: 'Professional Female - Sarah'
  },
  {
    id: 'audio-hoang-3',
    title: 'Cybersecurity Best Practices - Introduction',
    status: 'PROCESSING',
    creationTime: Date.now() - 3600000, // 1 hour ago
    durationSeconds: 240, // 4 minutes
    textContent: `
      In today's interconnected digital world, cybersecurity is not just an IT concern—it's a business imperative.
      This presentation will guide you through essential cybersecurity practices that every organization needs to implement.
      We'll cover threat landscape analysis, risk assessment frameworks, employee training programs, and incident response procedures.
    `,
    voiceType: 'Professional Male - Alex'
  }
]

// Comprehensive Projects for Hoang
export const hoangProjects: Project[] = [
  {
    id: 'proj-hoang-1',
    title: 'Digital Transformation in Healthcare',
    status: 'COMPLETED',
    creationTime: Date.now() - 172800000, // 2 days ago
    slideNum: 12,
    audioProject: hoangAudioProjects[0]
  },
  {
    id: 'proj-hoang-2',
    title: 'Sustainable Energy Solutions for Smart Cities',
    status: 'COMPLETED',
    creationTime: Date.now() - 86400000, // 1 day ago
    slideNum: 15,
    audioProject: hoangAudioProjects[1]
  },
  {
    id: 'proj-hoang-3',
    title: 'Cybersecurity Best Practices for SMEs',
    status: 'IN_PROGRESS',
    creationTime: Date.now() - 3600000, // 1 hour ago
    slideNum: 8,
    audioProject: hoangAudioProjects[2]
  }
]

// Detailed slides for Project 1: Digital Transformation in Healthcare
const healthcareSlides: Slide[] = [
  {
    id: 'slide-hc-1',
    title: 'Digital Transformation in Healthcare',
    content: `
      <div class="slide-content">
        <h1>Digital Transformation in Healthcare</h1>
        <h2>Revolutionizing Patient Care Through Technology</h2>
        <div class="subtitle">
          <p>Presented by: Hoang Le</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="key-points">
          <h3>What We'll Cover:</h3>
          <ul>
            <li>AI-Powered Diagnostics</li>
            <li>Telemedicine Revolution</li>
            <li>IoT in Healthcare</li>
            <li>Data Analytics & Insights</li>
          </ul>
        </div>
      </div>
    `,
    order: 1
  },
  {
    id: 'slide-hc-2',
    title: 'Current Healthcare Challenges',
    content: `
      <div class="slide-content">
        <h2>Current Healthcare Challenges</h2>
        <div class="challenges-grid">
          <div class="challenge-item">
            <h3>🏥 Accessibility</h3>
            <p>Limited access to quality healthcare in rural areas</p>
          </div>
          <div class="challenge-item">
            <h3>💰 Rising Costs</h3>
            <p>Healthcare expenses increasing faster than inflation</p>
          </div>
          <div class="challenge-item">
            <h3>👩‍⚕️ Staff Shortages</h3>
            <p>Growing demand vs. limited healthcare professionals</p>
          </div>
          <div class="challenge-item">
            <h3>📊 Data Silos</h3>
            <p>Fragmented patient data across different systems</p>
          </div>
        </div>
      </div>
    `,
    order: 2
  },
  {
    id: 'slide-hc-3',
    title: 'AI-Powered Diagnostics',
    content: `
      <div class="slide-content">
        <h2>AI-Powered Diagnostics</h2>
        <div class="ai-features">
          <div class="feature">
            <h3>🔬 Medical Imaging</h3>
            <ul>
              <li>X-ray analysis with 95% accuracy</li>
              <li>MRI scan interpretation</li>
              <li>Early cancer detection</li>
            </ul>
          </div>
          <div class="feature">
            <h3>🧬 Genomic Analysis</h3>
            <ul>
              <li>Personalized treatment plans</li>
              <li>Genetic risk assessment</li>
              <li>Drug interaction predictions</li>
            </ul>
          </div>
          <div class="statistics">
            <h3>Impact Statistics:</h3>
            <p><strong>40%</strong> reduction in diagnostic errors</p>
            <p><strong>60%</strong> faster diagnosis time</p>
            <p><strong>$50B</strong> potential annual savings</p>
          </div>
        </div>
      </div>
    `,
    order: 3
  },
  {
    id: 'slide-hc-4',
    title: 'Telemedicine Revolution',
    content: `
      <div class="slide-content">
        <h2>Telemedicine Revolution</h2>
        <div class="telemedicine-benefits">
          <div class="benefit-section">
            <h3>📱 Remote Consultations</h3>
            <ul>
              <li>Video consultations with specialists</li>
              <li>Real-time health monitoring</li>
              <li>Prescription management</li>
            </ul>
          </div>
          <div class="benefit-section">
            <h3>🌍 Global Reach</h3>
            <ul>
              <li>Access to international experts</li>
              <li>Rural healthcare support</li>
              <li>Emergency response systems</li>
            </ul>
          </div>
          <div class="covid-impact">
            <h3>COVID-19 Impact:</h3>
            <p>Telemedicine adoption increased by <strong>3,800%</strong> during the pandemic</p>
          </div>
        </div>
      </div>
    `,
    order: 4
  },
  {
    id: 'slide-hc-5',
    title: 'IoT in Healthcare',
    content: `
      <div class="slide-content">
        <h2>Internet of Things (IoT) in Healthcare</h2>
        <div class="iot-applications">
          <div class="iot-category">
            <h3>⌚ Wearable Devices</h3>
            <ul>
              <li>Continuous heart rate monitoring</li>
              <li>Sleep pattern analysis</li>
              <li>Activity tracking</li>
              <li>Fall detection systems</li>
            </ul>
          </div>
          <div class="iot-category">
            <h3>🏥 Smart Hospital Equipment</h3>
            <ul>
              <li>Automated medication dispensing</li>
              <li>Asset tracking systems</li>
              <li>Environmental monitoring</li>
              <li>Patient flow optimization</li>
            </ul>
          </div>
          <div class="market-data">
            <h3>Market Growth:</h3>
            <p>IoT healthcare market expected to reach <strong>$289B by 2028</strong></p>
          </div>
        </div>
      </div>
    `,
    order: 5
  },
  {
    id: 'slide-hc-6',
    title: 'Electronic Health Records (EHR)',
    content: `
      <div class="slide-content">
        <h2>Electronic Health Records (EHR)</h2>
        <div class="ehr-benefits">
          <div class="benefit">
            <h3>📋 Comprehensive Patient Data</h3>
            <p>Complete medical history in one digital location</p>
          </div>
          <div class="benefit">
            <h3>🔄 Interoperability</h3>
            <p>Seamless data sharing between healthcare providers</p>
          </div>
          <div class="benefit">
            <h3>🔍 Clinical Decision Support</h3>
            <p>AI-powered recommendations and alerts</p>
          </div>
          <div class="benefit">
            <h3>📊 Analytics & Reporting</h3>
            <p>Population health insights and trend analysis</p>
          </div>
        </div>
        <div class="adoption-stats">
          <h3>Adoption Rate: <span style="color: #52c41a;">87%</span> of hospitals use EHR systems</h3>
        </div>
      </div>
    `,
    order: 6
  },
  {
    id: 'slide-hc-7',
    title: 'Data Analytics & Predictive Insights',
    content: `
      <div class="slide-content">
        <h2>Data Analytics & Predictive Insights</h2>
        <div class="analytics-applications">
          <div class="application">
            <h3>🔮 Predictive Analytics</h3>
            <ul>
              <li>Disease outbreak predictions</li>
              <li>Patient readmission risks</li>
              <li>Treatment outcome forecasting</li>
            </ul>
          </div>
          <div class="application">
            <h3>📈 Population Health</h3>
            <ul>
              <li>Epidemiological studies</li>
              <li>Public health monitoring</li>
              <li>Resource allocation optimization</li>
            </ul>
          </div>
          <div class="case-study">
            <h3>Case Study: Johns Hopkins</h3>
            <p>Reduced patient readmissions by <strong>25%</strong> using predictive analytics</p>
          </div>
        </div>
      </div>
    `,
    order: 7
  },
  {
    id: 'slide-hc-8',
    title: 'Robotic Surgery & Automation',
    content: `
      <div class="slide-content">
        <h2>Robotic Surgery & Automation</h2>
        <div class="robotics-content">
          <div class="robotics-benefits">
            <h3>🤖 Surgical Robots</h3>
            <ul>
              <li>Minimally invasive procedures</li>
              <li>Enhanced precision and control</li>
              <li>Reduced recovery time</li>
              <li>Lower complication rates</li>
            </ul>
          </div>
          <div class="automation-examples">
            <h3>⚙️ Hospital Automation</h3>
            <ul>
              <li>Automated pharmacy systems</li>
              <li>Robotic cleaning and sterilization</li>
              <li>Supply chain management</li>
              <li>Patient transport robots</li>
            </ul>
          </div>
          <div class="success-metrics">
            <h3>Success Metrics:</h3>
            <p><strong>50%</strong> reduction in surgical complications</p>
            <p><strong>30%</strong> shorter hospital stays</p>
          </div>
        </div>
      </div>
    `,
    order: 8
  },
  {
    id: 'slide-hc-9',
    title: 'Cybersecurity in Healthcare',
    content: `
      <div class="slide-content">
        <h2>Cybersecurity in Healthcare</h2>
        <div class="security-content">
          <div class="threats">
            <h3>🚨 Major Threats</h3>
            <ul>
              <li>Ransomware attacks on hospitals</li>
              <li>Patient data breaches</li>
              <li>Medical device vulnerabilities</li>
              <li>Insider threats</li>
            </ul>
          </div>
          <div class="protection-measures">
            <h3>🛡️ Protection Measures</h3>
            <ul>
              <li>End-to-end encryption</li>
              <li>Multi-factor authentication</li>
              <li>Regular security audits</li>
              <li>Staff training programs</li>
            </ul>
          </div>
          <div class="compliance">
            <h3>Regulatory Compliance:</h3>
            <p>HIPAA, GDPR, HITECH Act compliance requirements</p>
          </div>
        </div>
      </div>
    `,
    order: 9
  },
  {
    id: 'slide-hc-10',
    title: 'Implementation Challenges',
    content: `
      <div class="slide-content">
        <h2>Implementation Challenges</h2>
        <div class="challenges-solutions">
          <div class="challenge-solution-pair">
            <div class="challenge">
              <h3>❌ Challenge: High Initial Costs</h3>
              <p>Technology infrastructure requires significant investment</p>
            </div>
            <div class="solution">
              <h3>✅ Solution: Phased Implementation</h3>
              <p>Gradual rollout with ROI-focused priorities</p>
            </div>
          </div>
          <div class="challenge-solution-pair">
            <div class="challenge">
              <h3>❌ Challenge: Staff Resistance</h3>
              <p>Healthcare workers may resist new technologies</p>
            </div>
            <div class="solution">
              <h3>✅ Solution: Comprehensive Training</h3>
              <p>Change management and continuous education</p>
            </div>
          </div>
          <div class="challenge-solution-pair">
            <div class="challenge">
              <h3>❌ Challenge: Data Integration</h3>
              <p>Legacy systems and data silos</p>
            </div>
            <div class="solution">
              <h3>✅ Solution: API-First Approach</h3>
              <p>Standardized interfaces and gradual migration</p>
            </div>
          </div>
        </div>
      </div>
    `,
    order: 10
  },
  {
    id: 'slide-hc-11',
    title: 'Future Outlook',
    content: `
      <div class="slide-content">
        <h2>Future Outlook: Next 5-10 Years</h2>
        <div class="future-trends">
          <div class="trend">
            <h3>🧠 AI & Machine Learning</h3>
            <ul>
              <li>Autonomous diagnostic systems</li>
              <li>Personalized treatment protocols</li>
              <li>Drug discovery acceleration</li>
            </ul>
          </div>
          <div class="trend">
            <h3>🔬 Precision Medicine</h3>
            <ul>
              <li>Genomic-based treatments</li>
              <li>Biomarker-driven therapies</li>
              <li>Custom drug formulations</li>
            </ul>
          </div>
          <div class="trend">
            <h3>🌐 Digital Health Ecosystems</h3>
            <ul>
              <li>Integrated health platforms</li>
              <li>Real-time health monitoring</li>
              <li>Preventive care focus</li>
            </ul>
          </div>
          <div class="investment-projection">
            <h3>Investment Projection:</h3>
            <p>Digital health funding expected to reach <strong>$659B by 2030</strong></p>
          </div>
        </div>
      </div>
    `,
    order: 11
  },
  {
    id: 'slide-hc-12',
    title: 'Conclusion & Next Steps',
    content: `
      <div class="slide-content">
        <h2>Conclusion & Next Steps</h2>
        <div class="conclusion-content">
          <div class="key-takeaways">
            <h3>🎯 Key Takeaways</h3>
            <ul>
              <li>Digital transformation is reshaping healthcare delivery</li>
              <li>AI and IoT technologies are driving efficiency gains</li>
              <li>Patient outcomes are improving through technology</li>
              <li>Cybersecurity and privacy remain critical considerations</li>
            </ul>
          </div>
          <div class="action-items">
            <h3>📋 Recommended Actions</h3>
            <ol>
              <li>Assess current digital maturity level</li>
              <li>Develop a comprehensive digital strategy</li>
              <li>Invest in staff training and change management</li>
              <li>Prioritize cybersecurity and compliance</li>
              <li>Start with pilot programs and scale gradually</li>
            </ol>
          </div>
          <div class="contact-info">
            <h3>📧 Contact Information</h3>
            <p>Hoang Le - hoangclw@gmail.com</p>
            <p>Thank you for your attention!</p>
          </div>
        </div>
      </div>
    `,
    order: 12
  }
]

// Detailed slides for Project 2: Sustainable Energy Solutions
const energySlides: Slide[] = [
  {
    id: 'slide-en-1',
    title: 'Sustainable Energy Solutions for Smart Cities',
    content: `
      <div class="slide-content">
        <h1>Sustainable Energy Solutions for Smart Cities</h1>
        <h2>Building the Urban Future with Clean Technology</h2>
        <div class="subtitle">
          <p>Presented by: Hoang Le</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="agenda">
          <h3>Today's Journey:</h3>
          <ul>
            <li>Smart Grid Technologies</li>
            <li>Renewable Energy Integration</li>
            <li>Energy Storage Solutions</li>
            <li>Case Studies & Implementation</li>
          </ul>
        </div>
      </div>
    `,
    order: 1
  },
  {
    id: 'slide-en-2',
    title: 'The Urban Energy Challenge',
    content: `
      <div class="slide-content">
        <h2>The Urban Energy Challenge</h2>
        <div class="challenge-stats">
          <div class="stat-item">
            <h3>🌆 68% of Global Population</h3>
            <p>Will live in cities by 2050</p>
          </div>
          <div class="stat-item">
            <h3>⚡ 78% of Energy Consumption</h3>
            <p>Cities consume most of the world's energy</p>
          </div>
          <div class="stat-item">
            <h3>🌡️ 70% of CO2 Emissions</h3>
            <p>Urban areas produce majority of greenhouse gases</p>
          </div>
        </div>
        <div class="urgency">
          <h3>Why Act Now?</h3>
          <p>Cities must transition to sustainable energy to combat climate change and ensure energy security</p>
        </div>
      </div>
    `,
    order: 2
  },
  {
    id: 'slide-en-3',
    title: 'Smart Grid Infrastructure',
    content: `
      <div class="slide-content">
        <h2>Smart Grid Infrastructure</h2>
        <div class="smart-grid-features">
          <div class="feature-category">
            <h3>🔌 Advanced Metering</h3>
            <ul>
              <li>Real-time energy monitoring</li>
              <li>Demand response programs</li>
              <li>Peak load management</li>
            </ul>
          </div>
          <div class="feature-category">
            <h3>🤖 AI-Powered Optimization</h3>
            <ul>
              <li>Predictive maintenance</li>
              <li>Load forecasting</li>
              <li>Automated fault detection</li>
            </ul>
          </div>
          <div class="feature-category">
            <h3>🔄 Bidirectional Energy Flow</h3>
            <ul>
              <li>Distributed energy resources</li>
              <li>Vehicle-to-grid integration</li>
              <li>Peer-to-peer energy trading</li>
            </ul>
          </div>
        </div>
        <div class="benefits">
          <h3>Benefits: 30% reduction in energy waste, $200B annual savings globally</h3>
        </div>
      </div>
    `,
    order: 3
  },
  {
    id: 'slide-en-4',
    title: 'Solar Energy Integration',
    content: `
      <div class="slide-content">
        <h2>Solar Energy Integration</h2>
        <div class="solar-solutions">
          <div class="solution-type">
            <h3>🏢 Building-Integrated Photovoltaics</h3>
            <ul>
              <li>Solar facades and windows</li>
              <li>Rooftop solar installations</li>
              <li>Solar canopies over parking areas</li>
            </ul>
          </div>
          <div class="solution-type">
            <h3>🌞 Community Solar Gardens</h3>
            <ul>
              <li>Shared solar installations</li>
              <li>Subscription-based models</li>
              <li>Accessible to all income levels</li>
            </ul>
          </div>
          <div class="solution-type">
            <h3>💡 Smart Solar Systems</h3>
            <ul>
              <li>AI-optimized panel positioning</li>
              <li>Weather-responsive operations</li>
              <li>Grid synchronization</li>
            </ul>
          </div>
        </div>
        <div class="cost-trends">
          <h3>Cost Reduction: Solar prices dropped 90% in the last decade</h3>
        </div>
      </div>
    `,
    order: 4
  },
  {
    id: 'slide-en-5',
    title: 'Wind Power in Urban Environments',
    content: `
      <div class="slide-content">
        <h2>Wind Power in Urban Environments</h2>
        <div class="wind-technologies">
          <div class="tech-category">
            <h3>🌪️ Vertical Axis Wind Turbines</h3>
            <ul>
              <li>Compact design for urban spaces</li>
              <li>Lower noise levels</li>
              <li>Omnidirectional wind capture</li>
            </ul>
          </div>
          <div class="tech-category">
            <h3>🏗️ Building-Integrated Wind</h3>
            <ul>
              <li>Architectural wind tunnels</li>
              <li>Micro-turbines on high-rises</li>
              <li>Wind-capturing building designs</li>
            </ul>
          </div>
          <div class="tech-category">
            <h3>🌊 Offshore Wind Farms</h3>
            <ul>
              <li>Higher wind speeds and consistency</li>
              <li>Minimal land use conflicts</li>
              <li>Large-scale power generation</li>
            </ul>
          </div>
        </div>
        <div class="capacity-growth">
          <h3>Global offshore wind capacity to reach 234 GW by 2030</h3>
        </div>
      </div>
    `,
    order: 5
  },
  {
    id: 'slide-en-6',
    title: 'Energy Storage Revolution',
    content: `
      <div class="slide-content">
        <h2>Energy Storage Revolution</h2>
        <div class="storage-technologies">
          <div class="storage-type">
            <h3>🔋 Lithium-Ion Batteries</h3>
            <ul>
              <li>Grid-scale battery systems</li>
              <li>Fast response times</li>
              <li>Declining costs (89% reduction since 2010)</li>
            </ul>
          </div>
          <div class="storage-type">
            <h3>💧 Pumped Hydro Storage</h3>
            <ul>
              <li>Large-scale energy storage</li>
              <li>Long duration discharge</li>
              <li>95% of global storage capacity</li>
            </ul>
          </div>
          <div class="storage-type">
            <h3>🌡️ Thermal Energy Storage</h3>
            <ul>
              <li>Molten salt systems</li>
              <li>Underground thermal storage</li>
              <li>Integration with district heating</li>
            </ul>
          </div>
        </div>
        <div class="emerging-tech">
          <h3>Emerging Technologies:</h3>
          <p>Green hydrogen, compressed air storage, gravity-based systems</p>
        </div>
      </div>
    `,
    order: 6
  },
  {
    id: 'slide-en-7',
    title: 'Electric Vehicle Integration',
    content: `
      <div class="slide-content">
        <h2>Electric Vehicle Integration</h2>
        <div class="ev-integration">
          <div class="integration-aspect">
            <h3>🔌 Charging Infrastructure</h3>
            <ul>
              <li>Smart charging stations</li>
              <li>Ultra-fast charging networks</li>
              <li>Wireless charging technology</li>
            </ul>
          </div>
          <div class="integration-aspect">
            <h3>⚡ Vehicle-to-Grid (V2G)</h3>
            <ul>
              <li>EVs as mobile energy storage</li>
              <li>Grid stabilization services</li>
              <li>Peak shaving capabilities</li>
            </ul>
          </div>
          <div class="integration-aspect">
            <h3>🚗 Fleet Electrification</h3>
            <ul>
              <li>Public transit electrification</li>
              <li>Delivery vehicle fleets</li>
              <li>Ride-sharing services</li>
            </ul>
          </div>
        </div>
        <div class="market-projection">
          <h3>EV Market: Expected to reach 145 million vehicles by 2030</h3>
        </div>
      </div>
    `,
    order: 7
  },
  {
    id: 'slide-en-8',
    title: 'Green Hydrogen Economy',
    content: `
      <div class="slide-content">
        <h2>Green Hydrogen Economy</h2>
        <div class="hydrogen-applications">
          <div class="application-sector">
            <h3>🏭 Industrial Applications</h3>
            <ul>
              <li>Steel and cement production</li>
              <li>Chemical feedstock</li>
              <li>Refinery operations</li>
            </ul>
          </div>
          <div class="application-sector">
            <h3>🚛 Transportation</h3>
            <ul>
              <li>Heavy-duty trucking</li>
              <li>Maritime shipping</li>
              <li>Aviation fuel</li>
            </ul>
          </div>
          <div class="application-sector">
            <h3>⚡ Power Generation</h3>
            <ul>
              <li>Long-term energy storage</li>
              <li>Seasonal storage solutions</li>
              <li>Grid balancing services</li>
            </ul>
          </div>
        </div>
        <div class="hydrogen-potential">
          <h3>Market Potential: $2.5 trillion hydrogen economy by 2050</h3>
        </div>
      </div>
    `,
    order: 8
  },
  {
    id: 'slide-en-9',
    title: 'Case Study: Copenhagen, Denmark',
    content: `
      <div class="slide-content">
        <h2>Case Study: Copenhagen, Denmark</h2>
        <div class="case-study-content">
          <div class="objectives">
            <h3>🎯 Ambitious Goals</h3>
            <ul>
              <li>Carbon neutral by 2025</li>
              <li>100% renewable energy</li>
              <li>50% reduction in CO2 emissions</li>
            </ul>
          </div>
          <div class="implementations">
            <h3>🛠️ Key Implementations</h3>
            <ul>
              <li>District heating from waste incineration</li>
              <li>Offshore wind farms (Middelgrunden)</li>
              <li>Extensive cycling infrastructure</li>
              <li>Green roof requirements</li>
            </ul>
          </div>
          <div class="results">
            <h3>📊 Results to Date</h3>
            <ul>
              <li>42% CO2 reduction since 2005</li>
              <li>60% of electricity from wind</li>
              <li>50% of residents bike to work daily</li>
            </ul>
          </div>
        </div>
        <div class="lesson-learned">
          <h3>Key Lesson: Integrated approach combining technology, policy, and citizen engagement</h3>
        </div>
      </div>
    `,
    order: 9
  },
  {
    id: 'slide-en-10',
    title: 'Case Study: Singapore Smart Nation',
    content: `
      <div class="slide-content">
        <h2>Case Study: Singapore Smart Nation</h2>
        <div class="singapore-initiatives">
          <div class="initiative">
            <h3>🌞 SolarNova Program</h3>
            <ul>
              <li>2 GWp solar target by 2030</li>
              <li>Floating solar farms</li>
              <li>Building-integrated solar</li>
            </ul>
          </div>
          <div class="initiative">
            <h3>🔋 Energy Storage Systems</h3>
            <ul>
              <li>200 MW of utility-scale storage</li>
              <li>Behind-the-meter batteries</li>
              <li>Virtual power plants</li>
            </ul>
          </div>
          <div class="initiative">
            <h3>⚡ Smart Grid 2.0</h3>
            <ul>
              <li>Advanced metering infrastructure</li>
              <li>Demand response programs</li>
              <li>Microgrids for resilience</li>
            </ul>
          </div>
        </div>
        <div class="innovation-highlights">
          <h3>Innovation Highlights:</h3>
          <p>Testbed for emerging technologies, public-private partnerships, regulatory sandboxes</p>
        </div>
      </div>
    `,
    order: 10
  },
  {
    id: 'slide-en-11',
    title: 'Economic Impact & Job Creation',
    content: `
      <div class="slide-content">
        <h2>Economic Impact & Job Creation</h2>
        <div class="economic-benefits">
          <div class="benefit-category">
            <h3>💼 Job Creation</h3>
            <ul>
              <li>42 million renewable energy jobs globally</li>
              <li>Solar PV: 4.9 million jobs</li>
              <li>Wind: 1.3 million jobs</li>
            </ul>
          </div>
          <div class="benefit-category">
            <h3>💰 Investment Opportunities</h3>
            <ul>
              <li>$4.5 trillion renewable investment needed by 2030</li>
              <li>ROI: 3:1 on clean energy investments</li>
              <li>$131 trillion economic opportunity</li>
            </ul>
          </div>
          <div class="benefit-category">
            <h3>🏥 Health Benefits</h3>
            <ul>
              <li>$42 trillion in health savings</li>
              <li>Reduced air pollution</li>
              <li>Lower healthcare costs</li>
            </ul>
          </div>
        </div>
        <div class="multiplier-effect">
          <h3>Multiplier Effect: Every $1 in renewable energy creates $2.5 in economic activity</h3>
        </div>
      </div>
    `,
    order: 11
  },
  {
    id: 'slide-en-12',
    title: 'Implementation Roadmap',
    content: `
      <div class="slide-content">
        <h2>Implementation Roadmap</h2>
        <div class="roadmap-phases">
          <div class="phase">
            <h3>📋 Phase 1: Assessment (Months 1-3)</h3>
            <ul>
              <li>Energy audit and baseline establishment</li>
              <li>Stakeholder engagement</li>
              <li>Regulatory framework review</li>
            </ul>
          </div>
          <div class="phase">
            <h3>🛠️ Phase 2: Infrastructure (Months 4-12)</h3>
            <ul>
              <li>Smart grid deployment</li>
              <li>Renewable energy installations</li>
              <li>Storage system integration</li>
            </ul>
          </div>
          <div class="phase">
            <h3>🔄 Phase 3: Optimization (Months 13-24)</h3>
            <ul>
              <li>AI system implementation</li>
              <li>Demand response programs</li>
              <li>Performance monitoring</li>
            </ul>
          </div>
        </div>
        <div class="success-factors">
          <h3>Critical Success Factors:</h3>
          <p>Political will, public engagement, financing mechanisms, technology partnerships</p>
        </div>
      </div>
    `,
    order: 12
  },
  {
    id: 'slide-en-13',
    title: 'Policy & Regulatory Framework',
    content: `
      <div class="slide-content">
        <h2>Policy & Regulatory Framework</h2>
        <div class="policy-areas">
          <div class="policy-category">
            <h3>💰 Financial Incentives</h3>
            <ul>
              <li>Feed-in tariffs</li>
              <li>Tax credits and rebates</li>
              <li>Green bonds and financing</li>
            </ul>
          </div>
          <div class="policy-category">
            <h3>📜 Regulatory Support</h3>
            <ul>
              <li>Renewable portfolio standards</li>
              <li>Net metering policies</li>
              <li>Building energy codes</li>
            </ul>
          </div>
          <div class="policy-category">
            <h3>🌍 International Cooperation</h3>
            <ul>
              <li>Paris Agreement commitments</li>
              <li>Technology transfer programs</li>
              <li>Carbon pricing mechanisms</li>
            </ul>
          </div>
        </div>
        <div class="policy-impact">
          <h3>Policy Impact: Well-designed policies can accelerate adoption by 10x</h3>
        </div>
      </div>
    `,
    order: 13
  },
  {
    id: 'slide-en-14',
    title: 'Financing Sustainable Energy',
    content: `
      <div class="slide-content">
        <h2>Financing Sustainable Energy</h2>
        <div class="financing-mechanisms">
          <div class="mechanism">
            <h3>🏦 Traditional Financing</h3>
            <ul>
              <li>Commercial bank loans</li>
              <li>Infrastructure funds</li>
              <li>Government grants</li>
            </ul>
          </div>
          <div class="mechanism">
            <h3>💚 Green Finance</h3>
            <ul>
              <li>Green bonds ($500B market)</li>
              <li>ESG investments</li>
              <li>Climate funds</li>
            </ul>
          </div>
          <div class="mechanism">
            <h3>🔄 Innovative Models</h3>
            <ul>
              <li>Power purchase agreements (PPAs)</li>
              <li>Energy service companies (ESCOs)</li>
              <li>Peer-to-peer financing</li>
            </ul>
          </div>
        </div>
        <div class="financing-trends">
          <h3>Financing Trends: $1.8 trillion invested in clean energy in 2023</h3>
        </div>
      </div>
    `,
    order: 14
  },
  {
    id: 'slide-en-15',
    title: 'The Path Forward',
    content: `
      <div class="slide-content">
        <h2>The Path Forward</h2>
        <div class="conclusion-elements">
          <div class="key-messages">
            <h3>🔑 Key Messages</h3>
            <ul>
              <li>Sustainable energy is technically and economically viable</li>
              <li>Smart cities require integrated energy solutions</li>
              <li>Collaboration between sectors is essential</li>
              <li>Time to act is now - climate window is closing</li>
            </ul>
          </div>
          <div class="next-steps">
            <h3>📅 Immediate Next Steps</h3>
            <ol>
              <li>Conduct energy assessment of your city/organization</li>
              <li>Develop stakeholder coalition</li>
              <li>Create financing strategy</li>
              <li>Start pilot projects</li>
              <li>Scale successful initiatives</li>
            </ol>
          </div>
          <div class="call-to-action">
            <h3>🌟 Call to Action</h3>
            <p>Let's build sustainable, resilient cities that serve as models for the world. The future depends on the decisions we make today.</p>
          </div>
        </div>
        <div class="contact">
          <h3>📧 Let's Connect: hoangclw@gmail.com</h3>
        </div>
      </div>
    `,
    order: 15
  }
]

// Project Details with comprehensive slide content
export const hoangProjectDetails: { [key: string]: ProjectDetail } = {
  'proj-hoang-1': {
    ...hoangProjects[0],
    slides: healthcareSlides
  },
  'proj-hoang-2': {
    ...hoangProjects[1],
    slides: energySlides
  },
  'proj-hoang-3': {
    ...hoangProjects[2],
    slides: [
      {
        id: 'slide-cs-1',
        title: 'Cybersecurity Best Practices for SMEs',
        content: `
          <h1>Cybersecurity Best Practices for SMEs</h1>
          <h2>Protecting Your Business in the Digital Age</h2>
          <p>Presenter: Hoang Le | hoangclw@gmail.com</p>
        `,
        order: 1
      },
      {
        id: 'slide-cs-2',
        title: 'Current Threat Landscape',
        content: `
          <h2>Current Threat Landscape</h2>
          <ul>
            <li>Ransomware attacks increased by 150% in 2023</li>
            <li>SMEs are 3x more likely to be targeted</li>
            <li>Average cost of data breach: $4.45 million</li>
            <li>60% of SMEs go out of business after a cyber attack</li>
          </ul>
        `,
        order: 2
      }
      // Additional slides would be added here for the cybersecurity presentation
    ]
  }
}

// Export all mock data for easy integration
export const comprehensiveMockData = {
  user: hoangUser,
  projects: hoangProjects,
  audioProjects: hoangAudioProjects,
  projectDetails: hoangProjectDetails
}
