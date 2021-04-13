import { useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import styles from './Timer.module.css';

const Timer = () => {
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState('stop');

  useEffect(() => {
    let stream$ = new Subject();
    let myObservable = interval(1000);
    myObservable.pipe(takeUntil(stream$)).subscribe(() => {
      if (status === 'start') {
        setTimer(prev => prev + 1000);
      }
    });
    return () => {
      stream$.next();
      stream$.complete();
    };
  }, [status]);

  const onToggle = () => {
    if (status !== 'start') {
      setStatus('start');
    }
    if (status === 'start') {
      setStatus('stop');
      setTimer(0);
    }
  };

  const onReset = () => {
    setTimer(0);
  };

  const onWait = event => {
    setStatus('wait');
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerDisplay}>
        {new Date(timer).toISOString().slice(11, 19)}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
        <button className={styles.startButton} onClick={onToggle}>
          Start <span>Stop</span>
        </button>
        <button className={styles.waitButton} onDoubleClick={onWait}>
          Wait
        </button>
      </div>
    </div>
  );
};

export default Timer;
