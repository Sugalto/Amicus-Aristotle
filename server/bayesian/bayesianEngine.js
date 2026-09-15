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

  const route =
    chooseNextNode(conversationState);

  if (route?.target) {
    activateNode(
      conversationState,
      route.target
    );
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