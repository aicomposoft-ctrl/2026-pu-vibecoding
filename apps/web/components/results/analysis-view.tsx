import type { AnalysisResult } from '@ai-sales-trainer/shared-types';
import { ANALYSIS_CATEGORIES } from '@ai-sales-trainer/config';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function AnalysisView({ analysis }: Props) {
  const overallColor =
    analysis.overallScore >= 80
      ? 'text-green-600'
      : analysis.overallScore >= 60
      ? 'text-yellow-600'
      : 'text-red-600';

  const scores: Record<string, number> = {
    rapport: analysis.rapport,
    discovery: analysis.discovery,
    presentation: analysis.presentation,
    objections: analysis.objections,
    closing: analysis.closing,
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className={`text-4xl font-bold ${overallColor}`}>
            {analysis.overallScore}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Overall Score</h3>
            <p className="text-sm text-gray-500">Based on 5 key sales dimensions</p>
          </div>
        </div>

        <div className="space-y-4">
          {ANALYSIS_CATEGORIES.map((cat) => (
            <ScoreBar
              key={cat.key}
              label={cat.label}
              score={scores[cat.key] ?? 0}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Feedback</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.feedback}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h4 className="flex items-center gap-1.5 font-semibold text-green-700 mb-3">
            <TrendingUp className="h-4 w-4" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">&#x2713;</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h4 className="flex items-center gap-1.5 font-semibold text-orange-700 mb-3">
            <TrendingDown className="h-4 w-4" />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {analysis.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                <span className="text-orange-500 mt-0.5">&#x25CB;</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
