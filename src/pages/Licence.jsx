import React from 'react';

const sections = [
  {
    title: '1. End-User License Agreement (EULA)',
    content: `This End-User License Agreement (“Agreement”) governs your use of the Aflaguard platform, a proprietary software system 
    developed for institutional aflatoxin classification and procurement decision support. By accessing or using Aflaguard, you agree to 
    be legally bound by the terms herein. The software is licensed to institutions for internal use only, not sold, and must not be reproduced, 
    reverse-engineered, redistributed, or modified without prior written consent from Aflakiosk Ltd.`
  },
  {
    title: '2. Intellectual Property & Copyright',
    content: `All intellectual property rights in the Aflaguard system, including but not limited to the machine learning models, web interfaces, 
    documentation, underlying codebase, architecture, data structures, and design, are owned exclusively by Aflakiosk Ltd and Dimitri Kwihangana. 
    Unauthorized use, reproduction, or distribution of any component of this system is strictly prohibited and may result in legal action.`
  },
  {
    title: '3. User Rights and Obligations',
    content: `Authorized users, including laboratory technicians, procurement officers, cooperatives, and processors, are granted role-based access 
    to specific features within the Aflaguard platform. Users are expected to maintain the confidentiality of login credentials, ensure data 
    integrity, and comply with institutional protocols. Misuse of the system, including submission of fraudulent data or attempts to circumvent 
    security features, is grounds for termination of access and possible legal consequences.`
  },
  {
    title: '4. Data Collection and Use',
    content: `Aflaguard collects and processes grain quality data including moisture content, kernel damage, foreign matter, and infestation indicators 
    solely for the purpose of predicting aflatoxin risk levels. This data is stored in a secure institutional database and used to generate 
    classification reports, track historical batches, and optimize model performance. No personal identifying information is collected unless 
    voluntarily submitted through support queries or account creation.`
  },
  {
    title: '5. Consent and Privacy Policy',
    content: `By using the platform, you consent to the collection, storage, and use of input data for aflatoxin risk classification and internal 
    analytics. All data is processed in accordance with applicable privacy legislation, including Rwanda Standards Board (RSB) data protection 
    guidelines and East African Community regulations. We do not sell, trade, or disclose institutional data to third parties without consent, 
    unless required by law.`
  },
  {
    title: '6. Accuracy, Limitations, and Liability',
    content: `While the Aflaguard system uses advanced machine learning algorithms to provide accurate aflatoxin classification (with >90% 
    precision for children’s safety categories), it is not a substitute for certified laboratory testing in regulated environments. 
    The predictions are generated based on data input by the user and model outputs, and should be used to support—not replace—professional judgment. 
    Aflakiosk Ltd shall not be held liable for any decisions, losses, or damages resulting from reliance on classification outputs.`
  },
  {
    title: '7. System Access and Availability',
    content: `Aflaguard is designed for institutional access across desktop and mobile platforms and maintains >99% availability uptime. 
    However, we make no guarantees regarding uninterrupted service. Users may experience temporary outages during maintenance or upgrades. 
    We recommend users regularly export data and reports for institutional archiving.`
  },
  {
    title: '8. Termination of Access',
    content: `Aflakiosk Ltd reserves the right to suspend or revoke access to Aflaguard in the event of user misconduct, breach of agreement, 
    unauthorized data manipulation, or attempts to harm the system. Institutions found in repeated violation may be blacklisted from future access.`
  },
  {
    title: '9. Updates and Amendments',
    content: `This Agreement is subject to periodic updates. Users will be notified in-platform or via email when changes occur. Continued use 
    of the platform after any amendment shall constitute acceptance of the revised terms. It is the responsibility of the institution and user 
    to review changes regularly.`
  },
  {
    title: '10. Governing Law and Jurisdiction',
    content: `This Agreement shall be governed by and construed in accordance with the laws of the Republic of Rwanda. Any disputes arising 
    under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts of Kigali.`
  },
  {
    title: '11. Contact and Support',
    content: `If you have any questions or require support related to this Agreement or the Aflaguard platform, please contact our team at 
    dimitrikwihangana@gmail.com or reach out via your institutional dashboard. Aflakiosk Ltd is committed to supporting institutions in their efforts 
    to ensure food safety and regulatory compliance.`
  }
];

export default function PolicyAgreement() {
  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">End-User License, Copyright & Privacy Policy Agreement</h1>
      {sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-600 mb-2">{section.title}</h2>
          <p className="text-justify leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
