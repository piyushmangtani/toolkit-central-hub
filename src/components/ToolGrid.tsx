
import React from 'react';
import ToolCard from './ToolCard';

const ToolGrid: React.FC = () => {
  const tools = [
    {
      type: 'case-retagging' as const,
      title: 'Case Retagging',
      description: 'Efficiently organize and retag your case files with our intuitive interface.'
    },
    {
      type: 'insight-archiving' as const,
      title: 'Insight Archiving',
      description: 'Archive and retrieve valuable insights with our powerful search capabilities.'
    },
    {
      type: 'logo-slide-generator' as const,
      title: 'Logo Slide Generator',
      description: 'Create professional logo slides for your presentations in minutes.'
    },
    {
      type: 'iris-image-scrapper' as const,
      title: 'IRIS Image Scrapper',
      description: 'Extract and process images from documents with precision and accuracy.'
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tools.map((tool) => (
            <div key={tool.type} className="group animate-float">
              <ToolCard
                type={tool.type}
                title={tool.title}
                description={tool.description}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolGrid;
