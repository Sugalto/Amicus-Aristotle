function clampProbability(value) {
  return Math.min(0.99, Math.max(0.01, value));
}

function probabilityToOdds(probability) {
  return probability / (1 - probability);
}

function oddsToProbability(odds) {
  return odds / (1 + odds);
}

function getLikelihoodRatio(evidenceType) {
  switch (evidenceType) {
    case 'supports':
      return 2.0;

    case 'challenges':
      return 0.5;

    case 'strong_support':
      return 3.0;

    case 'strong_challenge':
      return 0.33;

    case 'uncertain':
      return 1.0;

    default:
      throw new Error(
        `Unknown evidence type: ${evidenceType}`
      );
  }
}

export function updateBelief(
  conversationState,
  nodeId,
  evidenceType
) {
  const nodeState =
    conversationState.nodeStates[nodeId];

  if (!nodeState) {
    throw new Error(
      `Unknown misconception node: ${nodeId}`
    );
  }

  const prior =
    nodeState.beliefProbability ?? 0.5;

  const priorOdds =
    probabilityToOdds(prior);

  const likelihoodRatio =
    getLikelihoodRatio(evidenceType);

  const posteriorOdds =
    priorOdds * likelihoodRatio;

  const posterior =
    clampProbability(
      oddsToProbability(posteriorOdds)
    );

  nodeState.beliefProbability = posterior;
  nodeState.evidenceCount += 1;

  if (
    evidenceType === 'challenges' ||
    evidenceType === 'strong_challenge'
  ) {
    nodeState.state = 'pressured';
  } else if (
    evidenceType === 'supports' ||
    evidenceType === 'strong_support'
  ) {
    nodeState.state = 'activated';
  }

  return {
    nodeId,
    evidenceType,
    prior,
    likelihoodRatio,
    posterior,
  };
}