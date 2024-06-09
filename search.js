import { getFilteredThreads } from './calls.js'

/**
 * TODO:
 * - Search more replies if necessary
 * - loading screen?
 * - view more pages, maybe save page id in cookie
 * - display profile images (broken)
 */

const MAX_PAGES = 50

export async function searchComments(video, user, maxPages = MAX_PAGES) {
  if (!video) {
    return { threads: [], pages: 0 };
  }

  let filtered = [];
  let pageToken = null;
  let pages = 0;
  console.log("new search with url: %s", video);
  
  while (pageToken != -1 && pages < maxPages) {
    const response = await getFilteredThreads(video, user, pageToken);
    filtered = filtered.concat(response.data);
    pageToken = response.next;
    pages += 1;
    console.log("pages scanned: %d\t found: %d", pages, filtered.length);
  }

  return { threads: filtered, pages: pages };
}

export async function searchToConsole(video, user) {
  const { threads, pages } = await searchComments(video, user);
  
  threads.forEach((thread) => {
    let parent = thread.snippet.topLevelComment.snippet;
    console.log("%s: %s", parent.authorDisplayName, parent.textOriginal);
    if (Object.hasOwn(thread, 'replies')) {
      thread.replies.comments.forEach(comment => {
        let child = comment.snippet;
        console.log("\t%s: %s", child.authorDisplayName, child.textOriginal);
      });
      const replyCount = thread.snippet.totalReplyCount;
      const displayCount = thread.replies.comments.length;
      if (replyCount > displayCount) {
        console.log("*****************(%d more replies)*****************", replyCount - displayCount);
      }
    }
    console.log("---------------------------------------------------------------\n");
  });
  console.log("pages: %s", pages);
  console.log("threads found: %s", threads.length);
}

