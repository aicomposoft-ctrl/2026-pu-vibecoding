'use client';

import { SCENARIOS } from '@ai-sales-trainer/config';
import { Play } from 'lucide-react';

interface Props {
  onSelect: (scenarioId: string) => void;
}

const difficultyColor = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-red-100 text-red-700',
} as const;

export function ScenarioSelector({ onSelect }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {SCENARIOS.map((scenario) => (
        <div key={scenario.id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[scenario.difficulty]}`}>
              {scenario.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-3">{scenario.description}</p>
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Buyer Persona</p>
            <p className="text-sm text-gray-600">{scenario.buyerPersona}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Objectives</p>
            <ul className="space-y-1">
              {scenario.objectives.map((obj, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                  <span className="text-brand-500 mt-0.5">&#x2022;</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => onSelect(scenario.id)}
            className="btn-primary w-full gap-2"
          >
            <Play className="h-4 w-4" />
            Start Practice
          </button>
        </div>
      ))}
    </div>
  );
}
