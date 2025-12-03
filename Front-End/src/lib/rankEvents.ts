import { RankInfo } from '../components/AppContext';

// Custom event for rank-up celebrations
export const RANK_UP_EVENT = 'rank-up-celebration';

export function emitRankUpEvent(rankInfo: RankInfo) {
  const event = new CustomEvent(RANK_UP_EVENT, { detail: rankInfo });
  window.dispatchEvent(event);
}

export function onRankUp(callback: (rankInfo: RankInfo) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<RankInfo>;
    callback(customEvent.detail);
  };
  window.addEventListener(RANK_UP_EVENT, handler);
  return () => window.removeEventListener(RANK_UP_EVENT, handler);
}
