/**
 * ## 문제 B
 *
 * <준비>
 * 1. npm run dev 로 개발서버를 실행합니다.
 * 2. http://localhost:8000/chapters/chapter1/b.html 로 접속하면 UI를 확인할 수 있어요.
 * 3. 버튼을 클릭 했을 때, 로딩이 멈추는 것을 볼 수 있습니다.
 *
 * <목표>
 * "b.js"의 [HardWork] 클래스의 do() 메서드를 개선하여
 * 버튼을 클릭 했을 때, 로딩이 멈추지 않도록 합니다.
 * 그리고 순차적으로 연산되는 결과가 지속적으로 화면에 노출됩니다.
 *
 * <조건>
 * 1. 정의된 메서드 중 do() 메서드만 수정가능 합니다. (추가적인 메서드를 정의하는 것도 가능)
 * 2. async/await 문법을 사용할 수 없습니다.
 * 3. task가 순차적으로 실행되어야 합니다. (반드시 이전 task가 완료되고 다음 task가 실행)
 *
 * <제출물>
 * 1. 코드를 확인할 수 있는 링크 또는 코드 캡쳐 이미지
 */

/**
 * @description
 * 고비용 연산을 하는 모듈입니다.
 * 삼만개의 _task를 순차적으로 연산합니다.
 */
class HardWork {
  constructor() {
    this._result = 0; // _result 인스턴스 변수 초기화
    this._tasks = this._initTasks(); // _initTasks 메서드를 호출하여 반환된 tasks 배열을 _tasks 프로퍼티에 할당
  }

  do() {
    /* for (let i = 0; i < this._tasks.length; i++) {
      this._tasks[i]();
      console.log(this._tasks[i]());
    } */
    /*  this._tasks.reduce((prevPromise, currentTask) => {
      return prevPromise.then(
        () =>
          new Promise((resolve) => {
            currentTask();
            resolve();
          })
      );
    }, Promise.resolve()); */
    /* 
    // _tasks 배열의 각 작업을 순차적으로 실행하기 위한 초기 Promise 체인을 시작합니다.
    let promiseChain = Promise.resolve();

    // _tasks 배열을 순회하며 각 작업을 순차적으로 실행할 Promise 체인을 구성합니다.
    this._tasks.forEach((task) => {
      promiseChain = promiseChain.then(
        () =>
          new Promise((resolve) => {
            // 작업을 동기적으로 실행하고, 완료되면 resolve를 호출하여 다음 작업으로 넘어갑니다.
            task();
            resolve();
          })
      );
    }); */

    /*  let promiseChain = Promise.resolve();

    // _tasks 배열을 순회하며 각 작업을 순차적으로 실행할 Promise 체인을 구성합니다.
    this._tasks.forEach((task, index) => {
      promiseChain = promiseChain.then(
        () =>
          new Promise((resolve) => {
            task(); // 작업 실행
            // 이 시점에서 UI 업데이트가 필요할 경우, 여기서 진행 상태를 업데이트하는 로직을 추가할 수 있습니다.
            console.log(
              `Task ${index + 1} completed. Current result: ${this._result}`
            );
            resolve();
          })
      );
    }); */

    let promiseChain = Promise.resolve();

    // _tasks 배열을 순회하며 각 작업을 순차적으로 실행할 Promise 체인을 구성합니다.
    this._tasks.forEach((task, index) => {
      promiseChain = promiseChain.then(
        () =>
          new Promise((resolve) => {
            const taskPromise = new Promise(task); // 현재 작업을 Promise로 실행
            taskPromise.then(() => {
              // 작업 완료 후의 처리 로직
              // 이 경우에는 작업 완료 시 특별한 처리가 필요 없으므로, 단순히 resolve를 호출합니다.
              resolve();
            });
            // 주의: 실제 작업(task 함수)이 비동기적으로 this._result를 업데이트하는지 확인해야 합니다.
            // 그렇지 않다면, 여기서 this._result를 업데이트하는 로직을 추가할 필요가 있습니다.
          })
      );
    });

    promiseChain.then(() => {
      console.log('모든 작업 완료');
      // 모든 작업이 완료된 후 필요한 처리를 여기에 추가합니다.
      // 예: UI에 최종 상태를 표시
    });
  }

  // do() 이외의 메서드는 수정하지마세요
  get result() {
    return this._result;
  }
  _initTasks() {
    const count = 30000;
    const tasks = new Array(count);

    for (let i = 0; i < count; i++) {
      tasks[i] = this._createTask(Math.floor(Math.random() * 3) + 1);
    }

    return tasks;
  }
  _createTask = (n) => () => {
    for (let i = 0; i < 1000; i++) {
      const randnum = Math.random();
      const alpha = Math.floor(randnum * 10) % n;

      if (alpha > 0) {
        this._result += alpha;
      }
    }

    this._sendLog();
  };
  async _sendLog() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            value: this._result.toFixed(2),
          },
          null,
          2
        ),
      ],
      {
        type: 'application/json',
      }
    );

    const res = await blob.text();
    JSON.parse(res);
  }
  //- do() 이외의 메서드는 수정하지마세요
}

// 수정하지마세요
/**
 * @description
 * 로딩 애니메이션을 무한루프로 돌아가도록 합니다.
 */
class Dashboard {
  constructor(work) {
    this._indicatorElement = document.getElementById('indicator');
    this._descriptionElement = document.getElementById('desc');
    this._startTimestamp = 0;
    this._work = work;
  }

  start() {
    this._startTimestamp = Date.now();
    requestAnimationFrame(this._render);
  }

  _render = () => {
    const timestamp = Date.now();
    const percent = (((timestamp - this._startTimestamp) * 5) % 10000) / 100;

    this._indicatorElement.style.setProperty('width', `${percent}%`);
    this._descriptionElement.innerHTML = `업무량: ${this._work.result}`;

    requestAnimationFrame(this._render);
  };
}

async function main() {
  const hardWork = new HardWork();
  const dashboard = new Dashboard(hardWork);

  dashboard.start();
  document.getElementById('btn').addEventListener('click', () => {
    hardWork.do();
  });
}

main();
//- 수정하지마세요
