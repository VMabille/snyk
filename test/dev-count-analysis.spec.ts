import {
  getTimestampStartOfContributingDevTimeframe,
  separateLines,
  execShell,
  runGitLog,
  buildGitLogCommandLine,
  CONTRIBUTING_DEVELOPER_PERIOD_DAYS,
} from '../src/lib/monitor/dev-count-analysis';

describe('git log command line', () => {
  it('should include `--no-merges` and correct start timestamp', () => {
    const dEndMilliseconds = 1590174610000; // arbitrary timestamp in ms since epoch
    const exectedStartTimestampSeconds = 1590174610 - 90 * 24 * 60 * 60; // should be 1582398610
    const dEnd = new Date(dEndMilliseconds);
    expect(exectedStartTimestampSeconds).toBe(1582398610);
    const timestampStartOfContributingDeveloperPeriod = getTimestampStartOfContributingDevTimeframe(
      dEnd,
      CONTRIBUTING_DEVELOPER_PERIOD_DAYS,
    );
    const gitLogCommandLine = buildGitLogCommandLine(
      timestampStartOfContributingDeveloperPeriod,
    );
    // Note how the command line must include `--no-merges` and `--after="1582398610"`
    expect(gitLogCommandLine).toBe(
      'git --no-pager log --no-merges --pretty=tformat:"%H_SNYK_SEPARATOR_%an_SNYK_SEPARATOR_%ae_SNYK_SEPARATOR_%aI" --after="1582398610"',
    );
  });

  // This test does NOT mock the actual git log call but calls legit git log commands. Thus it is a good candidate for moving
  // into a seperate test suite (system tests or something) where this is more normal once we have enough Jest tests to make such
  // structuring more worthwhile.
  it('does not return merge commits (when run)', async () => {
    // 1590174610000 is a somewhat arbitrary timestamp (which happens to be May 22, 2020 for now particular reason) in ms since epoch
    // and we know that the timestamp of 90 days up to that timestamp includes many regular commits and many merge commits.
    const dEndMilliseconds = 1590174610000;
    const dEnd = new Date(dEndMilliseconds);

    const timestampStartOfContributingDeveloperPeriod = getTimestampStartOfContributingDevTimeframe(
      dEnd,
      CONTRIBUTING_DEVELOPER_PERIOD_DAYS,
    );

    const legitGitLogCommand = buildGitLogCommandLine(
      timestampStartOfContributingDeveloperPeriod,
    );
    const legitGitLogResults = await runGitLog(
      legitGitLogCommand,
      process.cwd(),
      execShell,
    );
    const legitLogLines = separateLines(legitGitLogResults);
    const legitCommitHashes = legitLogLines.map((l) => l.substring(0, 40));

    // modified git log command to include the "subject" and to remove the `--no-merges`
    let modifiedGitLogCommand = legitGitLogCommand.replace(' --no-merges', '');
    modifiedGitLogCommand = modifiedGitLogCommand.replace(
      '%H_SNYK_SEPARATOR_%an_SNYK_SEPARATOR_%ae_SNYK_SEPARATOR_%aI',
      '%H_SNYK_SEPARATOR_%an_SNYK_SEPARATOR_%ae_SNYK_SEPARATOR_%aI_SNYK_SEPARATOR_%s',
    );

    const gitLogResultsWithMerges = await runGitLog(
      modifiedGitLogCommand,
      process.cwd(),
      execShell,
    );

    const withMergesLogLines = separateLines(gitLogResultsWithMerges);
    const withMergesCommitHashes = withMergesLogLines
      .filter((l) => l.includes('Merge pull request'))
      .map((l) => l.substring(0, 40));

    // Now make sure that no hash in mergedCommitHashes is found in legitCommitHashes (i.e. that they are totally disjoint).
    const intersection = withMergesCommitHashes.filter((mergeCommitHash) =>
      legitCommitHashes.includes(mergeCommitHash),
    );
    expect(intersection).toHaveLength(0);
  });
});
