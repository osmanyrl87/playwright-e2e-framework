/**
 * Public demo accounts published on the SauceDemo login page.
 * They are not secrets; the site is built for test-automation practice.
 */
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
  performanceGlitch: { username: 'performance_glitch_user', password: PASSWORD },
} as const;

export type User = { username: string; password: string };
