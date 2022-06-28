const REPEAT_COUNT = 100000 as const;

function checkExecuteTime(
  func: (repeat_count: number) => Promise<void>
): Promise<number> {
  return new Promise(resolve => {
    const previous_time = Date.now();
    func(REPEAT_COUNT).then(() => resolve(Date.now() - previous_time));
  });
}
function testForLoop(repeat_count: number): Promise<void> {
  return new Promise(resolve => {
    for (let i = 0; i < repeat_count; i++) {}
    resolve();
  });
}
function testForLoopWithIO(repeat_count: number): Promise<void> {
  return new Promise(resolve => {
    for (let i = 0; i < repeat_count; i++) {
      console.log("...");
    }
    resolve();
  });
}

checkExecuteTime(testForLoop);
checkExecuteTime(testForLoopWithIO);

(async () => {
  const results = [
    await checkExecuteTime(testForLoop),
    await checkExecuteTime(testForLoopWithIO),
  ];
  const results2 = await Promise.all([
    checkExecuteTime(testForLoop),
    checkExecuteTime(testForLoopWithIO),
  ]);
  console.log(results, results2);
})();
