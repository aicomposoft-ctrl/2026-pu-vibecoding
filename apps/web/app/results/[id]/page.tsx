import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/db';
import { AnalysisView } from '@/components/results/analysis-view';
import { TranscriptReplay } from '@/components/results/transcript-replay';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ResultDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth');

  const userId = (session.user as Record<string, unknown>).id as string;

  const conversation = await prisma.conversation.findFirst({
    where: { id: params.id, userId },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      analysis: true,
    },
  });

  if (!conversation) {
    redirect('/results');
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/results" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{conversation.title || conversation.scenario}</h1>
        <p className="text-gray-500 mt-1">
          {new Date(conversation.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {conversation.duration && ` \u2022 ${Math.floor(conversation.duration / 60)}m ${conversation.duration % 60}s`}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {conversation.analysis ? (
          <AnalysisView analysis={{
            id: conversation.analysis.id,
            overallScore: conversation.analysis.overallScore,
            rapport: conversation.analysis.rapport,
            discovery: conversation.analysis.discovery,
            presentation: conversation.analysis.presentation,
            objections: conversation.analysis.objections,
            closing: conversation.analysis.closing,
            feedback: conversation.analysis.feedback,
            strengths: conversation.analysis.strengths,
            improvements: conversation.analysis.improvements,
          }} />
        ) : (
          <div className="card flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-gray-500">Analysis not yet available.</p>
              <p className="text-sm text-gray-400 mt-1">It will be generated when the session completes.</p>
            </div>
          </div>
        )}

        <TranscriptReplay messages={conversation.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }))} />
      </div>
    </div>
  );
}
