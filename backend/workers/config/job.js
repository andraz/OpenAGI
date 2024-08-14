/**
 * Default job configuration for adding jobs to the queue.
 * - Max attempts: 6
 * - Exponential backoff: Initial delay of 500ms, doubling each attempt.
 */
export default {
  attempts: 6,
  backoff: {
    type: 'exponential',
    delay: 500,
  },
}
