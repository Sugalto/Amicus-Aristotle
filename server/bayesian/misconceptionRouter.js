import {
  getNodeById,
  getOutgoingEdges,
} from './misconceptionGraph.js';

function getCoverageMultiplier(nodeState) {
  if (!nodeState) {
    return 1;
  }

  const hasEvidence =
    (nodeState.evidenceCount || 0) > 0;

  switch (nodeState.state) {
    case 'dormant':
      return 1.25;

    case 'activated':
      return hasEvidence ? 1.1 : 0.8;

    case 'pressured':
      return hasEvidence ? 0.9 : 0.6;

    case 'inhibited':
      return 0.1;

    default:
      return 1;
  }
}

function getVisitMultiplier(nodeState) {
  if (!nodeState) {
    return 1;
  }

  const visits = nodeState.visitCount || 0;

  if (visits === 0) {
    return 1;
  }

  if (visits === 1) {
    return 0.85;
  }

  if (visits === 2) {
    return 0.7;
  }

  if (visits === 3) {
    return 0.55;
  }

  return 0.4;
}

function getBeliefMultiplier(nodeState) {
  if (!nodeState) {
    return 1;
  }

  const probability =
    nodeState.beliefProbability ?? 0.5;

  return 0.75 + (0.5 * probability);
}

export function getCandidateEdges(conversationState) {
  const activeNode = conversationState.activeNode;

  return getOutgoingEdges(activeNode).map((edge) => {
    const targetState =
      conversationState.nodeStates[edge.target];

    const coverageMultiplier =
      getCoverageMultiplier(targetState);

    const visitMultiplier =
      getVisitMultiplier(targetState);

    const beliefMultiplier =
      getBeliefMultiplier(targetState);

    const score =
      edge.weight *
      coverageMultiplier *
      visitMultiplier *
      beliefMultiplier;

    return {
      ...edge,
      coverageMultiplier,
      visitMultiplier,
      beliefMultiplier,
      score,
      targetNode: getNodeById(edge.target),
    };
  });
}

export function chooseNextNode(conversationState) {
  const candidates =
    getCandidateEdges(conversationState);

  if (candidates.length === 0) {
    return null;
  }

  const activeNode =
    getNodeById(conversationState.activeNode);

  const activeCluster =
    activeNode?.cluster;

  if (conversationState.clusterStreak > 3) {
    const bridgeCandidates =
      candidates.filter((candidate) => {
        const targetCluster =
          candidate.targetNode?.cluster;

        return (
          targetCluster &&
          targetCluster !== activeCluster &&
          candidate.weight > 0.7
        );
      });

    if (bridgeCandidates.length > 0) {
      bridgeCandidates.sort(
        (a, b) => b.score - a.score
      );

      return bridgeCandidates[0];
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  return candidates[0];
}