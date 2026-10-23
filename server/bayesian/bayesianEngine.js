import {
  createConversationState,
  activateNode,
  advanceTurn,
  getIntegrationCoverage,
  canEndConversation,
} from './conversationState.js';

import {
  updateBelief,
} from './beliefUpdater.js';

import {
  chooseNextNode,
} from './misconceptionRouter.js';

export function createBayesianSession() {
  const state = createConversationState();

  activateNode(state, 'M1.00');
  state.focusEvidenceTurns = 0;

  return state;
}

export function processEvidence(
  conversationState,
  evidence
) {
  advanceTurn(conversationState);

  const hasUsableEvidence =
    evidence &&
    evidence.nodeId &&
    evidence.evidenceType !== 'uncertain' &&
    evidence.confidence >= 0.5;

  if (!hasUsableEvidence) {
    const integrationCoverage =
      getIntegrationCoverage(
        conversationState
      );

    return {
      evidence,
      route: null,
      activeNode:
        conversationState.activeNode,
      turnCount:
        conversationState.turnCount,
      integrationCoverage,
      canEnd:
        canEndConversation(
          conversationState
        ),
    };
  }

  updateBelief(
    conversationState,
    evidence.nodeId,
    evidence.evidenceType
  );

  // A single relevant claim is not sufficient to move to another node.
  // Keep collecting evidence and allow Aristotle to ask a follow-up.
  conversationState.focusEvidenceTurns =
    (conversationState.focusEvidenceTurns || 0) + 1;

  const canConsiderTransition =
    conversationState.focusEvidenceTurns >= 2 &&
    ['challenges', 'strong_challenge'].includes(evidence.evidenceType);

  const route = canConsiderTransition
    ? chooseNextNode(conversationState)
    : null;

  if (route?.target) {
    activateNode(
      conversationState,
      route.target
    );
    conversationState.focusEvidenceTurns = 0;
  }

  const integrationCoverage =
    getIntegrationCoverage(
      conversationState
    );

  const canEnd =
    canEndConversation(
      conversationState
    );

  return {
    evidence,
    route,
    activeNode:
      conversationState.activeNode,
    turnCount:
      conversationState.turnCount,
    integrationCoverage,
    canEnd,
  };
}