import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const glossaryTerms = [
  {
    category: 'User Acquisition',
    terms: [
      {
        term: 'CPI (Cost Per Install)',
        definition: 'The average cost paid to acquire one app installation. Calculated by dividing total ad spend by number of installs.',
        example: 'A CPI of $2.00 means you spend $2 on average to get one user to install your app.'
      },
      {
        term: 'CTR (Click-Through Rate)',
        definition: 'The percentage of users who click on your ad after seeing it. Calculated as (Clicks ÷ Impressions) × 100.',
        example: 'A 2% CTR means that out of every 100 people who see your ad, 2 people click on it.'
      },
      {
        term: 'CVR (Conversion Rate)',
        definition: 'The percentage of users who install your app after clicking on the ad. Calculated as (Installs ÷ Clicks) × 100.',
        example: 'A 20% CVR means that out of every 100 people who click your ad, 20 people install your app.'
      }
    ]
  },
  {
    category: 'Retention & Engagement',
    terms: [
      {
        term: 'DAU (Daily Active Users)',
        definition: 'The number of unique users who engage with your app in a single day.',
        example: 'If your DAU is 10,000, it means 10,000 different users opened your app that day.'
      },
      {
        term: 'D1/D7/D30 Retention',
        definition: 'The percentage of users who return to your app 1, 7, or 30 days after installing.',
        example: 'A D7 retention of 30% means 30% of users who installed your app are still using it after a week.'
      },
      {
        term: 'Session Length',
        definition: 'The average duration users spend in your app per session.',
        example: 'An average session length of 15 minutes indicates strong user engagement.'
      }
    ]
  },
  {
    category: 'Monetization',
    terms: [
      {
        term: 'ARPDAU',
        definition: 'Average Revenue Per Daily Active User. The average revenue generated from each active user per day.',
        example: 'An ARPDAU of $0.25 means each active user generates 25 cents of revenue per day on average.'
      },
      {
        term: 'eCPM',
        definition: 'Effective Cost Per Mille (thousand impressions). The revenue earned per thousand ad impressions.',
        example: 'An eCPM of $10 means you earn $10 for every thousand ad impressions shown.'
      },
      {
        term: 'Fill Rate',
        definition: 'The percentage of ad requests that are successfully filled with ads.',
        example: 'A fill rate of 90% means 90 out of 100 ad requests show an ad to users.'
      },
      {
        term: 'ROAS (Return on Ad Spend)',
        definition: 'The ratio of revenue generated to advertising costs. Calculated as Revenue ÷ Ad Spend.',
        example: 'A ROAS of 1.5 means you earn $1.50 for every $1 spent on advertising.'
      }
    ]
  }
];

const CategorySection = ({ category, terms, expandedTerm, setExpandedTerm }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-blue-900 mb-4">{category}</h3>
    <div className="space-y-3">
      {terms.map((item) => (
        <motion.div
          key={item.term}
          className="border rounded-lg overflow-hidden"
          initial={false}
        >
          <button
            className={`w-full text-left p-4 flex items-center justify-between ${
              expandedTerm === item.term ? 'bg-blue-50' : 'bg-white'
            }`}
            onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
          >
            <span className="font-medium">{item.term}</span>
            <span className="text-blue-500 transform transition-transform duration-200" style={{
              transform: expandedTerm === item.term ? 'rotate(180deg)' : 'none'
            }}>
              ▼
            </span>
          </button>
          <AnimatePresence>
            {expandedTerm === item.term && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t"
              >
                <div className="p-4 bg-blue-50">
                  <p className="text-gray-700 mb-3">{item.definition}</p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Example:</span> {item.example}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  </div>
);

const AdTechGlossary = () => {
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGlossary = glossaryTerms.map(category => ({
    ...category,
    terms: category.terms.filter(item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.terms.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">AdTech Glossary</h2>
          <p className="text-gray-600">
            Master the essential terms and metrics in mobile app marketing
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {filteredGlossary.map((category) => (
          <CategorySection
            key={category.category}
            category={category.category}
            terms={category.terms}
            expandedTerm={expandedTerm}
            setExpandedTerm={setExpandedTerm}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AdTechGlossary;
